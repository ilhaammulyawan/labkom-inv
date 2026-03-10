import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers, useUpdateUserRole, useDeleteUser, AppRole } from "@/hooks/useUsers";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Trash2, Shield, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ManageUsers = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error(t("accessDenied"), { description: t("onlyAdmin") });
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate, t]);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    if (userId === user?.id) { toast.error(t("cannotChangeOwnRole")); return; }
    try { await updateRole.mutateAsync({ userId, role: newRole }); toast.success(`${t("roleChangedTo")} ${newRole}`); }
    catch (err: any) { toast.error(t("roleFailed"), { description: err.message }); }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === user?.id) { toast.error(t("cannotDeleteSelf")); setDeleteDialogOpen(false); return; }
    try { await deleteUser.mutateAsync(deletingUser.id); toast.success(t("userDeleted")); }
    catch (err: any) { toast.error(t("deleteUserFailed"), { description: err.message }); }
    setDeleteDialogOpen(false); setDeletingUser(null);
  };

  const getInitials = (name: string | null, id: string) => name ? name.slice(0, 2).toUpperCase() : id.slice(0, 2).toUpperCase();

  if (isLoading || roleLoading) return <div className="space-y-6 animate-fade-in max-w-4xl"><Skeleton className="h-8 w-64" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2"><Users className="h-5 w-5" /> {t("manageUsers")}</h1>
        <p className="text-sm text-muted-foreground">{users?.length || 0} {t("registeredUsers")}</p>
      </div>

      <div className="kpi-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t("user")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t("role")}</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarImage src={u.avatar_url || undefined} /><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{getInitials(u.full_name, u.id)}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-xs">{u.full_name || "—"}</p><p className="text-[10px] text-muted-foreground sm:hidden font-mono">{u.id.slice(0, 8)}...</p></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell"><span className="font-mono text-[10px] text-muted-foreground">{u.id.slice(0, 12)}...</span></td>
                  <td className="py-3 px-4">
                    <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v as AppRole)} disabled={u.id === user?.id}>
                      <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin"><span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-primary" /> {t("admin")}</span></SelectItem>
                        <SelectItem value="user"><span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-muted-foreground" /> {t("user")}</span></SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setDeletingUser({ id: u.id, name: u.full_name || u.id }); setDeleteDialogOpen(true); }} disabled={u.id === user?.id}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (<tr><td colSpan={4} className="py-12 text-center text-muted-foreground">{t("noUsers")}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteUser")}</AlertDialogTitle>
            <AlertDialogDescription>"{deletingUser?.name}" {t("deleteUserDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUsers;
