import { useState } from "react";
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom, Room } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

const ManageRooms = () => {
  const { data: rooms, isLoading } = useRooms();
  const createMut = useCreateRoom();
  const updateMut = useUpdateRoom();
  const deleteMut = useDeleteRoom();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState<Room | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setLocation("");
    setDialogOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setName(room.name);
    setLocation(room.location);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Nama ruangan wajib diisi"); return; }
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, name: name.trim(), location: location.trim() });
        toast.success("Ruangan berhasil diperbarui");
      } else {
        await createMut.mutateAsync({ name: name.trim(), location: location.trim() });
        toast.success("Ruangan berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Gagal menyimpan ruangan");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Ruangan berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus ruangan. Pastikan tidak ada barang di ruangan ini.");
    }
    setDeleteDialogOpen(false);
    setDeleting(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Kelola Ruangan
          </h1>
          <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus ruangan</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Tambah
        </Button>
      </div>

      <div className="kpi-card">
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
        ) : !rooms?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Belum ada ruangan</p>
        ) : (
          <div className="divide-y divide-border">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between py-3 px-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{room.name}</p>
                    <p className="text-[10px] text-muted-foreground">{room.location || "—"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(room)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeleting(room); setDeleteDialogOpen(true); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Ruangan" : "Tambah Ruangan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Ruangan *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="contoh: Lab Komputer 1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lokasi</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="contoh: Gedung A Lt. 2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending) ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Ruangan?</AlertDialogTitle>
            <AlertDialogDescription>
              Ruangan "{deleting?.name}" akan dihapus permanen. Pastikan tidak ada barang yang berada di ruangan ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageRooms;
