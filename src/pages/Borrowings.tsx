import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useBorrowings, useInsertBorrowing, useUpdateBorrowing, useDeleteBorrowing, type Borrowing, type BorrowingStatus } from "@/hooks/useBorrowings";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { HandCoins, PlusCircle, CheckCircle, XCircle, Undo2, Trash2, PackageCheck, ArrowRightLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const STATUS_COLORS: Record<BorrowingStatus, string> = {
  Menunggu: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Disetujui: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Ditolak: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Dipinjam: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Pengembalian: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Dikembalikan: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const STATUS_LABELS: Record<BorrowingStatus, string> = {
  Menunggu: "Menunggu Persetujuan",
  Disetujui: "Disetujui",
  Ditolak: "Ditolak",
  Dipinjam: "Sedang Dipinjam",
  Pengembalian: "Menunggu Konfirmasi Pengembalian",
  Dikembalikan: "Selesai Dikembalikan",
};

const BorrowingsPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: items = [] } = useItems();
  const { data: borrowings = [], isLoading } = useBorrowings();
  const { isAdmin } = useUserRole();
  const { user, username } = useAuth();
  const insertMut = useInsertBorrowing();
  const updateMut = useUpdateBorrowing();
  const deleteMut = useDeleteBorrowing();
  const { toast } = useToast();

  // Form state
  const [fItemId, setFItemId] = useState("");
  const [fPurpose, setFPurpose] = useState("");
  const [fBorrowDate, setFBorrowDate] = useState(new Date().toISOString().split("T")[0]);
  const [fReturnDate, setFReturnDate] = useState("");
  const [fNotes, setFNotes] = useState("");

  const resetForm = () => {
    setFItemId(""); setFPurpose(""); setFBorrowDate(new Date().toISOString().split("T")[0]);
    setFReturnDate(""); setFNotes("");
  };

  const handleRequest = async () => {
    if (!fItemId || !fReturnDate || !user) {
      toast({ title: "Error", description: "Isi semua field wajib", variant: "destructive" });
      return;
    }
    try {
      await insertMut.mutateAsync({
        item_id: fItemId,
        borrower_id: user.id,
        borrower_name: username || user.email || "Unknown",
        purpose: fPurpose,
        borrow_date: fBorrowDate,
        expected_return_date: fReturnDate,
        status: "Menunggu",
        notes: fNotes,
      });
      toast({ title: "Berhasil", description: "Permintaan peminjaman terkirim" });
      setFormOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  const handleStatusChange = async (b: Borrowing, newStatus: BorrowingStatus) => {
    try {
      await updateMut.mutateAsync({
        id: b.id,
        status: newStatus,
        ...(newStatus === "Dikembalikan" ? { actual_return_date: new Date().toISOString().split("T")[0] } : {}),
        ...(newStatus === "Disetujui" || newStatus === "Ditolak" ? { approved_by: user?.id } : {}),
      });
      toast({ title: "Berhasil", description: `Status diubah ke "${STATUS_LABELS[newStatus]}"` });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteMut.mutateAsync(deleteId); toast({ title: "Dihapus" }); } catch (e: any) { toast({ title: "Gagal", description: e.message, variant: "destructive" }); }
    setDeleteId(null);
  };

  const getItemById = (id: string) => items.find(i => i.id === id);
  const filtered = borrowings.filter(b => statusFilter === "all" || b.status === statusFilter);
  const today = new Date().toISOString().split("T")[0];
  const isOwner = (b: Borrowing) => user?.id === b.borrower_id;

  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <HandCoins className="h-6 w-6" /> Peminjaman Barang
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} peminjaman</p>
        </div>
        <Button onClick={() => { resetForm(); setFormOpen(true); }} className="gradient-primary text-primary-foreground border-0 shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajukan Peminjaman
        </Button>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-56"><SelectValue placeholder="Filter status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="Menunggu">Menunggu Persetujuan</SelectItem>
          <SelectItem value="Disetujui">Disetujui</SelectItem>
          <SelectItem value="Dipinjam">Sedang Dipinjam</SelectItem>
          <SelectItem value="Pengembalian">Menunggu Konfirmasi</SelectItem>
          <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
          <SelectItem value="Ditolak">Ditolak</SelectItem>
        </SelectContent>
      </Select>

      {/* Flow info */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 rounded-lg p-3">
        <span className="font-medium">Alur:</span>
        <Badge variant="outline" className="text-[10px] h-5">User Ajukan</Badge>
        <ArrowRightLeft className="h-3 w-3" />
        <Badge variant="outline" className="text-[10px] h-5">Admin Setujui</Badge>
        <ArrowRightLeft className="h-3 w-3" />
        <Badge variant="outline" className="text-[10px] h-5">Admin Serahkan</Badge>
        <ArrowRightLeft className="h-3 w-3" />
        <Badge variant="outline" className="text-[10px] h-5">User Kembalikan</Badge>
        <ArrowRightLeft className="h-3 w-3" />
        <Badge variant="outline" className="text-[10px] h-5">Admin Terima</Badge>
      </div>

      <div className="space-y-4">
        {filtered.map(b => {
          const item = getItemById(b.item_id);
          const isOverdue = b.status === "Dipinjam" && b.expected_return_date < today;
          return (
            <div key={b.id} className={`kpi-card space-y-3 ${isOverdue ? 'border-destructive/50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item?.name || "Unknown"}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{item?.inventory_code}</p>
                </div>
                <Badge className={`text-[10px] ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</Badge>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-muted-foreground">Peminjam:</span> {b.borrower_name}</p>
                {b.purpose && <p><span className="text-muted-foreground">Keperluan:</span> {b.purpose}</p>}
                <p><span className="text-muted-foreground">Tgl Pinjam:</span> {b.borrow_date}</p>
                <p>
                  <span className="text-muted-foreground">Tgl Kembali:</span>{" "}
                  <span className={isOverdue ? "text-destructive font-semibold" : ""}>{b.expected_return_date}</span>
                  {isOverdue && " (Terlambat!)"}
                </p>
                {b.actual_return_date && <p><span className="text-muted-foreground">Dikembalikan:</span> {b.actual_return_date}</p>}
                {b.notes && <p><span className="text-muted-foreground">Catatan:</span> {b.notes}</p>}
              </div>

              {/* Action buttons based on role and status */}
              <div className="flex flex-wrap gap-2 pt-1">
                {/* User: can return item when status is Dipinjam and they own it */}
                {b.status === "Dipinjam" && isOwner(b) && !isAdmin && (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleStatusChange(b, "Pengembalian")}>
                    <Undo2 className="h-3 w-3" /> Kembalikan Barang
                  </Button>
                )}

                {/* Admin actions */}
                {isAdmin && (
                  <>
                    {b.status === "Menunggu" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleStatusChange(b, "Disetujui")}>
                          <CheckCircle className="h-3 w-3" /> Setujui
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" onClick={() => handleStatusChange(b, "Ditolak")}>
                          <XCircle className="h-3 w-3" /> Tolak
                        </Button>
                      </>
                    )}
                    {b.status === "Disetujui" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleStatusChange(b, "Dipinjam")}>
                        <HandCoins className="h-3 w-3" /> Serahkan Barang
                      </Button>
                    )}
                    {b.status === "Dipinjam" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleStatusChange(b, "Pengembalian")}>
                        <Undo2 className="h-3 w-3" /> Tandai Pengembalian
                      </Button>
                    )}
                    {b.status === "Pengembalian" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-600" onClick={() => handleStatusChange(b, "Dikembalikan")}>
                        <PackageCheck className="h-3 w-3" /> Terima Pengembalian
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteId(b.id)}>
                      <Trash2 className="h-3 w-3" /> Hapus
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Tidak ada peminjaman</p>}
      </div>

      {/* Request Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajukan Peminjaman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Barang *</Label>
              <Select value={fItemId} onValueChange={setFItemId}>
                <SelectTrigger><SelectValue placeholder="Pilih barang..." /></SelectTrigger>
                <SelectContent>
                  {items.filter(i => i.status === "Aktif").map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name} ({item.inventory_code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Keperluan</Label>
              <Textarea value={fPurpose} onChange={e => setFPurpose(e.target.value)} placeholder="Untuk apa dipinjam..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Tgl Pinjam *</Label>
                <Input type="date" value={fBorrowDate} onChange={e => setFBorrowDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tgl Kembali *</Label>
                <Input type="date" value={fReturnDate} onChange={e => setFReturnDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Catatan</Label>
              <Textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Catatan tambahan..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
              <Button onClick={handleRequest} disabled={insertMut.isPending} className="gradient-primary text-primary-foreground border-0">
                {insertMut.isPending ? "Mengirim..." : "Ajukan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={v => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peminjaman?</AlertDialogTitle>
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

export default BorrowingsPage;
