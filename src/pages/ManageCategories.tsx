import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from "@/hooks/useCategories";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

const iconOptions = [
  "Monitor", "Laptop", "MonitorSmartphone", "Printer", "Wifi", "Keyboard",
  "Headphones", "Projector", "Server", "Cpu", "FileCode", "Package",
  "HardDrive", "Mouse", "Cable", "Router",
];

const ManageCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const { isAdmin } = useUserRole();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Package");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIcon("Package");
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Nama kategori wajib diisi"); return; }
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, name: name.trim(), icon });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await createMut.mutateAsync({ name: name.trim(), icon });
        toast.success("Kategori berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Kategori berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus kategori. Pastikan tidak ada barang di kategori ini.");
    }
    setDeleteDialogOpen(false);
    setDeleting(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-5 w-5" /> Kelola Kategori
          </h1>
          <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus kategori barang</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        )}
      </div>

      <div className="kpi-card">
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
        ) : !categories?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Belum ada kategori</p>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-3 px-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {cat.icon.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">Icon: {cat.icon}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeleting(cat); setDeleteDialogOpen(true); }}>
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
            <DialogTitle>{editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Kategori *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="contoh: Komputer/PC" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Icon</Label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`px-2.5 py-1.5 rounded-md text-xs border transition-colors ${icon === ic ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/50 border-border hover:bg-muted'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
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
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori "{deleting?.name}" akan dihapus permanen. Pastikan tidak ada barang yang menggunakan kategori ini.
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

export default ManageCategories;
