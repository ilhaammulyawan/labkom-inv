import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useInsertItem, type ItemInsert } from "@/hooks/useItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ParsedRow {
  rowIndex: number;
  data: Record<string, string>;
  errors: string[];
  isValid: boolean;
}

const TEMPLATE_COLUMNS = [
  { key: "inventory_code", label: "Kode Inventaris", required: true },
  { key: "name", label: "Nama Barang", required: true },
  { key: "category", label: "Kategori", required: true },
  { key: "room", label: "Ruangan", required: true },
  { key: "brand", label: "Merk", required: true },
  { key: "model", label: "Model", required: false },
  { key: "serial_number", label: "Serial Number", required: false },
  { key: "condition", label: "Kondisi", required: true },
  { key: "hostname", label: "Hostname", required: false },
  { key: "cpu", label: "CPU", required: false },
  { key: "ram", label: "RAM", required: false },
  { key: "storage", label: "Storage", required: false },
  { key: "vga", label: "VGA", required: false },
  { key: "os", label: "Sistem Operasi", required: false },
  { key: "os_license", label: "Lisensi OS", required: false },
  { key: "ip_address", label: "IP Address", required: false },
  { key: "mac_address", label: "MAC Address", required: false },
  { key: "screen_size", label: "Ukuran Layar", required: false },
  { key: "printer_type", label: "Jenis Printer", required: false },
  { key: "year_manufactured", label: "Tahun Pembuatan", required: false },
  { key: "year_acquired", label: "Tahun Perolehan", required: false },
  { key: "price", label: "Harga", required: false },
  { key: "notes", label: "Catatan", required: false },
];

const VALID_CONDITIONS = ["Baik", "Rusak Ringan", "Rusak Berat", "Diperbaiki"];

const ImportExcel = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const insertItem = useInsertItem();

  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      TEMPLATE_COLUMNS.map(c => c.label),
      // Sample data row
      [
        "PC-25-0001", "PC Desktop Lab 1 Meja 01", "Komputer/PC", "Lab Komputer 1",
        "Dell", "OptiPlex 7090", "SN12345", "Baik",
        "LAB1-PC01", "Intel Core i5-11500", "16 GB DDR4", "SSD 512GB",
        "Intel UHD 730", "Windows 11 Pro", "OEM", "192.168.1.101",
        "AA:BB:CC:DD:EE:FF", "", "", "2023", "2024", "10000000", "PC untuk praktikum"
      ]
    ]);

    // Set column widths
    ws["!cols"] = TEMPLATE_COLUMNS.map(() => ({ wch: 18 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Import");
    XLSX.writeFile(wb, "template_import_inventaris.xlsx");
    toast.success("Template berhasil diunduh!");
  };

  const validateRow = (row: Record<string, string>, rowIndex: number): ParsedRow => {
    const errors: string[] = [];

    // Check required fields
    const requiredFields = TEMPLATE_COLUMNS.filter(c => c.required);
    for (const field of requiredFields) {
      const value = row[field.key]?.trim();
      if (!value) {
        errors.push(`${field.label} wajib diisi`);
      }
    }

    // Validate category exists
    if (row.category) {
      const categoryExists = categories.some(
        c => c.name.toLowerCase() === row.category.toLowerCase()
      );
      if (!categoryExists) {
        errors.push(`Kategori "${row.category}" tidak ditemukan`);
      }
    }

    // Validate room exists
    if (row.room) {
      const roomExists = rooms.some(
        r => r.name.toLowerCase() === row.room.toLowerCase()
      );
      if (!roomExists) {
        errors.push(`Ruangan "${row.room}" tidak ditemukan`);
      }
    }

    // Validate condition
    if (row.condition && !VALID_CONDITIONS.includes(row.condition)) {
      errors.push(`Kondisi harus salah satu dari: ${VALID_CONDITIONS.join(", ")}`);
    }

    // Validate year fields
    if (row.year_manufactured) {
      const year = parseInt(row.year_manufactured);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
        errors.push("Tahun pembuatan tidak valid");
      }
    }

    if (row.year_acquired) {
      const year = parseInt(row.year_acquired);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
        errors.push("Tahun perolehan tidak valid");
      }
    }

    // Validate price
    if (row.price) {
      const price = parseInt(row.price.replace(/[^0-9]/g, ""));
      if (isNaN(price) || price < 0) {
        errors.push("Harga tidak valid");
      }
    }

    return {
      rowIndex,
      data: row,
      errors,
      isValid: errors.length === 0,
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".csv")) {
      toast.error("Format file tidak didukung", { description: "Gunakan file Excel (.xlsx, .xls) atau CSV" });
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { raw: false });

        if (jsonData.length === 0) {
          toast.error("File kosong atau format tidak sesuai");
          return;
        }

        // Map header names to keys
        const mappedData = jsonData.map((row, index) => {
          const mapped: Record<string, string> = {};
          for (const col of TEMPLATE_COLUMNS) {
            // Try to match by label (Indonesian) or key (English)
            const value = row[col.label] || row[col.key] || "";
            mapped[col.key] = String(value).trim();
          }
          return validateRow(mapped, index + 2); // +2 for header row and 1-based index
        });

        setParsedRows(mappedData);
        toast.success(`${mappedData.length} baris data berhasil dibaca`);
      } catch (error) {
        toast.error("Gagal membaca file", { description: "Pastikan format file sesuai template" });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      toast.error("Tidak ada data valid untuk diimport");
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportedCount(0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const category = categories.find(
          c => c.name.toLowerCase() === row.data.category.toLowerCase()
        );
        const room = rooms.find(
          r => r.name.toLowerCase() === row.data.room.toLowerCase()
        );

        const item: ItemInsert = {
          inventory_code: row.data.inventory_code,
          name: row.data.name,
          category_id: category?.id,
          room_id: room?.id,
          brand: row.data.brand,
          model: row.data.model || "",
          serial_number: row.data.serial_number || "",
          condition: row.data.condition as any,
          hostname: row.data.hostname || undefined,
          cpu: row.data.cpu || undefined,
          ram: row.data.ram || undefined,
          storage: row.data.storage || undefined,
          vga: row.data.vga || undefined,
          os: row.data.os || undefined,
          os_license: row.data.os_license || undefined,
          ip_address: row.data.ip_address || undefined,
          mac_address: row.data.mac_address || undefined,
          screen_size: row.data.screen_size || undefined,
          printer_type: row.data.printer_type || undefined,
          year_manufactured: row.data.year_manufactured ? parseInt(row.data.year_manufactured) : undefined,
          year_acquired: row.data.year_acquired ? parseInt(row.data.year_acquired) : undefined,
          price: row.data.price ? parseInt(row.data.price.replace(/[^0-9]/g, "")) : undefined,
          notes: row.data.notes || undefined,
        };

        await insertItem.mutateAsync(item);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error importing row ${row.rowIndex}:`, error);
      }

      setImportProgress(Math.round(((i + 1) / validRows.length) * 100));
      setImportedCount(successCount);
    }

    setIsImporting(false);

    if (errorCount === 0) {
      toast.success(`${successCount} barang berhasil diimport!`);
      navigate("/inventory");
    } else {
      toast.warning(`Import selesai: ${successCount} berhasil, ${errorCount} gagal`);
    }
  };

  const clearFile = () => {
    setFile(null);
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" /> Import dari Excel
          </h1>
          <p className="text-sm text-muted-foreground">Upload file Excel/CSV untuk import data inventaris</p>
        </div>
      </div>

      {/* Step 1: Download Template */}
      <div className="kpi-card space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
          Download Template
        </h3>
        <p className="text-xs text-muted-foreground">
          Download template Excel terlebih dahulu untuk memastikan format data sesuai.
        </p>
        <Button onClick={downloadTemplate} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download Template Excel
        </Button>
      </div>

      {/* Step 2: Upload File */}
      <div className="kpi-card space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
          Upload File
        </h3>
        
        {!file ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-primary">Klik untuk upload</span>
              <span className="text-sm text-muted-foreground"> atau drag & drop file</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">Excel (.xlsx, .xls) atau CSV</p>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Step 3: Preview & Validate */}
      {parsedRows.length > 0 && (
        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
            Preview & Validasi
          </h3>

          {/* Summary */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="gap-1">
              Total: {parsedRows.length} baris
            </Badge>
            <Badge variant="default" className="gap-1 bg-green-600">
              <CheckCircle2 className="h-3 w-3" /> Valid: {validCount}
            </Badge>
            {invalidCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" /> Error: {invalidCount}
              </Badge>
            )}
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.map((row, index) => (
                  <TableRow key={index} className={row.isValid ? "" : "bg-destructive/5"}>
                    <TableCell className="text-xs">{row.rowIndex}</TableCell>
                    <TableCell>
                      {row.isValid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{row.data.inventory_code}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{row.data.name}</TableCell>
                    <TableCell className="text-xs">{row.data.category}</TableCell>
                    <TableCell className="text-xs">{row.data.room}</TableCell>
                    <TableCell className="text-xs">{row.data.condition}</TableCell>
                    <TableCell className="text-xs text-destructive max-w-[200px]">
                      {row.errors.join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mengimport data...</span>
                <span>{importedCount} / {validCount}</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={clearFile} disabled={isImporting}>
              Batal
            </Button>
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || isImporting}
              className="gradient-primary text-primary-foreground border-0 gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengimport...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Import {validCount} Barang
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h4 className="text-sm font-semibold text-primary mb-2">💡 Tips Import</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Gunakan template yang disediakan untuk menghindari error format</li>
          <li>Pastikan nama Kategori dan Ruangan sudah terdaftar di sistem</li>
          <li>Kondisi harus diisi dengan: Baik, Rusak Ringan, Rusak Berat, atau Diperbaiki</li>
          <li>Kode Inventaris harus unik untuk setiap barang</li>
          <li>Field dengan tanda (*) adalah wajib diisi</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportExcel;
