import { FileText, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useMaintenanceRecords } from "@/hooks/useMaintenance";
import { useBorrowings } from "@/hooks/useBorrowings";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  exportInventarisExcel, exportInventarisPdf,
  exportSpesifikasiExcel, exportSpesifikasiPdf,
  exportKondisiExcel, exportKondisiPdf,
  exportPerbaikanExcel, exportPerbaikanPdf,
  exportNilaiExcel, exportNilaiPdf,
  exportPeminjamanExcel, exportPeminjamanPdf,
} from "@/lib/export-utils";

const Reports = () => {
  const { data: items = [], isLoading: loadItems } = useItems();
  const { data: categories = [], isLoading: loadCats } = useCategories();
  const { data: rooms = [], isLoading: loadRooms } = useRooms();
  const { data: maintenance = [], isLoading: loadMaint } = useMaintenanceRecords();
  const { data: borrowings = [], isLoading: loadBorrow } = useBorrowings();
  const { settings, isLoading: loadSettings } = useAppSettings();

  const loading = loadItems || loadCats || loadRooms || loadMaint || loadBorrow || loadSettings;

  const reportTypes = [
    {
      id: "inventaris",
      name: "Laporan Inventaris Lab",
      desc: `Daftar semua barang per ruangan (${items.length} barang)`,
      onExcel: () => exportInventarisExcel(items, categories, rooms),
      onPdf: () => exportInventarisPdf(items, categories, rooms, settings),
    },
    {
      id: "spesifikasi",
      name: "Laporan Spesifikasi PC",
      desc: `Detail spesifikasi setiap komputer (${items.filter((i) => i.cpu || i.ram || i.storage).length} unit)`,
      onExcel: () => exportSpesifikasiExcel(items, categories, rooms),
      onPdf: () => exportSpesifikasiPdf(items, categories, rooms, settings),
    },
    {
      id: "kondisi",
      name: "Laporan Kondisi Barang",
      desc: `Rekap barang baik/rusak (Baik: ${items.filter((i) => i.condition === "Baik").length}, Perlu Perhatian: ${items.filter((i) => i.condition !== "Baik").length})`,
      onExcel: () => exportKondisiExcel(items, categories, rooms),
      onPdf: () => exportKondisiPdf(items, categories, rooms, settings),
    },
    {
      id: "perbaikan",
      name: "Laporan Perbaikan",
      desc: `Riwayat perbaikan barang (${maintenance.length} catatan)`,
      onExcel: () => exportPerbaikanExcel(maintenance, items),
      onPdf: () => exportPerbaikanPdf(maintenance, items, settings),
    },
    {
      id: "peminjaman",
      name: "Laporan Peminjaman",
      desc: `Riwayat peminjaman barang (${borrowings.length} catatan, ${borrowings.filter(b => b.status === "Dipinjam").length} aktif)`,
      onExcel: () => exportPeminjamanExcel(borrowings, items),
      onPdf: () => exportPeminjamanPdf(borrowings, items, settings),
    },
    {
      id: "nilai",
      name: "Laporan Nilai Aset",
      desc: `Total nilai inventaris (${items.length} item)`,
      onExcel: () => exportNilaiExcel(items, categories, rooms),
      onPdf: () => exportNilaiPdf(items, categories, rooms, settings),
    },
  ];

  const handleExport = (fn: () => void, type: string) => {
    try {
      fn();
      toast.success(`Laporan ${type} berhasil diunduh!`);
    } catch (err: any) {
      toast.error("Gagal mengunduh laporan", { description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6" /> Laporan
        </h1>
        <p className="text-sm text-muted-foreground">Generate dan download laporan inventaris</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Memuat data...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {reportTypes.map((r) => (
            <div key={r.id} className="kpi-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(r.onExcel, "Excel")}
                  className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950 dark:border-green-800"
                >
                  <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(r.onPdf, "PDF")}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
