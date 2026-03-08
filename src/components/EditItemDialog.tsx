import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useUpdateItem, type InventoryItem } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";

interface EditItemDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditItemDialog = ({ item, open, onOpenChange }: EditItemDialogProps) => {
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const updateItem = useUpdateItem();

  const [form, setForm] = useState({
    name: "", brand: "", model: "", serial_number: "",
    category_id: "", room_id: "", condition: "",
    hostname: "", cpu: "", ram: "", storage: "", vga: "",
    os: "", os_license: "", ip_address: "", mac_address: "",
    screen_size: "", printer_type: "",
    year_manufactured: "", year_acquired: "", price: "",
    last_service_date: "", notes: "", inventory_code: "",
  });

  useEffect(() => {
    if (item && open) {
      setForm({
        name: item.name || "",
        brand: item.brand || "",
        model: item.model || "",
        serial_number: item.serial_number || "",
        category_id: item.category_id || "",
        room_id: item.room_id || "",
        condition: item.condition || "",
        hostname: item.hostname || "",
        cpu: item.cpu || "",
        ram: item.ram || "",
        storage: item.storage || "",
        vga: item.vga || "",
        os: item.os || "",
        os_license: item.os_license || "",
        ip_address: item.ip_address || "",
        mac_address: item.mac_address || "",
        screen_size: item.screen_size || "",
        printer_type: item.printer_type || "",
        year_manufactured: item.year_manufactured?.toString() || "",
        year_acquired: item.year_acquired?.toString() || "",
        price: item.price?.toString() || "",
        last_service_date: item.last_service_date || "",
        notes: item.notes || "",
        inventory_code: item.inventory_code || "",
      });
    }
  }, [item, open]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));
  const setSelect = (key: string) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const catName = categories.find(c => c.id === form.category_id)?.name || "";
  const isPC = ["Komputer/PC", "Laptop", "Server"].includes(catName);
  const isMonitor = catName === "Monitor";
  const isPrinter = catName === "Printer/Scanner";
  const isNetwork = catName === "Jaringan";

  const handleSave = async () => {
    if (!form.inventory_code || !form.name || !form.brand || !form.category_id || !form.room_id || !form.condition) {
      toast.error("Harap isi semua field yang wajib");
      return;
    }
    try {
      await updateItem.mutateAsync({
        id: item.id,
        inventory_code: form.inventory_code,
        name: form.name,
        brand: form.brand,
        model: form.model,
        serial_number: form.serial_number,
        category_id: form.category_id || null,
        room_id: form.room_id || null,
        condition: form.condition as any,
        hostname: form.hostname || null,
        cpu: form.cpu || null,
        ram: form.ram || null,
        storage: form.storage || null,
        vga: form.vga || null,
        os: form.os || null,
        os_license: form.os_license || null,
        ip_address: form.ip_address || null,
        mac_address: form.mac_address || null,
        screen_size: form.screen_size || null,
        printer_type: form.printer_type || null,
        year_manufactured: form.year_manufactured ? parseInt(form.year_manufactured) : null,
        year_acquired: form.year_acquired ? parseInt(form.year_acquired) : null,
        price: form.price ? parseInt(form.price) : null,
        last_service_date: form.last_service_date || null,
        notes: form.notes || null,
      });
      toast.success("Barang berhasil diperbarui!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Gagal memperbarui barang", { description: err.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Barang</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informasi Dasar</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Kode Inventaris *</Label><Input value={form.inventory_code} onChange={set("inventory_code")} /></div>
              <div className="space-y-1">
                <Label className="text-xs">Kategori *</Label>
                <Select value={form.category_id} onValueChange={setSelect("category_id")}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ruangan *</Label>
                <Select value={form.room_id} onValueChange={setSelect("room_id")}>
                  <SelectTrigger><SelectValue placeholder="Pilih ruangan" /></SelectTrigger>
                  <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kondisi *</Label>
                <Select value={form.condition} onValueChange={setSelect("condition")}>
                  <SelectTrigger><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baik">Baik</SelectItem>
                    <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                    <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                    <SelectItem value="Diperbaiki">Diperbaiki</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:col-span-2"><Label className="text-xs">Nama Barang *</Label><Input value={form.name} onChange={set("name")} /></div>
              <div className="space-y-1"><Label className="text-xs">Merk *</Label><Input value={form.brand} onChange={set("brand")} /></div>
              <div className="space-y-1"><Label className="text-xs">Model/Type</Label><Input value={form.model} onChange={set("model")} /></div>
              <div className="space-y-1"><Label className="text-xs">Serial Number</Label><Input value={form.serial_number} onChange={set("serial_number")} /></div>
            </div>
          </div>

          {/* PC Specs */}
          {isPC && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spesifikasi {catName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Hostname</Label><Input value={form.hostname} onChange={set("hostname")} /></div>
                <div className="space-y-1"><Label className="text-xs">Prosesor</Label><Input value={form.cpu} onChange={set("cpu")} /></div>
                <div className="space-y-1"><Label className="text-xs">RAM</Label><Input value={form.ram} onChange={set("ram")} /></div>
                <div className="space-y-1"><Label className="text-xs">Penyimpanan</Label><Input value={form.storage} onChange={set("storage")} /></div>
                <div className="space-y-1"><Label className="text-xs">VGA</Label><Input value={form.vga} onChange={set("vga")} /></div>
                <div className="space-y-1"><Label className="text-xs">Sistem Operasi</Label><Input value={form.os} onChange={set("os")} /></div>
                <div className="space-y-1"><Label className="text-xs">Lisensi OS</Label><Input value={form.os_license} onChange={set("os_license")} /></div>
                <div className="space-y-1"><Label className="text-xs">IP Address</Label><Input value={form.ip_address} onChange={set("ip_address")} /></div>
                <div className="space-y-1"><Label className="text-xs">MAC Address</Label><Input value={form.mac_address} onChange={set("mac_address")} /></div>
              </div>
            </div>
          )}

          {isMonitor && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spesifikasi Monitor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Ukuran Layar</Label><Input value={form.screen_size} onChange={set("screen_size")} /></div>
              </div>
            </div>
          )}

          {isPrinter && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spesifikasi Printer</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Jenis Printer</Label>
                  <Select value={form.printer_type} onValueChange={setSelect("printer_type")}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inkjet">Inkjet</SelectItem>
                      <SelectItem value="Laser">Laser</SelectItem>
                      <SelectItem value="Thermal">Thermal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">IP Address</Label><Input value={form.ip_address} onChange={set("ip_address")} /></div>
              </div>
            </div>
          )}

          {isNetwork && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spesifikasi Jaringan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">IP Address</Label><Input value={form.ip_address} onChange={set("ip_address")} /></div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informasi Tambahan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Tahun Pembuatan</Label><Input type="number" value={form.year_manufactured} onChange={set("year_manufactured")} /></div>
              <div className="space-y-1"><Label className="text-xs">Tahun Perolehan</Label><Input type="number" value={form.year_acquired} onChange={set("year_acquired")} /></div>
              <div className="space-y-1"><Label className="text-xs">Harga (Rp)</Label><Input type="number" value={form.price} onChange={set("price")} /></div>
              <div className="space-y-1"><Label className="text-xs">Service Terakhir</Label><Input type="date" value={form.last_service_date} onChange={set("last_service_date")} /></div>
              <div className="space-y-1 sm:col-span-2"><Label className="text-xs">Catatan</Label><Textarea rows={3} value={form.notes} onChange={set("notes")} /></div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={updateItem.isPending} className="gradient-primary text-primary-foreground border-0">
              <Save className="mr-2 h-4 w-4" /> {updateItem.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
