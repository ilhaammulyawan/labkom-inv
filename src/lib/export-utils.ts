import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InventoryItem } from "@/hooks/useItems";
import type { MaintenanceRecord } from "@/hooks/useMaintenance";
import type { MaintenanceSchedule } from "@/hooks/useMaintenanceSchedules";
import type { Borrowing } from "@/hooks/useBorrowings";
import type { SoftwareItem } from "@/hooks/useSoftwareInventory";
import type { Category } from "@/hooks/useCategories";
import type { Room } from "@/hooks/useRooms";
import { formatCurrency } from "@/lib/mock-data";

// ── helpers ──

function catName(id: string | null, cats: Category[]) {
  return cats.find((c) => c.id === id)?.name ?? "-";
}
function roomName(id: string | null, rooms: Room[]) {
  return rooms.find((r) => r.id === id)?.name ?? "-";
}
function today() {
  return new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}
function ts() {
  return new Date().toISOString().slice(0, 10);
}

// ── Image loader helper ──

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ── Excel helpers ──

function downloadXlsx(ws: XLSX.WorkSheet, filename: string) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  XLSX.writeFile(wb, filename);
}

// ── PDF helpers ──

async function pdfHeader(doc: jsPDF, title: string, settings: Record<string, string>) {
  const inst = settings["institution_name"] || "";
  const addr = settings["institution_address"] || "";
  const logoUrl = settings["app_logo"] || "";
  const pageW = doc.internal.pageSize.getWidth();
  const centerX = pageW / 2;

  // Logo: 14mm x 14mm, positioned at top-left
  if (logoUrl) {
    const logoData = await loadImageAsDataUrl(logoUrl);
    if (logoData) {
      doc.addImage(logoData, "PNG", 14, 8, 14, 14);
    }
  }

  // Institution name & address centered on page
  if (inst) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(inst, centerX, 14, { align: "center" });
  }
  if (addr) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(addr, centerX, 19, { align: "center" });
  }

  // Separator line — below logo area (Y=24)
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.8);
  doc.line(14, 24, pageW - 14, 24);
  doc.setLineWidth(0.3);
  doc.line(14, 25.5, pageW - 14, 25.5);

  // Report title
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, centerX, 31, { align: "center" });
  doc.setFont("helvetica", "normal");

  // Print date
  doc.setFontSize(8);
  doc.text(`Dicetak: ${today()}`, 14, 37);

  return 42;
}

function pdfSignature(doc: jsPDF, settings: Record<string, string>) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const labManager = settings["lab_manager"] || "___________________";
  const labNip = settings["lab_manager_nip"] || "";
  const principal = settings["principal_name"] || "___________________";
  const principalNip = settings["principal_nip"] || "";

  const leftX = 30;
  const rightX = pageW - 70;
  const topY = pageH - 45;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Left: Pengelola Lab
  doc.text("Mengetahui,", leftX, topY);
  doc.text("Pengelola Laboratorium", leftX, topY + 5);
  doc.text(labManager, leftX, topY + 25);
  doc.setLineWidth(0.3);
  doc.line(leftX, topY + 26, leftX + 50, topY + 26);
  if (labNip) {
    doc.setFontSize(8);
    doc.text(`NIP. ${labNip}`, leftX, topY + 30);
  }

  // Right: Kepala Sekolah
  doc.setFontSize(9);
  doc.text("Menyetujui,", rightX, topY);
  doc.text("Kepala Sekolah", rightX, topY + 5);
  doc.text(principal, rightX, topY + 25);
  doc.setLineWidth(0.3);
  doc.line(rightX, topY + 26, rightX + 50, topY + 26);
  if (principalNip) {
    doc.setFontSize(8);
    doc.text(`NIP. ${principalNip}`, rightX, topY + 30);
  }
}

// ══════════════════════════════════════════════
// 1. Laporan Inventaris
// ══════════════════════════════════════════════

export function exportInventarisExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const rows = items.map((i, idx) => ({
    No: idx + 1,
    "Kode Inventaris": i.inventory_code,
    "Nama Barang": i.name,
    "Merk": i.brand,
    "Model": i.model,
    "Kategori": catName(i.category_id, cats),
    "Ruangan": roomName(i.room_id, rooms),
    "Kondisi": i.condition,
    "Status": i.status,
    "Tahun Perolehan": i.year_acquired ?? "-",
    "Harga": i.price ?? 0,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 14 }, { wch: 28 }, { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 16 }];
  downloadXlsx(ws, `Laporan_Inventaris_${ts()}.xlsx`);
}

export async function exportInventarisPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN INVENTARIS LABORATORIUM", settings);
  autoTable(doc, {
    startY,
    head: [["No", "Kode", "Nama Barang", "Merk", "Kategori", "Ruangan", "Kondisi", "Status", "Harga"]],
    body: items.map((i, idx) => [
      idx + 1, i.inventory_code, i.name, i.brand,
      catName(i.category_id, cats), roomName(i.room_id, rooms),
      i.condition, i.status, i.price ? formatCurrency(i.price) : "-",
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Inventaris_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 2. Laporan Spesifikasi PC
// ══════════════════════════════════════════════

export function exportSpesifikasiExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const pcItems = items.filter((i) => i.cpu || i.ram || i.storage);
  const rows = pcItems.map((i, idx) => ({
    No: idx + 1,
    "Kode": i.inventory_code,
    "Nama": i.name,
    "Hostname": i.hostname ?? "-",
    "Prosesor": i.cpu ?? "-",
    "RAM": i.ram ?? "-",
    "Penyimpanan": i.storage ?? "-",
    "VGA": i.vga ?? "-",
    "OS": i.os ?? "-",
    "IP Address": i.ip_address ?? "-",
    "MAC Address": i.mac_address ?? "-",
    "Ruangan": roomName(i.room_id, rooms),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  downloadXlsx(ws, `Laporan_Spesifikasi_PC_${ts()}.xlsx`);
}

export async function exportSpesifikasiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN SPESIFIKASI KOMPUTER", settings);
  const pcItems = items.filter((i) => i.cpu || i.ram || i.storage);
  autoTable(doc, {
    startY,
    head: [["No", "Kode", "Nama", "Hostname", "CPU", "RAM", "Storage", "VGA", "OS", "IP", "Ruangan"]],
    body: pcItems.map((i, idx) => [
      idx + 1, i.inventory_code, i.name, i.hostname ?? "-",
      i.cpu ?? "-", i.ram ?? "-", i.storage ?? "-", i.vga ?? "-",
      i.os ?? "-", i.ip_address ?? "-", roomName(i.room_id, rooms),
    ]),
    styles: { fontSize: 6.5 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Spesifikasi_PC_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 3. Laporan Kondisi Barang
// ══════════════════════════════════════════════

export function exportKondisiExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const rows = items.map((i, idx) => ({
    No: idx + 1,
    "Kode": i.inventory_code,
    "Nama Barang": i.name,
    "Kategori": catName(i.category_id, cats),
    "Ruangan": roomName(i.room_id, rooms),
    "Kondisi": i.condition,
    "Keterangan": i.notes ?? "-",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  downloadXlsx(ws, `Laporan_Kondisi_${ts()}.xlsx`);
}

export async function exportKondisiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF();
  const startY = await pdfHeader(doc, "LAPORAN KONDISI BARANG", settings);

  const baik = items.filter((i) => i.condition === "Baik").length;
  const ringan = items.filter((i) => i.condition === "Rusak Ringan").length;
  const berat = items.filter((i) => i.condition === "Rusak Berat").length;
  const diperbaiki = items.filter((i) => i.condition === "Diperbaiki").length;

  doc.setFontSize(9);
  doc.text(`Rekap: Baik (${baik}), Rusak Ringan (${ringan}), Rusak Berat (${berat}), Diperbaiki (${diperbaiki})`, 14, startY);

  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kode", "Nama Barang", "Kategori", "Ruangan", "Kondisi", "Keterangan"]],
    body: items.map((i, idx) => [
      idx + 1, i.inventory_code, i.name,
      catName(i.category_id, cats), roomName(i.room_id, rooms),
      i.condition, i.notes ?? "-",
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Kondisi_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 4. Laporan Perbaikan
// ══════════════════════════════════════════════

export function exportPerbaikanExcel(records: MaintenanceRecord[], items: InventoryItem[]) {
  const rows = records.map((r, idx) => {
    const item = items.find((i) => i.id === r.item_id);
    return {
      No: idx + 1,
      "Kode Barang": item?.inventory_code ?? "-",
      "Nama Barang": item?.name ?? "-",
      "Tanggal Lapor": r.issue_date,
      "Deskripsi": r.description,
      "Teknisi": r.technician,
      "Tanggal Selesai": r.repair_date ?? "-",
      "Tindakan": r.action ?? "-",
      "Biaya": r.cost ?? 0,
      "Status": r.status,
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  downloadXlsx(ws, `Laporan_Perbaikan_${ts()}.xlsx`);
}

export async function exportPerbaikanPdf(records: MaintenanceRecord[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN PERBAIKAN BARANG", settings);
  autoTable(doc, {
    startY,
    head: [["No", "Kode", "Nama Barang", "Tgl Lapor", "Deskripsi", "Teknisi", "Tgl Selesai", "Tindakan", "Biaya", "Status"]],
    body: records.map((r, idx) => {
      const item = items.find((i) => i.id === r.item_id);
      return [
        idx + 1, item?.inventory_code ?? "-", item?.name ?? "-",
        r.issue_date, r.description, r.technician,
        r.repair_date ?? "-", r.action ?? "-",
        r.cost ? formatCurrency(r.cost) : "-", r.status,
      ];
    }),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Perbaikan_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 5. Laporan Nilai Aset
// ══════════════════════════════════════════════

export function exportNilaiExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const rows = items.map((i, idx) => ({
    No: idx + 1,
    "Kode": i.inventory_code,
    "Nama Barang": i.name,
    "Merk": i.brand,
    "Kategori": catName(i.category_id, cats),
    "Ruangan": roomName(i.room_id, rooms),
    "Tahun Perolehan": i.year_acquired ?? "-",
    "Harga (Rp)": i.price ?? 0,
  }));
  const total = items.reduce((s, i) => s + (i.price ?? 0), 0);
  rows.push({ No: "" as any, "Kode": "", "Nama Barang": "", "Merk": "", "Kategori": "", "Ruangan": "", "Tahun Perolehan": "TOTAL" as any, "Harga (Rp)": total });
  const ws = XLSX.utils.json_to_sheet(rows);
  downloadXlsx(ws, `Laporan_Nilai_Aset_${ts()}.xlsx`);
}

export async function exportNilaiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF();
  const startY = await pdfHeader(doc, "LAPORAN NILAI ASET INVENTARIS", settings);
  const total = items.reduce((s, i) => s + (i.price ?? 0), 0);

  doc.setFontSize(10);
  doc.text(`Total Nilai Aset: ${formatCurrency(total)} (${items.length} item)`, 14, startY);

  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kode", "Nama Barang", "Kategori", "Ruangan", "Tahun", "Harga"]],
    body: items.map((i, idx) => [
      idx + 1, i.inventory_code, i.name,
      catName(i.category_id, cats), roomName(i.room_id, rooms),
      i.year_acquired ?? "-", i.price ? formatCurrency(i.price) : "-",
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
    foot: [["", "", "", "", "", "TOTAL", formatCurrency(total)]],
    footStyles: { fillColor: [41, 55, 76], textColor: [255, 255, 255] },
  });

  // Signature area
  const pageH = doc.internal.pageSize.getHeight();
  const manager = settings["lab_manager"] || "___________________";
  const nip = settings["lab_manager_nip"] || "";
  doc.setFontSize(9);
  doc.text(`Mengetahui,`, doc.internal.pageSize.getWidth() - 60, pageH - 40);
  doc.text(`Pengelola Lab`, doc.internal.pageSize.getWidth() - 60, pageH - 35);
  doc.text(manager, doc.internal.pageSize.getWidth() - 60, pageH - 15);
  if (nip) doc.text(`NIP. ${nip}`, doc.internal.pageSize.getWidth() - 60, pageH - 10);

  doc.save(`Laporan_Nilai_Aset_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 6. Laporan Peminjaman
// ══════════════════════════════════════════════

export function exportPeminjamanExcel(borrowings: Borrowing[], items: InventoryItem[]) {
  const rows = borrowings.map((b, idx) => {
    const item = items.find((i) => i.id === b.item_id);
    return {
      No: idx + 1,
      "Kode Barang": item?.inventory_code ?? "-",
      "Nama Barang": item?.name ?? "-",
      "Peminjam": b.borrower_name,
      "Keperluan": b.purpose ?? "-",
      "Tgl Pinjam": b.borrow_date,
      "Tgl Kembali (Rencana)": b.expected_return_date,
      "Tgl Kembali (Aktual)": b.actual_return_date ?? "-",
      "Status": b.status,
      "Catatan": b.notes ?? "-",
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 14 }, { wch: 24 }, { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 20 }];
  downloadXlsx(ws, `Laporan_Peminjaman_${ts()}.xlsx`);
}

export async function exportPeminjamanPdf(borrowings: Borrowing[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN PEMINJAMAN BARANG", settings);

  const aktif = borrowings.filter((b) => b.status === "Dipinjam").length;
  const selesai = borrowings.filter((b) => b.status === "Dikembalikan").length;
  const menunggu = borrowings.filter((b) => b.status === "Menunggu").length;

  doc.setFontSize(9);
  doc.text(`Rekap: Aktif Dipinjam (${aktif}), Dikembalikan (${selesai}), Menunggu (${menunggu}), Total (${borrowings.length})`, 14, startY);

  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kode", "Nama Barang", "Peminjam", "Keperluan", "Tgl Pinjam", "Tgl Kembali", "Aktual", "Status"]],
    body: borrowings.map((b, idx) => {
      const item = items.find((i) => i.id === b.item_id);
      return [
        idx + 1, item?.inventory_code ?? "-", item?.name ?? "-",
        b.borrower_name, b.purpose ?? "-", b.borrow_date,
        b.expected_return_date, b.actual_return_date ?? "-", b.status,
      ];
    }),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Peminjaman_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 7. Laporan Jadwal Maintenance
// ══════════════════════════════════════════════

const FREQ_LABELS: Record<string, string> = {
  weekly: "Mingguan", monthly: "Bulanan", quarterly: "3 Bulanan",
  biannual: "6 Bulanan", yearly: "Tahunan",
};

export function exportJadwalMaintenanceExcel(schedules: MaintenanceSchedule[], items: InventoryItem[]) {
  const rows = schedules.map((s, idx) => {
    const item = items.find((i) => i.id === s.item_id);
    return {
      No: idx + 1,
      "Kode Barang": item?.inventory_code ?? "-",
      "Nama Barang": item?.name ?? "-",
      "Judul Jadwal": s.title,
      "Deskripsi": s.description ?? "-",
      "Frekuensi": FREQ_LABELS[s.frequency] ?? s.frequency,
      "Jadwal Berikutnya": s.next_due_date,
      "Terakhir Dilakukan": s.last_performed_date ?? "-",
      "Teknisi": s.assigned_technician ?? "-",
      "Status": s.is_active ? "Aktif" : "Nonaktif",
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 14 }, { wch: 24 }, { wch: 20 }, { wch: 24 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 10 }];
  downloadXlsx(ws, `Laporan_Jadwal_Maintenance_${ts()}.xlsx`);
}

export async function exportJadwalMaintenancePdf(schedules: MaintenanceSchedule[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN JADWAL MAINTENANCE", settings);
  const todayStr = new Date().toISOString().split("T")[0];
  const overdue = schedules.filter(s => s.is_active && s.next_due_date <= todayStr).length;
  const aktif = schedules.filter(s => s.is_active).length;

  doc.setFontSize(9);
  doc.text(`Rekap: Total (${schedules.length}), Aktif (${aktif}), Jatuh Tempo (${overdue})`, 14, startY);

  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kode", "Nama Barang", "Judul", "Frekuensi", "Jadwal Berikutnya", "Terakhir", "Teknisi", "Status"]],
    body: schedules.map((s, idx) => {
      const item = items.find((i) => i.id === s.item_id);
      return [
        idx + 1, item?.inventory_code ?? "-", item?.name ?? "-",
        s.title, FREQ_LABELS[s.frequency] ?? s.frequency, s.next_due_date,
        s.last_performed_date ?? "-", s.assigned_technician ?? "-",
        s.is_active ? "Aktif" : "Nonaktif",
      ];
    }),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Jadwal_Maintenance_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 8. Laporan Software & Lisensi
// ══════════════════════════════════════════════

export function exportSoftwareExcel(software: SoftwareItem[], items: InventoryItem[]) {
  const rows = software.map((s, idx) => {
    const item = items.find((i) => i.id === s.item_id);
    return {
      No: idx + 1,
      "Kode Barang": item?.inventory_code ?? "-",
      "Nama Perangkat": item?.name ?? "-",
      "Software": s.software_name,
      "Versi": s.version ?? "-",
      "Tipe Lisensi": s.license_type ?? "-",
      "License Key": s.license_key ?? "-",
      "Kadaluarsa": s.expiry_date ?? "-",
      "Catatan": s.notes ?? "-",
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 14 }, { wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 14 }, { wch: 24 }, { wch: 12 }, { wch: 20 }];
  downloadXlsx(ws, `Laporan_Software_${ts()}.xlsx`);
}

export async function exportSoftwarePdf(software: SoftwareItem[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN SOFTWARE & LISENSI", settings);
  const todayStr = new Date().toISOString().split("T")[0];
  const expired = software.filter(s => s.expiry_date && s.expiry_date < todayStr).length;

  doc.setFontSize(9);
  doc.text(`Rekap: Total Software (${software.length}), Lisensi Kadaluarsa (${expired})`, 14, startY);

  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kode", "Perangkat", "Software", "Versi", "Tipe Lisensi", "License Key", "Kadaluarsa"]],
    body: software.map((s, idx) => {
      const item = items.find((i) => i.id === s.item_id);
      return [
        idx + 1, item?.inventory_code ?? "-", item?.name ?? "-",
        s.software_name, s.version ?? "-", s.license_type ?? "-",
        s.license_key ?? "-", s.expiry_date ?? "-",
      ];
    }),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Software_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 9. Laporan Barang per Ruangan
// ══════════════════════════════════════════════

export function exportPerRuanganExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const rows = items
    .sort((a, b) => roomName(a.room_id, rooms).localeCompare(roomName(b.room_id, rooms)))
    .map((i, idx) => ({
      No: idx + 1,
      "Ruangan": roomName(i.room_id, rooms),
      "Kode Inventaris": i.inventory_code,
      "Nama Barang": i.name,
      "Merk": i.brand,
      "Kategori": catName(i.category_id, cats),
      "Kondisi": i.condition,
      "Status": i.status,
    }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 20 }, { wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 10 }];
  downloadXlsx(ws, `Laporan_Per_Ruangan_${ts()}.xlsx`);
}

export async function exportPerRuanganPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN BARANG PER RUANGAN", settings);

  // Summary per room
  const roomCounts = rooms.map(r => ({
    name: r.name,
    count: items.filter(i => i.room_id === r.id).length,
  })).filter(r => r.count > 0);
  const summary = roomCounts.map(r => `${r.name} (${r.count})`).join(", ");
  doc.setFontSize(9);
  doc.text(`Distribusi: ${summary}`, 14, startY);

  const sorted = [...items].sort((a, b) => roomName(a.room_id, rooms).localeCompare(roomName(b.room_id, rooms)));
  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Ruangan", "Kode", "Nama Barang", "Merk", "Kategori", "Kondisi", "Status"]],
    body: sorted.map((i, idx) => [
      idx + 1, roomName(i.room_id, rooms), i.inventory_code, i.name,
      i.brand, catName(i.category_id, cats), i.condition, i.status,
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Per_Ruangan_${ts()}.pdf`);
}

// ══════════════════════════════════════════════
// 10. Laporan Barang per Kategori
// ══════════════════════════════════════════════

export function exportPerKategoriExcel(items: InventoryItem[], cats: Category[], rooms: Room[]) {
  const rows = items
    .sort((a, b) => catName(a.category_id, cats).localeCompare(catName(b.category_id, cats)))
    .map((i, idx) => ({
      No: idx + 1,
      "Kategori": catName(i.category_id, cats),
      "Kode Inventaris": i.inventory_code,
      "Nama Barang": i.name,
      "Merk": i.brand,
      "Ruangan": roomName(i.room_id, rooms),
      "Kondisi": i.condition,
      "Status": i.status,
    }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 4 }, { wch: 16 }, { wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 10 }];
  downloadXlsx(ws, `Laporan_Per_Kategori_${ts()}.xlsx`);
}

export async function exportPerKategoriPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = await pdfHeader(doc, "LAPORAN BARANG PER KATEGORI", settings);

  const catCounts = cats.map(c => ({
    name: c.name,
    count: items.filter(i => i.category_id === c.id).length,
  })).filter(c => c.count > 0);
  const summary = catCounts.map(c => `${c.name} (${c.count})`).join(", ");
  doc.setFontSize(9);
  doc.text(`Distribusi: ${summary}`, 14, startY);

  const sorted = [...items].sort((a, b) => catName(a.category_id, cats).localeCompare(catName(b.category_id, cats)));
  autoTable(doc, {
    startY: startY + 6,
    head: [["No", "Kategori", "Kode", "Nama Barang", "Merk", "Ruangan", "Kondisi", "Status"]],
    body: sorted.map((i, idx) => [
      idx + 1, catName(i.category_id, cats), i.inventory_code, i.name,
      i.brand, roomName(i.room_id, rooms), i.condition, i.status,
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [41, 55, 76] },
  });
  doc.save(`Laporan_Per_Kategori_${ts()}.pdf`);
}
