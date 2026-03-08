import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

const chapters = [
  {
    title: "BAB 1: Pendahuluan",
    sections: [
      { title: "Tentang SiiLaKu", content: "SiiLaKu (Sistem Informasi Inventaris Laboratorium Komputer) adalah aplikasi web untuk mengelola semua aset perangkat keras dan lunak di laboratorium komputer. Dengan SiiLaKu, pencatatan detail spesifikasi setiap PC, monitor, dan perangkat lainnya menjadi mudah dan terorganisir." },
      { title: "Manfaat Aplikasi", content: "• Pencatatan aset digital yang rapi dan terstruktur\n• QR Code untuk identifikasi cepat setiap barang\n• Monitoring kondisi dan riwayat perbaikan\n• Laporan inventaris yang bisa diekspor\n• Akses dari mana saja melalui browser" },
    ],
  },
  {
    title: "BAB 2: Memulai Aplikasi",
    sections: [
      { title: "Login", content: "Masukkan username dan password yang telah diberikan oleh admin. Setiap role memiliki akses berbeda:\n• Super Admin: Akses penuh\n• Teknisi: Edit data, catat perbaikan\n• Guru/Dosen: Lihat inventaris, scan QR\n• Asisten Lab: Lihat dan catat peminjaman" },
      { title: "Ganti Password", content: "Buka menu Pengaturan > Profil > Ganti Password. Masukkan password lama dan password baru." },
    ],
  },
  {
    title: "BAB 3: Dashboard",
    sections: [
      { title: "Membaca Statistik", content: "Dashboard menampilkan ringkasan inventaris berupa KPI cards (total PC, monitor, printer, barang rusak), grafik komposisi per kategori, kondisi barang, dan sebaran per ruangan." },
    ],
  },
  {
    title: "BAB 4: Manajemen Inventaris",
    sections: [
      { title: "Menambah Barang", content: "Klik 'Tambah Barang' dari sidebar atau halaman Inventaris. Pilih kategori terlebih dahulu, form akan menyesuaikan field yang ditampilkan sesuai jenis barang." },
      { title: "Mengedit Barang", content: "Buka detail barang dari daftar inventaris, lalu klik tombol 'Edit'." },
      { title: "Mencetak QR Code", content: "Buka menu 'Cetak QR', pilih barang yang ingin dicetak, atur ukuran label, lalu klik 'Cetak'." },
    ],
  },
  {
    title: "BAB 5: QR Code",
    sections: [
      { title: "Cara Scan", content: "Arahkan kamera HP ke QR Code pada barang. Browser akan membuka halaman detail barang secara otomatis." },
      { title: "Melaporkan Kerusakan", content: "Setelah scan QR, klik tombol 'Laporkan Masalah' pada halaman detail barang." },
    ],
  },
  {
    title: "BAB 6: Perbaikan",
    sections: [
      { title: "Mencatat Kerusakan", content: "Buka menu Perbaikan > Catat Perbaikan. Pilih barang, isi deskripsi masalah, tanggal kerusakan, dan teknisi yang menangani." },
      { title: "Update Status", content: "Ubah status perbaikan dari 'Antrian' ke 'Dalam Perbaikan' hingga 'Selesai'." },
    ],
  },
  {
    title: "BAB 7: Laporan",
    sections: [
      { title: "Membuat Laporan", content: "Buka menu Laporan, pilih jenis laporan, atur filter, lalu klik Generate. Laporan bisa diunduh dalam format Excel atau PDF." },
    ],
  },
  {
    title: "BAB 8: Troubleshooting",
    sections: [
      { title: "QR Code tidak terbaca", content: "• Pastikan QR Code tidak rusak atau terlipat\n• Pastikan pencahayaan cukup\n• Coba scan dari jarak 10-20 cm\n• Gunakan aplikasi scanner QR bawaan HP" },
      { title: "Lupa Password", content: "Hubungi Super Admin untuk reset password akun Anda." },
      { title: "Data tidak muncul", content: "• Periksa koneksi internet\n• Refresh halaman browser\n• Clear cache browser\n• Hubungi admin jika masalah berlanjut" },
    ],
  },
];

const Guide = () => {
  const [openChapter, setOpenChapter] = useState<number | null>(0);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><BookOpen className="h-6 w-6" /> Buku Panduan</h1>
        <p className="text-sm text-muted-foreground">Panduan lengkap penggunaan SiiLaKu</p>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter, ci) => (
          <div key={ci} className="kpi-card p-0 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
              onClick={() => setOpenChapter(openChapter === ci ? null : ci)}
            >
              <span className="text-sm font-semibold">{chapter.title}</span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${openChapter === ci ? 'rotate-90' : ''}`} />
            </button>
            {openChapter === ci && (
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
        ))}
      </div>
    </div>
  );
};

export default Guide;
