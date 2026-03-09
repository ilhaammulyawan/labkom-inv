import { useState, useEffect, useRef } from "react";
import { useItems } from "@/hooks/useItems";
import { useMaintenanceSchedules, useInsertSchedule, useUpdateSchedule, useDeleteSchedule, type MaintenanceSchedule } from "@/hooks/useMaintenanceSchedules";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, PlusCircle, Pencil, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";

const FREQ_LABELS: Record<string, string> = {
  weekly: "Mingguan",
  monthly: "Bulanan",
  quarterly: "3 Bulanan",
  biannual: "6 Bulanan",
  yearly: "Tahunan",
};

const MaintenanceSchedulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<MaintenanceSchedule | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: items = [] } = useItems();
  const { data: schedules = [], isLoading } = useMaintenanceSchedules();
  const { isAdmin } = useUserRole();
  const insertMut = useInsertSchedule();
  const updateMut = useUpdateSchedule();
  const deleteMut = useDeleteSchedule();
  const { toast } = useToast();
  const highlightRef = useRef<HTMLDivElement>(null);

  // Scroll to highlighted item
  useEffect(() => {
    if (highlightId && highlightRef.current && !isLoading) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Clear highlight param after 3s
      const timer = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, isLoading, setSearchParams]);

  // Form state
  const [formItemId, setFormItemId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFreq, setFormFreq] = useState("monthly");
  const [formDueDate, setFormDueDate] = useState("");
  const [formTechnician, setFormTechnician] = useState("");

  const resetForm = () => {
    setFormItemId(""); setFormTitle(""); setFormDesc(""); setFormFreq("monthly");
    setFormDueDate(""); setFormTechnician("");
  };

  const openAdd = () => { resetForm(); setEditRecord(null); setFormOpen(true); };
  const openEdit = (s: MaintenanceSchedule) => {
    setEditRecord(s);
    setFormItemId(s.item_id); setFormTitle(s.title); setFormDesc(s.description);
    setFormFreq(s.frequency); setFormDueDate(s.next_due_date); setFormTechnician(s.assigned_technician);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!formItemId || !formTitle || !formDueDate) {
      toast({ title: "Error", description: "Isi semua field wajib", variant: "destructive" });
      return;
    }
    try {
      if (editRecord) {
        await updateMut.mutateAsync({
          id: editRecord.id, item_id: formItemId, title: formTitle, description: formDesc,
          frequency: formFreq, next_due_date: formDueDate, assigned_technician: formTechnician,
        });
        toast({ title: "Berhasil", description: "Jadwal diperbarui" });
      } else {
        await insertMut.mutateAsync({
          item_id: formItemId, title: formTitle, description: formDesc, frequency: formFreq,
          next_due_date: formDueDate, assigned_technician: formTechnician, is_active: true,
          last_performed_date: null,
        });
        toast({ title: "Berhasil", description: "Jadwal ditambahkan" });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  const handleMarkDone = async (s: MaintenanceSchedule) => {
    const today = new Date().toISOString().split("T")[0];
    const nextDate = new Date(s.next_due_date);
    const freqDays: Record<string, number> = { weekly: 7, monthly: 30, quarterly: 90, biannual: 180, yearly: 365 };
    nextDate.setDate(nextDate.getDate() + (freqDays[s.frequency] || 30));
    try {
      await updateMut.mutateAsync({
        id: s.id,
        last_performed_date: today,
        next_due_date: nextDate.toISOString().split("T")[0],
      });
      toast({ title: "Berhasil", description: "Jadwal ditandai selesai, tanggal berikutnya diperbarui" });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast({ title: "Berhasil", description: "Jadwal dihapus" });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
    setDeleteId(null);
  };

  const getItemById = (id: string) => items.find(i => i.id === id);
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarClock className="h-6 w-6" /> Jadwal Maintenance
          </h1>
          <p className="text-sm text-muted-foreground">{schedules.length} jadwal terdaftar</p>
        </div>
        {isAdmin && (
          <Button onClick={openAdd} className="gradient-primary text-primary-foreground border-0 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {schedules.map(s => {
          const item = getItemById(s.item_id);
          const isOverdue = s.next_due_date <= today && s.is_active;
          const isHighlighted = highlightId === s.id;
          return (
            <div
              key={s.id}
              ref={isHighlighted ? highlightRef : undefined}
              className={`kpi-card space-y-3 transition-all duration-500 ${isOverdue ? 'border-destructive/50' : ''} ${isHighlighted ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item?.name} ({item?.inventory_code})</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-[10px]">
                    {FREQ_LABELS[s.frequency] || s.frequency}
                  </Badge>
                  {!s.is_active && <Badge variant="outline" className="text-[10px]">Nonaktif</Badge>}
                </div>
              </div>
              <div className="text-xs space-y-1">
                {s.description && <p>{s.description}</p>}
                <p><span className="text-muted-foreground">Jadwal Berikutnya:</span> <span className={isOverdue ? 'text-destructive font-semibold' : ''}>{s.next_due_date}</span></p>
                {s.last_performed_date && <p><span className="text-muted-foreground">Terakhir Dilakukan:</span> {s.last_performed_date}</p>}
                {s.assigned_technician && <p><span className="text-muted-foreground">Teknisi:</span> {s.assigned_technician}</p>}
              </div>
              {isAdmin && (
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleMarkDone(s)}>
                    <CheckCircle className="h-3 w-3" /> Selesai
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openEdit(s)}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteId(s.id)}>
                    <Trash2 className="h-3 w-3" /> Hapus
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {schedules.length === 0 && <p className="text-center text-muted-foreground py-12">Belum ada jadwal maintenance</p>}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editRecord ? "Edit Jadwal" : "Tambah Jadwal Maintenance"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Barang *</Label>
              <Select value={formItemId} onValueChange={setFormItemId}>
                <SelectTrigger><SelectValue placeholder="Pilih barang..." /></SelectTrigger>
                <SelectContent>
                  {items.map(item => <SelectItem key={item.id} value={item.id}>{item.name} ({item.inventory_code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Judul Jadwal *</Label>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Cleaning, Service Rutin..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Deskripsi</Label>
              <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Detail maintenance..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Frekuensi *</Label>
                <Select value={formFreq} onValueChange={setFormFreq}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(FREQ_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tanggal Berikutnya *</Label>
                <Input type="date" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teknisi</Label>
              <Input value={formTechnician} onChange={e => setFormTechnician(e.target.value)} placeholder="Nama teknisi..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
              <Button onClick={handleSave} disabled={insertMut.isPending || updateMut.isPending} className="gradient-primary text-primary-foreground border-0">
                {(insertMut.isPending || updateMut.isPending) ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={v => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
            <AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaintenanceSchedulePage;
