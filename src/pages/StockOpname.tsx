import { useState } from "react";
import { ClipboardCheck, Plus, Trash2, Eye, Loader2, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useStockOpnameSessions, useInsertSession, useUpdateSession, useDeleteSession } from "@/hooks/useStockOpname";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";

const StockOpname = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { data: sessions = [], isLoading } = useStockOpnameSessions();
  const insertSession = useInsertSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) { toast.error(t("soTitleRequired")); return; }
    try {
      await insertSession.mutateAsync({
        title: title.trim(),
        description: desc.trim(),
        start_date: startDate,
        end_date: endDate || undefined,
      });
      toast.success(t("soCreated"));
      setOpen(false);
      setTitle(""); setDesc(""); setEndDate("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await updateSession.mutateAsync({ id, status: "Berlangsung" });
      toast.success(t("soStarted"));
    } catch (err: any) { toast.error(err.message); }
  };

  const handleFinish = async (id: string) => {
    try {
      await updateSession.mutateAsync({ id, status: "Selesai" });
      toast.success(t("soFinished"));
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession.mutateAsync(id);
      toast.success(t("soDeleted"));
    } catch (err: any) { toast.error(err.message); }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "secondary" | "default" | "destructive" | "outline"; label: string }> = {
      Draft: { variant: "secondary", label: t("soDraft") },
      Berlangsung: { variant: "default", label: t("soInProgress") },
      Selesai: { variant: "outline", label: t("soCompleted") },
    };
    const s = map[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" /> {t("stockOpname")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("soDesc")}</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1.5 h-4 w-4" /> {t("soNewSession")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("soNewSession")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t("soSessionTitle")} *</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("soTitlePlaceholder")} />
                </div>
                <div>
                  <Label>{t("description")}</Label>
                  <Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t("soStartDate")}</Label>
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>{t("soEndDate")}</Label>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={insertSession.isPending} className="w-full">
                  {insertSession.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                  {t("save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{t("noData")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s.id} className="kpi-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold flex items-center gap-2">
                  {s.title} {statusBadge(s.status)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.start_date}{s.end_date ? ` — ${s.end_date}` : ""} · {s.description || "-"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => navigate(`/stock-opname/${s.id}`)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> {t("details")}
                </Button>
                {isAdmin && s.status === "Draft" && (
                  <Button size="sm" variant="outline" onClick={() => handleStart(s.id)}>
                    <Play className="mr-1.5 h-3.5 w-3.5" /> {t("soStart")}
                  </Button>
                )}
                {isAdmin && s.status === "Berlangsung" && (
                  <Button size="sm" variant="outline" onClick={() => handleFinish(s.id)}>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> {t("soFinish")}
                  </Button>
                )}
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirm")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("soDeleteConfirm")}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(s.id)}>{t("delete")}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockOpname;
