import { useParams } from "react-router-dom";
import { useItem } from "@/hooks/useItems";
import { useItemMaintenanceRecords } from "@/hooks/useMaintenance";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { formatCurrency } from "@/lib/mock-data";
import { ConditionBadge, StatusBadge, MaintenanceBadge } from "@/components/ConditionBadge";
import { QRCodeSVG } from "qrcode.react";
import { Monitor, Cpu, HardDrive, Wifi, Calendar, MapPin, Wrench, Printer, AlertTriangle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PublicItemDetail = () => {
  const { id } = useParams();
  const { data: item, isLoading } = useItem(id);
  const { data: itemMaintenance = [] } = useItemMaintenanceRecords(id);
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();

  const getCategoryName = (cid: string | null) => categories.find(c => c.id === cid)?.name || 'Unknown';
  const getRoomName = (rid: string | null) => rooms.find(r => r.id === rid)?.name || 'Unknown';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-destructive/10 mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Barang Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground">QR Code tidak valid atau barang telah dihapus.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-foreground/20 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold truncate">SiiLaKu</h1>
            <p className="text-[10px] opacity-80">Inventaris Lab Komputer</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-primary font-bold">{item.inventory_code}</p>
              <h2 className="text-base font-bold text-foreground mt-0.5 leading-tight">{item.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{item.brand} {item.model}</p>
            </div>
            <div className="shrink-0 bg-muted p-2 rounded-lg">
              <QRCodeSVG value={`${window.location.origin}/item/${item.id}`} size={56} level="M" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <ConditionBadge condition={item.condition} />
            <StatusBadge status={item.status} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Informasi Umum</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <InfoRow label="Kategori" value={getCategoryName(item.category_id)} />
            <InfoRow label="Serial Number" value={item.serial_number} mono />
            <InfoRow label="Ruangan" value={getRoomName(item.room_id)} icon={MapPin} />
            {item.year_acquired && <InfoRow label="Tahun Perolehan" value={String(item.year_acquired)} />}
            {item.price && <InfoRow label="Harga" value={formatCurrency(item.price)} />}
            {item.last_service_date && <InfoRow label="Service Terakhir" value={item.last_service_date} icon={Calendar} />}
          </div>
          {item.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">Catatan</p>
              <p className="text-xs text-foreground mt-0.5">{item.notes}</p>
            </div>
          )}
        </div>

        {specs.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Spesifikasi Teknis</h3>
            <div className="space-y-2">
              {specs.map(spec => (
                <div key={spec.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                  <spec.icon className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground">{spec.label}</p>
                    <p className="text-xs font-medium font-mono truncate">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {itemMaintenance.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5" /> Riwayat Perbaikan
            </h3>
            <div className="space-y-2">
              {itemMaintenance.map(m => (
                <div key={m.id} className="p-3 rounded-lg bg-muted/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{m.issue_date}</span>
                    <MaintenanceBadge status={m.status} />
                  </div>
                  <p className="text-muted-foreground">{m.description}</p>
                  {m.action && <p className="text-foreground"><span className="text-muted-foreground">Tindakan:</span> {m.action}</p>}
                  <p className="text-[10px] text-muted-foreground">Teknisi: {m.technician}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-muted-foreground pt-2">
          Developed by <span className="font-semibold text-primary">Guru Informatika</span>
        </p>
      </div>
    </div>
  );
};

function InfoRow({ label, value, mono, icon: Icon }: { label: string; value: string; mono?: boolean; icon?: React.ElementType }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-xs font-medium mt-0.5 flex items-center gap-1 ${mono ? 'font-mono' : ''}`}>
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        {value}
      </p>
    </div>
  );
}

export default PublicItemDetail;
