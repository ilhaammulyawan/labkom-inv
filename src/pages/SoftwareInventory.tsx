import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useSoftwareInventory, useInsertSoftware, useUpdateSoftware, useDeleteSoftware, type SoftwareItem } from "@/hooks/useSoftwareInventory";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AppWindow, PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const SoftwareInventoryPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<SoftwareItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterItemId, setFilterItemId] = useState("all");
  const { data: items = [] } = useItems();
  const { data: software = [], isLoading } = useSoftwareInventory();
  const { isAdmin } = useUserRole();
  const insertMut = useInsertSoftware();
  const updateMut = useUpdateSoftware();
  const deleteMut = useDeleteSoftware();
  const { toast } = useToast();

  // Form state
  const [fItemId, setFItemId] = useState("");
  const [fName, setFName] = useState("");
  const [fVersion, setFVersion] = useState("");
  const [fLicenseType, setFLicenseType] = useState("");
  const [fLicenseKey, setFLicenseKey] = useState("");
  const [fExpiry, setFExpiry] = useState("");
  const [fNotes, setFNotes] = useState("");

  const resetForm = () => {
    setFItemId(""); setFName(""); setFVersion(""); setFLicenseType("");
    setFLicenseKey(""); setFExpiry(""); setFNotes("");
  };

  const openAdd = () => { resetForm(); setEditRecord(null); setFormOpen(true); };
  const openEdit = (s: SoftwareItem) => {
    setEditRecord(s);
    setFItemId(s.item_id); setFName(s.software_name); setFVersion(s.version);
    setFLicenseType(s.license_type); setFLicenseKey(s.license_key);
    setFExpiry(s.expiry_date || ""); setFNotes(s.notes);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!fItemId || !fName) {
      toast({ title: "Error", description: "Isi barang dan nama software", variant: "destructive" });
      return;
    }
    try {
      const payload = {
        item_id: fItemId, software_name: fName, version: fVersion,
        license_type: fLicenseType, license_key: fLicenseKey,
        expiry_date: fExpiry || null, notes: fNotes,
      };
      if (editRecord) {
        await updateMut.mutateAsync({ id: editRecord.id, ...payload });
        toast({ title: "Berhasil", description: "Software diperbarui" });
      } else {
        await insertMut.mutateAsync(payload);
        toast({ title: "Berhasil", description: "Software ditambahkan" });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast({ title: "Berhasil", description: "Software dihapus" });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
    setDeleteId(null);
  };

  const getItemById = (id: string) => items.find(i => i.id === id);
  const today = new Date().toISOString().split("T")[0];

  const filtered = software.filter(s => {
    const matchSearch = !search || s.software_name.toLowerCase().includes(search.toLowerCase());
    const matchItem = filterItemId === "all" || s.item_id === filterItemId;
    return matchSearch && matchItem;
  });

  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AppWindow className="h-6 w-6" /> Software Inventory
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} software terdaftar</p>
        </div>
        {isAdmin && (
          <Button onClick={openAdd} className="gradient-primary text-primary-foreground border-0 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Software
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari software..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterItemId} onValueChange={setFilterItemId}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter perangkat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Perangkat</SelectItem>
            {items.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map(s => {
          const item = getItemById(s.item_id);
          const isExpired = s.expiry_date && s.expiry_date <= today;
          return (
            <div key={s.id} className={`kpi-card space-y-2 ${isExpired ? 'border-destructive/50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{s.software_name} {s.version && <span className="text-muted-foreground font-normal">v{s.version}</span>}</p>
                  <p className="text-[11px] text-muted-foreground">{item?.name} ({item?.inventory_code})</p>
                </div>
                <div className="flex gap-1">
                  {s.license_type && <Badge variant="secondary" className="text-[10px]">{s.license_type}</Badge>}
                  {isExpired && <Badge variant="destructive" className="text-[10px]">Expired</Badge>}
                </div>
              </div>
              <div className="text-xs space-y-1">
                {s.license_key && <p><span className="text-muted-foreground">Lisensi:</span> <span className="font-mono">{s.license_key}</span></p>}
                {s.expiry_date && <p><span className="text-muted-foreground">Kadaluarsa:</span> <span className={isExpired ? 'text-destructive' : ''}>{s.expiry_date}</span></p>}
                {s.notes && <p><span className="text-muted-foreground">Catatan:</span> {s.notes}</p>}
              </div>
              {isAdmin && (
                <div className="flex gap-2 pt-1">
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
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Tidak ada data software</p>}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editRecord ? "Edit Software" : "Tambah Software"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Perangkat *</Label>
              <Select value={fItemId} onValueChange={setFItemId}>
                <SelectTrigger><SelectValue placeholder="Pilih perangkat..." /></SelectTrigger>
                <SelectContent>
                  {items.map(item => <SelectItem key={item.id} value={item.id}>{item.name} ({item.inventory_code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Software *</Label>
              <Input value={fName} onChange={e => setFName(e.target.value)} placeholder="Microsoft Office, Adobe, dll" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Versi</Label>
                <Input value={fVersion} onChange={e => setFVersion(e.target.value)} placeholder="2024" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jenis Lisensi</Label>
                <Select value={fLicenseType} onValueChange={setFLicenseType}>
                  <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OEM">OEM</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Volume">Volume</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Open Source">Open Source</SelectItem>
                    <SelectItem value="Freeware">Freeware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">License Key</Label>
              <Input value={fLicenseKey} onChange={e => setFLicenseKey(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggal Kadaluarsa</Label>
              <Input type="date" value={fExpiry} onChange={e => setFExpiry(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Catatan</Label>
              <Textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Catatan tambahan..." />
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
            <AlertDialogTitle>Hapus Software?</AlertDialogTitle>
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

export default SoftwareInventoryPage;
