import { useParams, useNavigate } from "react-router-dom";
import { getItemById, getCategoryName, getRoomName, formatCurrency, maintenanceRecords } from "@/lib/mock-data";
import { ConditionBadge, StatusBadge, MaintenanceBadge } from "@/components/ConditionBadge";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Edit, Printer, Monitor, Cpu, HardDrive, Wifi, Calendar, MapPin, Wrench } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getItemById(id || "");

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

  const qrUrl = `${window.location.origin}/item/${item.id}`;
  const itemMaintenance = maintenanceRecords.filter(m => m.item_id === item.id);
  const isPC = item.category_id === 'cat-1' || item.category_id === 'cat-2' || item.category_id === 'cat-9';

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
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-3.5 w-3.5" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Info Umum */}
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

          {/* Spesifikasi */}
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

          {/* Riwayat Perbaikan */}
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

        {/* QR Code Sidebar */}
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
    </div>
  );
};

export default ItemDetail;
