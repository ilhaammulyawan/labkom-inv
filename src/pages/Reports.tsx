import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const reportTypes = [
    { id: 'inventaris', name: 'Laporan Inventaris Lab', desc: 'Daftar semua barang per ruangan' },
    { id: 'spesifikasi', name: 'Laporan Spesifikasi PC', desc: 'Detail setiap komputer' },
    { id: 'kondisi', name: 'Laporan Kondisi Barang', desc: 'Rekap barang baik/rusak' },
    { id: 'perbaikan', name: 'Laporan Perbaikan', desc: 'Riwayat perbaikan per periode' },
    { id: 'nilai', name: 'Laporan Nilai Aset', desc: 'Total nilai inventaris' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-6 w-6" /> Laporan</h1>
        <p className="text-sm text-muted-foreground">Generate dan download laporan inventaris</p>
      </div>

      <div className="space-y-4">
        {reportTypes.map(r => (
          <div key={r.id} className="kpi-card flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => toast.info("Fitur export Excel akan tersedia setelah koneksi ke database")}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("Fitur export PDF akan tersedia setelah koneksi ke database")}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
