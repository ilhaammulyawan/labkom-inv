import { FileText, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useMaintenanceRecords } from "@/hooks/useMaintenance";
import { useMaintenanceSchedules } from "@/hooks/useMaintenanceSchedules";
import { useBorrowings } from "@/hooks/useBorrowings";
import { useSoftwareInventory } from "@/hooks/useSoftwareInventory";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  exportInventarisExcel, exportInventarisPdf, exportSpesifikasiExcel, exportSpesifikasiPdf,
  exportKondisiExcel, exportKondisiPdf, exportPerbaikanExcel, exportPerbaikanPdf,
  exportNilaiExcel, exportNilaiPdf, exportPeminjamanExcel, exportPeminjamanPdf,
  exportJadwalMaintenanceExcel, exportJadwalMaintenancePdf, exportSoftwareExcel, exportSoftwarePdf,
  exportPerRuanganExcel, exportPerRuanganPdf, exportPerKategoriExcel, exportPerKategoriPdf,
} from "@/lib/export-utils";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const { t } = useLanguage();
  const { data: items = [], isLoading: loadItems } = useItems();
  const { data: categories = [], isLoading: loadCats } = useCategories();
  const { data: rooms = [], isLoading: loadRooms } = useRooms();
  const { data: maintenance = [], isLoading: loadMaint } = useMaintenanceRecords();
  const { data: schedules = [], isLoading: loadSched } = useMaintenanceSchedules();
  const { data: borrowings = [], isLoading: loadBorrow } = useBorrowings();
  const { data: software = [], isLoading: loadSw } = useSoftwareInventory();
  const { settings, isLoading: loadSettings } = useAppSettings();

  const loading = loadItems || loadCats || loadRooms || loadMaint || loadBorrow || loadSettings || loadSched || loadSw;
  const todayStr = new Date().toISOString().split("T")[0];
  const overdueSchedules = schedules.filter(s => s.is_active && s.next_due_date <= todayStr).length;
  const expiredSw = software.filter(s => s.expiry_date && s.expiry_date < todayStr).length;

  const reportGroups = [
    { label: t("inventoryAndAssets"), reports: [
      { id: "inventaris", name: t("labInventoryReport"), desc: `${t("allItemsList")} (${items.length} ${t("items")})`, onExcel: () => exportInventarisExcel(items, categories, rooms), onPdf: () => exportInventarisPdf(items, categories, rooms, settings) },
      { id: "per-ruangan", name: t("roomItemsReport"), desc: `${t("roomDistDesc")} ${rooms.length} ${t("roomsLabel")}`, onExcel: () => exportPerRuanganExcel(items, categories, rooms), onPdf: () => exportPerRuanganPdf(items, categories, rooms, settings) },
      { id: "per-kategori", name: t("categoryItemsReport"), desc: `${t("categoryDistDesc")} ${categories.length} ${t("categoriesLabel")}`, onExcel: () => exportPerKategoriExcel(items, categories, rooms), onPdf: () => exportPerKategoriPdf(items, categories, rooms, settings) },
      { id: "kondisi", name: t("conditionReport"), desc: `${t("conditionGoodLabel")}: ${items.filter(i => i.condition === "Baik").length}, ${t("conditionNeedAttention")}: ${items.filter(i => i.condition !== "Baik").length}`, onExcel: () => exportKondisiExcel(items, categories, rooms), onPdf: () => exportKondisiPdf(items, categories, rooms, settings) },
      { id: "nilai", name: t("assetValueReport"), desc: `${t("totalAssetValue2")} (${items.length} ${t("item")})`, onExcel: () => exportNilaiExcel(items, categories, rooms), onPdf: () => exportNilaiPdf(items, categories, rooms, settings) },
      { id: "spesifikasi", name: t("pcSpecReport"), desc: `${t("pcSpecDesc")} (${items.filter(i => i.cpu || i.ram || i.storage).length} ${t("units")})`, onExcel: () => exportSpesifikasiExcel(items, categories, rooms), onPdf: () => exportSpesifikasiPdf(items, categories, rooms, settings) },
    ]},
    { label: t("maintenanceAndRepairLabel"), reports: [
      { id: "jadwal-maintenance", name: t("scheduleReport"), desc: `${schedules.length} ${t("schedulesRegistered")}, ${overdueSchedules} ${t("schedulesDue")}`, badge: overdueSchedules > 0 ? `${overdueSchedules} ${t("dueLabel")}` : undefined, badgeVariant: "destructive" as const, onExcel: () => exportJadwalMaintenanceExcel(schedules, items), onPdf: () => exportJadwalMaintenancePdf(schedules, items, settings) },
      { id: "perbaikan", name: t("repairHistoryReport"), desc: `${maintenance.length} ${t("repairRecords")}`, onExcel: () => exportPerbaikanExcel(maintenance, items), onPdf: () => exportPerbaikanPdf(maintenance, items, settings) },
    ]},
    { label: t("borrowingLabel"), reports: [
      { id: "peminjaman", name: t("borrowingReport"), desc: `${borrowings.length} ${t("borrowRecords")}, ${borrowings.filter(b => b.status === "Dipinjam").length} ${t("activeBorrow")}, ${borrowings.filter(b => b.status === "Menunggu").length} ${t("waitingBorrow")}`, onExcel: () => exportPeminjamanExcel(borrowings, items), onPdf: () => exportPeminjamanPdf(borrowings, items, settings) },
    ]},
    { label: t("softwareAndLicense"), reports: [
      { id: "software", name: t("softwareReport"), desc: `${software.length} ${t("softwareRegistered")}, ${expiredSw} ${t("licenseExpired")}`, badge: expiredSw > 0 ? `${expiredSw} ${t("expiredLabel")}` : undefined, badgeVariant: "destructive" as const, onExcel: () => exportSoftwareExcel(software, items), onPdf: () => exportSoftwarePdf(software, items, settings) },
    ]},
  ];

  const handleExport = async (fn: () => void | Promise<void>, type: string) => {
    try { await fn(); toast.success(`${t("reports")} ${type} ${t("reportDownloaded")}`); }
    catch (err: any) { toast.error(t("reportDownloadFailed"), { description: err.message }); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-6 w-6" /> {t("reportsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("reportsDesc")}</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /><span className="ml-2 text-sm text-muted-foreground">{t("loadingData")}</span></div>
      ) : (
        <div className="space-y-8">
          {reportGroups.map((group) => (
            <div key={group.label} className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</h2>
              <div className="space-y-3">
                {group.reports.map((r: any) => (
                  <div key={r.id} className="kpi-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-2">{r.name}{r.badge && (<Badge variant={r.badgeVariant || "secondary"} className="text-[10px]">{r.badge}</Badge>)}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleExport(r.onExcel, "Excel")} className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950 dark:border-green-800"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
                      <Button variant="outline" size="sm" onClick={() => handleExport(r.onPdf, "PDF")} className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
