import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItem, useDeleteItem } from "@/hooks/useItems";
import { useItemMaintenanceRecords } from "@/hooks/useMaintenance";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useUserRole } from "@/hooks/useUserRole";
import { formatCurrency } from "@/lib/mock-data";
import { ConditionBadge, StatusBadge, MaintenanceBadge } from "@/components/ConditionBadge";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Edit, Printer, Monitor, Cpu, HardDrive, Wifi, Calendar, MapPin, Wrench, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import EditItemDialog from "@/components/EditItemDialog";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useItem(id);
  const { data: itemMaintenance = [] } = useItemMaintenanceRecords(id);
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const { isAdmin } = useUserRole();
  const deleteItem = useDeleteItem();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const getCategoryName = (cid: string | null) => categories.find(c => c.id === cid)?.name || 'Unknown';
  const getRoomName = (rid: string | null) => rooms.find(r => r.id === rid)?.name || 'Unknown';

  if (isLoading) {
    return <div className="space-y-6 animate-fade-in max-w-5xl"><Skeleton className="h-8 w-64" /><Skeleton className="h-64" /></div>;
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Barang tidak ditemukan</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/inventory")}>Kembali ke Inventaris</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Barang berhasil dihapus!");
      navigate("/inventory");
    } catch (err: any) {
      toast.error("Gagal menghapus barang", { description: err.message });
    }
  };

  const qrUrl = `${window.location.origin}/item/${item.id}`;
  const catName = getCategoryName(item.category_id);

  const specs = [
    { label: 'Hostname', value: item.hostname, icon: Monitor },
    { label: 'Prosesor', value: item.cpu, icon: Cpu },
    { label: 'RAM', value: item.ram, icon: Cpu },
    { label: 'Penyimpanan', value: item.storage, icon: HardDrive },
    { label: 'VGA/Graphics', value: item.vga, icon: Monitor },
    { label: 'Sistem Operasi', value: item.os, icon: Monitor },
    { label: 'Lisensi OS', value: item.os_license, icon: Monitor },
    { label: 'IP Address', value: item.ip_address, icon: Wifi },
    { label: 'MAC Address', value: item.mac_address, icon: Wifi },
    { label: 'Ukuran Layar', value: item.screen_size, icon: Monitor },
    { label: 'Jenis Printer', value: item.printer_type, icon: Printer },
  ].filter(s => s.value);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{item.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{item.inventory_code}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Edit className="mr-2 h-3.5 w-3.5" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="kpi-card">
            <h3 className="text-sm font-semibold mb-4">Informasi Umum</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div><span className="text-muted-foreground">Kategori</span><p className="font-medium mt-0.5">{getCategoryName(item.category_id)}</p></div>
              <div><span className="text-muted-foreground">Merk / Model</span><p className="font-medium mt-0.5">{item.brand} {item.model}</p></div>
              <div><span className="text-muted-foreground">Serial Number</span><p className="font-medium font-mono mt-0.5">{item.serial_number}</p></div>
              <div><span className="text-muted-foreground">Ruangan</span><p className="font-medium mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{getRoomName(item.room_id)}</p></div>
              <div><span className="text-muted-foreground">Kondisi</span><div className="mt-1"><ConditionBadge condition={item.condition} /></div></div>
              <div><span className="text-muted-foreground">Status</span><div className="mt-1"><StatusBadge status={item.status} /></div></div>
              {item.year_acquired && <div><span className="text-muted-foreground">Tahun Perolehan</span><p className="font-medium mt-0.5">{item.year_acquired}</p></div>}
              {item.price && <div><span className="text-muted-foreground">Harga</span><p className="font-medium mt-0.5">{formatCurrency(item.price)}</p></div>}
              {item.last_service_date && <div><span className="text-muted-foreground">Service Terakhir</span><p className="font-medium mt-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" />{item.last_service_date}</p></div>}
              {item.notes && <div className="sm:col-span-2"><span className="text-muted-foreground">Catatan</span><p className="font-medium mt-0.5">{item.notes}</p></div>}
            </div>
          </div>

          {specs.length > 0 && (
            <div className="kpi-card">
              <h3 className="text-sm font-semibold mb-4">Spesifikasi Teknis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map(spec => (
                  <div key={spec.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <spec.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{spec.label}</p>
                      <p className="text-xs font-medium font-mono">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {itemMaintenance.length > 0 && (
            <div className="kpi-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Wrench className="h-4 w-4" /> Riwayat Perbaikan</h3>
              <div className="space-y-3">
                {itemMaintenance.map(m => (
                  <div key={m.id} className="p-3 rounded-lg bg-muted/50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.issue_date}</span>
                      <MaintenanceBadge status={m.status} />
                    </div>
                    <p className="text-muted-foreground">{m.description}</p>
                    {m.action && <p><span className="text-muted-foreground">Tindakan:</span> {m.action}</p>}
                    <p className="text-[10px] text-muted-foreground">Teknisi: {m.technician}{m.cost ? ` • Biaya: ${formatCurrency(m.cost)}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="kpi-card flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-4">QR Code</h3>
            <div className="bg-card p-4 rounded-xl border border-border">
              <QRCodeSVG value={qrUrl} size={180} level="M" includeMargin />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono break-all">{item.inventory_code}</p>
            <p className="text-[10px] text-center text-muted-foreground mt-1 max-w-[200px] truncate">{item.name}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/qr-print?items=${item.id}`)}>
              <Printer className="mr-2 h-3.5 w-3.5" /> Cetak QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Barang</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{item.name}</strong> ({item.inventory_code})? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteItem.isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ItemDetail;
