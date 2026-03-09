import { BookOpen, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const chapters = [
  {
    title: "BAB 1: Pendahuluan",
    sections: [
      { title: "Tentang SiiLaKu", content: "SiiLaKu (Sistem Informasi Inventaris Laboratorium Komputer) adalah aplikasi web untuk mengelola semua aset perangkat keras dan lunak di laboratorium komputer. Dengan SiiLaKu, pencatatan detail spesifikasi setiap PC, monitor, dan perangkat lainnya menjadi mudah dan terorganisir." },
      { title: "Manfaat Aplikasi", content: "• Pencatatan aset digital yang rapi dan terstruktur\n• QR Code untuk identifikasi cepat setiap barang\n• Monitoring kondisi dan riwayat perbaikan\n• Laporan inventaris yang bisa diekspor ke Excel & PDF\n• Manajemen kategori dan ruangan yang fleksibel\n• Profil pengguna dengan foto avatar\n• Pengaturan aplikasi yang dapat dikustomisasi\n• Akses dari mana saja melalui browser" },
    ],
  },
  {
    title: "BAB 2: Memulai Aplikasi",
    sections: [
      { title: "Login", content: "Masukkan email dan password yang telah didaftarkan. Klik 'Masuk' untuk mengakses dashboard." },
      { title: "Lupa Password", content: "Klik 'Lupa Password?' di halaman login. Masukkan email Anda, lalu cek inbox untuk link reset password." },
      { title: "Edit Profil", content: "Klik avatar/nama Anda di header kanan atas, pilih 'Edit Profil'. Anda bisa mengubah nama lengkap dan mengunggah foto profil." },
    ],
  },
  {
    title: "BAB 3: Dashboard",
    sections: [
      { title: "Membaca Statistik", content: "Dashboard menampilkan ringkasan inventaris berupa:\n• KPI cards: Total PC, Monitor, Printer, dan barang rusak\n• Grafik komposisi per kategori\n• Grafik kondisi barang (Baik, Rusak Ringan, Rusak Berat)\n• Sebaran barang per ruangan\n• Total nilai aset inventaris" },
    ],
  },
  {
    title: "BAB 4: Manajemen Inventaris",
    sections: [
      { title: "Melihat Daftar Barang", content: "Buka menu 'Inventaris' di sidebar. Gunakan fitur pencarian dan filter kategori/ruangan/kondisi untuk menemukan barang tertentu." },
      { title: "Menambah Barang", content: "Klik 'Tambah Barang' dari sidebar atau halaman Inventaris. Isi form:\n• Pilih kategori (PC, Monitor, Printer, dll)\n• Kode inventaris otomatis ter-generate\n• Isi spesifikasi sesuai jenis barang\n• Pilih ruangan penempatan\n• Tentukan kondisi dan status barang" },
      { title: "Import dari Excel", content: "Untuk import data dalam jumlah banyak:\n1. Buka menu 'Import Excel' di sidebar\n2. Download template Excel yang disediakan\n3. Isi data sesuai format template\n4. Upload file Excel/CSV\n5. Sistem akan memvalidasi data\n6. Klik 'Import' untuk menyimpan data valid\n\nPastikan nama Kategori dan Ruangan sudah terdaftar di sistem." },
      { title: "Melihat Detail Barang", content: "Klik nama barang di daftar inventaris untuk melihat detail lengkap:\n• Informasi umum (kode, merk, model, serial number)\n• Spesifikasi teknis (CPU, RAM, Storage, VGA, dll)\n• QR Code unik untuk barang tersebut\n• Riwayat perbaikan terkait" },
    ],
  },
  {
    title: "BAB 5: Kategori & Ruangan",
    sections: [
      { title: "Mengelola Kategori", content: "Buka menu 'Kategori' di sidebar. Anda dapat:\n• Menambah kategori baru dengan ikon\n• Mengedit nama dan ikon kategori\n• Menghapus kategori (pastikan tidak ada barang terkait)" },
      { title: "Mengelola Ruangan", content: "Buka menu 'Ruangan' di sidebar. Anda dapat:\n• Menambah ruangan baru dengan lokasi\n• Mengedit nama dan lokasi ruangan\n• Menghapus ruangan (pastikan tidak ada barang terkait)" },
    ],
  },
  {
    title: "BAB 6: QR Code",
    sections: [
      { title: "Mencetak QR Code", content: "Buka menu 'Cetak QR' di sidebar. Pilih barang yang ingin dicetak QR-nya, atur ukuran label, lalu klik 'Cetak'." },
      { title: "Scan QR Code", content: "Buka menu 'Scan QR' di sidebar atau arahkan kamera HP ke QR Code pada barang. Browser akan membuka halaman detail barang secara otomatis." },
      { title: "Akses Publik via QR", content: "QR Code dapat diakses tanpa login (jika diaktifkan di Pengaturan). Pengguna publik bisa melihat detail barang dan melaporkan kerusakan." },
    ],
  },
  {
    title: "BAB 7: Perbaikan",
    sections: [
      { title: "Mencatat Kerusakan", content: "Buka menu 'Perbaikan' di sidebar. Klik 'Catat Perbaikan':\n• Pilih barang yang rusak\n• Isi deskripsi masalah\n• Masukkan tanggal kerusakan\n• Tentukan teknisi yang menangani" },
      { title: "Update Status Perbaikan", content: "Ubah status perbaikan:\n• Antrian → barang menunggu diperbaiki\n• Dalam Perbaikan → sedang ditangani teknisi\n• Selesai → perbaikan telah selesai\n\nIsi juga tindakan yang dilakukan dan biaya perbaikan." },
    ],
  },
  {
    title: "BAB 8: Laporan & Export",
    sections: [
      { title: "Jenis Laporan", content: "Tersedia 5 jenis laporan:\n• Laporan Inventaris Lengkap\n• Laporan Spesifikasi PC\n• Laporan Kondisi Barang\n• Laporan Perbaikan\n• Laporan Nilai Aset" },
      { title: "Export Excel", content: "Klik tombol 'Excel' pada jenis laporan yang diinginkan. File .xlsx akan otomatis terunduh dengan data terbaru dari database." },
      { title: "Export PDF", content: "Klik tombol 'PDF' pada jenis laporan yang diinginkan. File .pdf akan otomatis terunduh dengan format tabel yang rapi, lengkap dengan kop surat sesuai pengaturan." },
    ],
  },
  {
    title: "BAB 9: Pengaturan",
    sections: [
      { title: "Identitas Aplikasi", content: "Atur nama aplikasi, subtitle, prefix kode inventaris, dan upload logo yang akan ditampilkan di sidebar dan halaman login." },
      { title: "Informasi Lembaga", content: "Isi data lembaga: nama instansi, alamat, kepala lab/pengelola, NIP, telepon, dan email. Data ini digunakan pada laporan." },
      { title: "Pengaturan Lainnya", content: "• Kop/Header Laporan: teks yang muncul di header laporan export\n• Akses QR Code Publik: izinkan/blokir akses detail barang tanpa login via QR" },
    ],
  },
  {
    title: "BAB 10: Troubleshooting",
    sections: [
      { title: "QR Code tidak terbaca", content: "• Pastikan QR Code tidak rusak atau terlipat\n• Pastikan pencahayaan cukup\n• Coba scan dari jarak 10-20 cm\n• Gunakan aplikasi scanner QR bawaan HP" },
      { title: "Lupa Password", content: "Klik 'Lupa Password?' di halaman login, masukkan email, dan ikuti instruksi reset via email." },
      { title: "Data tidak muncul", content: "• Periksa koneksi internet\n• Refresh halaman browser\n• Clear cache browser\n• Hubungi admin jika masalah berlanjut" },
      { title: "Gagal upload foto/logo", content: "• Pastikan ukuran file tidak melebihi 2MB\n• Gunakan format PNG, JPG, atau SVG\n• Periksa koneksi internet" },
    ],
  },
];

const Guide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openChapter, setOpenChapter] = useState<string | null>(chapters[0].title);

  const filteredChapters = chapters.map(chapter => {
    if (!searchQuery) return chapter;
    
    const query = searchQuery.toLowerCase();
    const matchChapterTitle = chapter.title.toLowerCase().includes(query);
    const matchedSections = chapter.sections.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.content.toLowerCase().includes(query)
    );

    if (matchChapterTitle) {
      return chapter;
    } else if (matchedSections.length > 0) {
      return { ...chapter, sections: matchedSections };
    }
    return null;
  }).filter(Boolean) as typeof chapters;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><BookOpen className="h-6 w-6" /> Buku Panduan</h1>
          <p className="text-sm text-muted-foreground">Panduan lengkap penggunaan SiiLaKu</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Cari panduan..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => (
            <div key={chapter.title} className="kpi-card p-0 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setOpenChapter(openChapter === chapter.title ? null : chapter.title)}
              >
                <span className="text-sm font-semibold">{chapter.title}</span>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${(openChapter === chapter.title || searchQuery) ? 'rotate-90' : ''}`} />
              </button>
              {(openChapter === chapter.title || searchQuery) && (
                <div className="border-t border-border px-4 pb-4 space-y-4 animate-fade-in">
                  {chapter.sections.map((section, si) => (
                    <div key={si} className="pt-4">
                      <h4 className="text-xs font-semibold text-primary mb-2">{section.title}</h4>
                      <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground kpi-card">
            Tidak ada panduan yang cocok dengan pencarian "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
