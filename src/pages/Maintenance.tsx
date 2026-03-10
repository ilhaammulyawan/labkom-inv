import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useMaintenanceRecords, useUpdateMaintenance, useDeleteMaintenance, type MaintenanceRecord, type MaintenanceStatus } from "@/hooks/useMaintenance";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/mock-data";
import { MaintenanceBadge } from "@/components/ConditionBadge";
import { AddMaintenanceDialog } from "@/components/AddMaintenanceDialog";
import { EditMaintenanceDialog } from "@/components/EditMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Wrench, PlusCircle, Pencil, Trash2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const NEXT_STATUS: Record<MaintenanceStatus, MaintenanceStatus | null> = {
  "Antrian": "Dalam Perbaikan",
  "Dalam Perbaikan": "Selesai",
  "Selesai": null,
};

const Maintenance = () => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<MaintenanceRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: items = [] } = useItems();
  const { data: maintenanceRecords = [], isLoading } = useMaintenanceRecords();
  const { isAdmin } = useUserRole();
  const updateMutation = useUpdateMaintenance();
  const deleteMutation = useDeleteMaintenance();
  const { toast } = useToast();

  const getItemById = (id: string) => items.find(i => i.id === id);
  const filtered = maintenanceRecords.filter(m => statusFilter === "all" || m.status === statusFilter);

  const handleAdvanceStatus = async (record: MaintenanceRecord) => {
    const next = NEXT_STATUS[record.status];
    if (!next) return;
    try {
      await updateMutation.mutateAsync({ id: record.id, status: next, ...(next === "Selesai" ? { repair_date: new Date().toISOString().split("T")[0] } : {}) });
      toast({ title: t("statusUpdated"), description: `${t("statusChangedTo")} "${next}"` });
    } catch (e: any) { toast({ title: t("failed"), description: e.message, variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteMutation.mutateAsync(deleteId); toast({ title: t("success"), description: t("maintenanceRecordDeleted") }); }
    catch (e: any) { toast({ title: t("failed"), description: e.message, variant: "destructive" }); }
    setDeleteId(null);
  };

  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Wrench className="h-6 w-6" /> {t("maintenanceAndRepair")}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} {t("maintenanceRecords")}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddOpen(true)} className="gradient-primary text-primary-foreground border-0 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> {t("recordMaintenance")}
          </Button>
        )}
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48"><SelectValue placeholder={t("filter")} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatus")}</SelectItem>
          <SelectItem value="Antrian">{t("maintenanceQueue")}</SelectItem>
          <SelectItem value="Dalam Perbaikan">{t("maintenanceInProgress")}</SelectItem>
          <SelectItem value="Selesai">{t("maintenanceDone")}</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4">
        {filtered.map(m => {
          const item = getItemById(m.item_id);
          const nextStatus = NEXT_STATUS[m.status];
          return (
            <div key={m.id} className="kpi-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item?.name || t("unknown")}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{item?.inventory_code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MaintenanceBadge status={m.status} />
                  {isAdmin && nextStatus && (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1" onClick={() => handleAdvanceStatus(m)} disabled={updateMutation.isPending}>
                      <ArrowRight className="h-3 w-3" /> {nextStatus}
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-muted-foreground">{t("damageDate")}:</span> {m.issue_date}</p>
                <p><span className="text-muted-foreground">{t("problem")}:</span> {m.description}</p>
                {m.repair_date && <p><span className="text-muted-foreground">{t("repairDate")}:</span> {m.repair_date}</p>}
                {m.action && <p><span className="text-muted-foreground">{t("actionTaken")}:</span> {m.action}</p>}
                {m.cost != null && m.cost > 0 && <p><span className="text-muted-foreground">{t("cost")}:</span> {formatCurrency(m.cost)}</p>}
                <p><span className="text-muted-foreground">{t("technician")}:</span> {m.technician}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setEditRecord(m)}><Pencil className="h-3 w-3" /> {t("edit")}</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteId(m.id)}><Trash2 className="h-3 w-3" /> {t("delete")}</Button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">{t("noMaintenanceData")}</p>}
      </div>

      <AddMaintenanceDialog open={addOpen} onOpenChange={setAddOpen} items={items} />
      <EditMaintenanceDialog open={!!editRecord} onOpenChange={(v) => !v && setEditRecord(null)} items={items} record={editRecord} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteMaintenanceRecord")}</AlertDialogTitle>
            <AlertDialogDescription>{t("dataDeletedPermanently")}</AlertDialogDescription>
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

export default Maintenance;
