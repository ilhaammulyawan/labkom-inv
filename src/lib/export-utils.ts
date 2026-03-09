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

// ── Excel helpers ──

function downloadXlsx(ws: XLSX.WorkSheet, filename: string) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  XLSX.writeFile(wb, filename);
}

// ── PDF helpers ──

function pdfHeader(doc: jsPDF, title: string, settings: Record<string, string>) {
  const inst = settings["institution_name"] || "";
  const addr = settings["institution_address"] || "";
  doc.setFontSize(14);
  doc.text(inst, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
  doc.setFontSize(9);
  doc.text(addr, doc.internal.pageSize.getWidth() / 2, 21, { align: "center" });
  doc.setFontSize(12);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Dicetak: ${today()}`, 14, 37);
  return 42;
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

export function exportInventarisPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = pdfHeader(doc, "LAPORAN INVENTARIS LABORATORIUM", settings);
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

export function exportSpesifikasiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = pdfHeader(doc, "LAPORAN SPESIFIKASI KOMPUTER", settings);
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

export function exportKondisiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF();
  const startY = pdfHeader(doc, "LAPORAN KONDISI BARANG", settings);

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

export function exportPerbaikanPdf(records: MaintenanceRecord[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = pdfHeader(doc, "LAPORAN PERBAIKAN BARANG", settings);
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

export function exportNilaiPdf(items: InventoryItem[], cats: Category[], rooms: Room[], settings: Record<string, string>) {
  const doc = new jsPDF();
  const startY = pdfHeader(doc, "LAPORAN NILAI ASET INVENTARIS", settings);
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

export function exportPeminjamanPdf(borrowings: Borrowing[], items: InventoryItem[], settings: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape" });
  const startY = pdfHeader(doc, "LAPORAN PEMINJAMAN BARANG", settings);

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
