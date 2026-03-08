import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, rooms } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const AddItem = () => {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const isPC = categoryId === 'cat-1' || categoryId === 'cat-2' || categoryId === 'cat-9';
  const isMonitor = categoryId === 'cat-3';
  const isPrinter = categoryId === 'cat-4';
  const isNetwork = categoryId === 'cat-5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Barang berhasil ditambahkan! (Demo)");
    navigate("/inventory");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tambah Barang Baru</h1>
          <p className="text-sm text-muted-foreground">Isi data barang inventaris</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold">Informasi Dasar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ruangan *</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Pilih ruangan" /></SelectTrigger>
                <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Nama Barang *</Label>
              <Input placeholder="contoh: PC Desktop Lab 1 - Meja 01" required />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Merk *</Label><Input placeholder="Dell, HP, Lenovo..." required /></div>
            <div className="space-y-1.5"><Label className="text-xs">Model/Type</Label><Input placeholder="OptiPlex 7090" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Serial Number</Label><Input placeholder="SN-XXXXX" /></div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kondisi *</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                  <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                  <SelectItem value="Diperbaiki">Diperbaiki</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* PC/Laptop Specs */}
        {isPC && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">Spesifikasi {categoryId === 'cat-2' ? 'Laptop' : categoryId === 'cat-9' ? 'Server' : 'PC'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Hostname</Label><Input placeholder="LAB1-PC01" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Prosesor (CPU)</Label><Input placeholder="Intel Core i5-11500" /></div>
              <div className="space-y-1.5"><Label className="text-xs">RAM</Label><Input placeholder="16 GB DDR4" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Penyimpanan</Label><Input placeholder="SSD 512GB" /></div>
              <div className="space-y-1.5"><Label className="text-xs">VGA/Graphics</Label><Input placeholder="Intel UHD 730" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Sistem Operasi</Label><Input placeholder="Windows 11 Pro" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Lisensi OS</Label><Input placeholder="OEM / Retail" /></div>
              <div className="space-y-1.5"><Label className="text-xs">IP Address</Label><Input placeholder="192.168.1.101" /></div>
              <div className="space-y-1.5"><Label className="text-xs">MAC Address</Label><Input placeholder="AA:BB:CC:DD:EE:FF" /></div>
            </div>
          </div>
        )}

        {isMonitor && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">Spesifikasi Monitor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Ukuran Layar</Label><Input placeholder="24 inch" /></div>
            </div>
          </div>
        )}

        {isPrinter && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">Spesifikasi Printer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Jenis Printer</Label>
                <Select><SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inkjet">Inkjet</SelectItem>
                    <SelectItem value="laser">Laser</SelectItem>
                    <SelectItem value="thermal">Thermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">IP Address</Label><Input placeholder="192.168.1.200" /></div>
            </div>
          </div>
        )}

        {isNetwork && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">Spesifikasi Jaringan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">IP Address</Label><Input placeholder="192.168.1.1" /></div>
            </div>
          </div>
        )}

        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold">Informasi Tambahan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">Tahun Pembuatan</Label><Input type="number" placeholder="2023" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Tahun Perolehan</Label><Input type="number" placeholder="2023" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Harga (Rp)</Label><Input type="number" placeholder="10000000" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Tanggal Service Terakhir</Label><Input type="date" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Catatan</Label><Textarea placeholder="Catatan tambahan..." rows={3} /></div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/inventory")}>Batal</Button>
          <Button type="submit" className="gradient-primary text-primary-foreground border-0"><Save className="mr-2 h-4 w-4" /> Simpan</Button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
