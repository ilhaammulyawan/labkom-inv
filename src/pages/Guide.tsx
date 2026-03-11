import { BookOpen, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const chapters = [
  {
    title: "BAB 1: Pendahuluan",
    sections: [
      { title: "Tentang SiiLaKu", content: "SiiLaKu (Sistem Informasi Inventaris Laboratorium Komputer) adalah aplikasi web untuk mengelola semua aset perangkat keras dan lunak di laboratorium komputer. Dengan SiiLaKu, pencatatan detail spesifikasi setiap PC, monitor, dan perangkat lainnya menjadi mudah dan terorganisir." },
      { title: "Manfaat Aplikasi", content: "• Pencatatan aset digital yang rapi dan terstruktur\n• QR Code untuk identifikasi cepat setiap barang\n• Monitoring kondisi dan riwayat perbaikan\n• Jadwal maintenance otomatis berkala\n• Sistem peminjaman barang dengan alur persetujuan\n• Inventaris software & lisensi\n• Laporan lengkap (10 jenis) export ke Excel & PDF\n• Notifikasi real-time untuk item jatuh tempo\n• Manajemen kategori dan ruangan yang fleksibel\n• Profil pengguna dengan foto avatar\n• Mode Gelap (Dark Mode) untuk kenyamanan visual\n• Pengaturan aplikasi yang dapat dikustomisasi\n• Riwayat aktivitas sistem\n• Akses dari mana saja melalui browser" },
      { title: "Sistem Role Pengguna", content: "Aplikasi memiliki 2 role pengguna:\n\n👤 USER (Pengguna Biasa)\n• Melihat Dashboard & statistik\n• Melihat daftar Inventaris\n• Mencatat & melihat Perbaikan\n• Scan & Cetak QR Code\n• Mengajukan peminjaman barang\n• Mengembalikan barang yang dipinjam\n• Melihat & export Laporan\n• Menerima notifikasi peminjaman jatuh tempo\n• Membaca Buku Panduan\n\n👑 ADMIN (Administrator)\nSemua fitur User, ditambah:\n• Tambah, Edit & Hapus Barang\n• Upload foto barang\n• Import data dari Excel\n• Kelola Kategori & Ruangan\n• Kelola Jadwal Maintenance\n• Approve/Tolak peminjaman\n• Serahkan & terima pengembalian barang\n• Kelola Software & Lisensi\n• Kelola Pengguna & Role\n• Lihat Riwayat Aktivitas\n• Pengaturan Aplikasi\n• Notifikasi: peminjaman pending, pengembalian, & maintenance jatuh tempo" },
    ],
  },
  {
    title: "BAB 2: Memulai Aplikasi",
    sections: [
      { title: "Login", content: "Masukkan email dan password yang telah didaftarkan. Klik 'Masuk' untuk mengakses dashboard." },
      { title: "Registrasi", content: "Klik 'Daftar' di halaman login. Isi nama lengkap, email, dan password. Verifikasi email Anda melalui link yang dikirim ke inbox." },
      { title: "Lupa Password", content: "Klik 'Lupa Password?' di halaman login. Masukkan email Anda, lalu cek inbox untuk link reset password." },
      { title: "Edit Profil", content: "Klik avatar/nama Anda di header kanan atas, pilih 'Edit Profil'. Anda bisa mengubah nama lengkap dan mengunggah foto profil." },
      { title: "Mode Gelap (Dark Mode)", content: "🌙 Klik ikon matahari/bulan di header kanan atas untuk mengubah tema tampilan:\n• ☀️ Terang — tampilan cerah (default)\n• 🌙 Gelap — tampilan gelap, nyaman untuk mata di ruangan minim cahaya\n• 🖥️ Sistem — otomatis mengikuti pengaturan perangkat Anda\n\nPilihan tema tersimpan otomatis dan berlaku untuk semua halaman." },
      { title: "Notifikasi", content: "🔔 Klik ikon lonceng di header untuk melihat notifikasi aktif:\n• Maintenance jatuh tempo (semua pengguna)\n• Peminjaman terlambat (pemilik & admin)\n• Permintaan peminjaman baru (admin)\n• Pengembalian menunggu konfirmasi (admin)\n\nKlik notifikasi untuk langsung menuju item terkait dengan highlight otomatis." },
    ],
  },
  {
    title: "BAB 3: Dashboard",
    sections: [
      { title: "Membaca Statistik", content: "📊 Akses: Semua pengguna\n\nDashboard menampilkan ringkasan inventaris berupa:\n• KPI cards: Total PC, Monitor, Printer, dan barang rusak\n• Grafik komposisi per kategori\n• Grafik kondisi barang (Baik, Rusak Ringan, Rusak Berat)\n• Sebaran barang per ruangan\n• Total nilai aset inventaris" },
    ],
  },
  {
    title: "BAB 4: Manajemen Inventaris",
    sections: [
      { title: "Melihat Daftar Barang", content: "📋 Akses: Semua pengguna\n\nBuka menu 'Inventaris' di sidebar. Gunakan fitur pencarian dan filter kategori/ruangan/kondisi untuk menemukan barang tertentu." },
      { title: "Print Daftar Inventaris", content: "🖨️ Akses: Semua pengguna\n\nKlik tombol 'Print' di halaman Inventaris untuk mencetak tabel daftar barang yang sedang ditampilkan (sesuai filter aktif). Hasil print berisi nomor, kode, nama, merk, kategori, ruangan, kondisi, dan status." },
      { title: "Menambah Barang", content: "➕ Akses: Admin only\n\nKlik 'Tambah Barang' dari sidebar atau halaman Inventaris. Isi form:\n• Pilih kategori (PC, Monitor, Printer, dll)\n• Kode inventaris otomatis ter-generate\n• Isi spesifikasi sesuai jenis barang\n• Pilih ruangan penempatan\n• Upload foto barang (opsional)\n• Tentukan kondisi dan status barang" },
      { title: "Edit Barang", content: "✏️ Akses: Admin only\n\nBuka detail barang, lalu klik tombol 'Edit'. Anda dapat mengubah semua informasi termasuk spesifikasi, kondisi, ruangan, dan foto." },
      { title: "Import dari Excel", content: "📥 Akses: Admin only\n\nUntuk import data dalam jumlah banyak:\n1. Buka menu 'Import Excel' di sidebar\n2. Download template Excel yang disediakan\n3. Isi data sesuai format template\n4. Upload file Excel/CSV\n5. Sistem akan memvalidasi data\n6. Klik 'Import' untuk menyimpan data valid\n\nPastikan nama Kategori dan Ruangan sudah terdaftar di sistem." },
      { title: "Melihat Detail Barang", content: "🔍 Akses: Semua pengguna\n\nKlik nama barang di daftar inventaris untuk melihat detail lengkap:\n• Informasi umum (kode, merk, model, serial number)\n• Spesifikasi teknis (CPU, RAM, Storage, VGA, dll)\n• Foto barang (jika sudah di-upload)\n• QR Code unik\n• Riwayat perbaikan terkait\n• Software yang terinstal" },
      { title: "Print Detail Barang", content: "🖨️ Akses: Semua pengguna\n\nDi halaman detail barang, klik tombol 'Print' di bagian atas. Hasil cetak meliputi:\n• Foto barang\n• Informasi umum lengkap\n• Spesifikasi teknis\n• Riwayat perbaikan" },
    ],
  },
  {
    title: "BAB 5: Kategori & Ruangan",
    sections: [
      { title: "Mengelola Kategori", content: "🏷️ Akses: Admin only\n\nBuka menu 'Kategori' di sidebar. Anda dapat:\n• Menambah kategori baru dengan ikon\n• Mengedit nama dan ikon kategori\n• Menghapus kategori (pastikan tidak ada barang terkait)" },
      { title: "Mengelola Ruangan", content: "📍 Akses: Admin only\n\nBuka menu 'Ruangan' di sidebar. Anda dapat:\n• Menambah ruangan baru dengan lokasi\n• Mengedit nama dan lokasi ruangan\n• Menghapus ruangan (pastikan tidak ada barang terkait)" },
    ],
  },
  {
    title: "BAB 6: QR Code",
    sections: [
      { title: "Mencetak QR Code", content: "🖨️ Akses: Semua pengguna\n\nBuka menu 'Cetak QR' di sidebar. Pilih barang yang ingin dicetak QR-nya, atur ukuran label (2×2, 3×3, atau 4×4 cm), lalu klik 'Cetak'. Anda juga bisa mencetak QR dari halaman detail barang." },
      { title: "Scan QR Code", content: "📷 Akses: Semua pengguna\n\nBuka menu 'Scan QR' di sidebar, klik 'Mulai Scan', lalu arahkan kamera ke QR Code pada barang. Anda juga bisa mengarahkan kamera HP langsung ke QR Code — browser akan membuka halaman detail barang secara otomatis." },
      { title: "Akses Publik via QR", content: "🌐 QR Code dapat diakses tanpa login. Halaman publik menampilkan:\n• Foto barang (jika tersedia)\n• Informasi umum (kode, nama, merk, model)\n• Kondisi & status barang\n• Spesifikasi teknis lengkap\n• Riwayat perbaikan\n\nTampilan dioptimalkan untuk perangkat mobile." },
    ],
  },
  {
    title: "BAB 7: Perbaikan & Maintenance",
    sections: [
      { title: "Mencatat Kerusakan", content: "🔧 Akses: Semua pengguna\n\nBuka menu 'Perbaikan' di sidebar. Klik 'Catat Perbaikan':\n• Pilih barang yang rusak\n• Isi deskripsi masalah\n• Masukkan tanggal kerusakan\n• Tentukan teknisi yang menangani" },
      { title: "Update Status Perbaikan", content: "📝 Akses: Admin\n\nUbah status perbaikan:\n• Antrian → barang menunggu diperbaiki\n• Dalam Perbaikan → sedang ditangani teknisi\n• Selesai → perbaikan telah selesai\n\nIsi juga tindakan yang dilakukan dan biaya perbaikan." },
      { title: "Jadwal Maintenance", content: "📅 Akses: Admin (kelola), Semua (lihat)\n\nBuka menu 'Jadwal Maintenance' di sidebar.\n\nAdmin dapat:\n• Tambah jadwal maintenance berkala per barang\n• Pilih frekuensi: Mingguan, Bulanan, 3 Bulanan, 6 Bulanan, Tahunan\n• Tentukan teknisi yang bertanggung jawab\n• Tandai 'Selesai' → tanggal berikutnya otomatis dihitung\n• Edit dan hapus jadwal\n\nJadwal yang sudah jatuh tempo akan muncul di notifikasi dengan badge 'Urgent'." },
    ],
  },
  {
    title: "BAB 8: Peminjaman Barang",
    sections: [
      { title: "Alur Peminjaman", content: "🔄 Alur lengkap peminjaman:\n\n1️⃣ User Ajukan → mengisi form peminjaman (pilih barang, tanggal, keperluan)\n2️⃣ Admin Setujui/Tolak → admin review dan memutuskan\n3️⃣ Admin Serahkan Barang → admin menyerahkan fisik barang\n4️⃣ User Kembalikan → user mengembalikan barang\n5️⃣ Admin Terima → admin konfirmasi pengembalian, selesai" },
      { title: "Mengajukan Peminjaman", content: "📝 Akses: Semua pengguna\n\nBuka menu 'Peminjaman' di sidebar, klik 'Ajukan Peminjaman':\n• Pilih barang yang ingin dipinjam (hanya barang aktif)\n• Isi keperluan peminjaman\n• Tentukan tanggal pinjam dan tanggal kembali\n• Tambahkan catatan (opsional)\n• Klik 'Ajukan' → status menjadi 'Menunggu Persetujuan'" },
      { title: "Mengembalikan Barang", content: "↩️ Akses: User (pemilik peminjaman)\n\nSaat selesai menggunakan barang:\n• Buka halaman Peminjaman\n• Cari peminjaman Anda dengan status 'Sedang Dipinjam'\n• Klik tombol 'Kembalikan Barang'\n• Status berubah ke 'Menunggu Konfirmasi Pengembalian'\n• Tunggu admin mengkonfirmasi pengembalian" },
      { title: "Kelola Peminjaman (Admin)", content: "👑 Akses: Admin only\n\nAdmin dapat melakukan:\n• Setujui atau tolak permintaan peminjaman\n• Serahkan barang ke peminjam (setelah disetujui)\n• Tandai pengembalian untuk barang yang sedang dipinjam\n• Terima pengembalian barang dari user\n• Hapus data peminjaman\n\nFilter berdasarkan status untuk memudahkan pengelolaan." },
      { title: "Peminjaman Terlambat", content: "⚠️ Barang yang melewati tanggal pengembalian akan ditandai:\n• Card peminjaman berborder merah\n• Muncul label '(Terlambat!)'\n• Notifikasi otomatis di bell icon untuk admin dan peminjam" },
    ],
  },
  {
    title: "BAB 9: Software & Lisensi",
    sections: [
      { title: "Mengelola Software", content: "💿 Akses: Admin (kelola), Semua (lihat)\n\nBuka menu 'Software' di sidebar.\n\nAdmin dapat:\n• Tambah software per perangkat\n• Isi nama software, versi, tipe lisensi, license key\n• Tentukan tanggal kadaluarsa lisensi\n• Edit dan hapus data software\n\nSoftware dengan lisensi kadaluarsa akan ditandai khusus." },
    ],
  },
  {
    title: "BAB 10: Laporan & Export",
    sections: [
      { title: "Jenis Laporan", content: "📄 Akses: Semua pengguna\n\nTersedia 10 jenis laporan yang dikelompokkan:\n\n📦 Inventaris & Aset:\n• Laporan Inventaris Lab — daftar semua barang\n• Laporan Barang per Ruangan — distribusi barang per lokasi\n• Laporan Barang per Kategori — distribusi barang per jenis\n• Laporan Kondisi Barang — rekap baik/rusak\n• Laporan Nilai Aset — total nilai inventaris\n• Laporan Spesifikasi PC — detail teknis komputer\n\n🔧 Maintenance & Perbaikan:\n• Laporan Jadwal Maintenance — jadwal berkala & jatuh tempo\n• Laporan Riwayat Perbaikan — semua catatan perbaikan\n\n📋 Peminjaman:\n• Laporan Peminjaman Barang — riwayat & status peminjaman\n\n💿 Software:\n• Laporan Software & Lisensi — data software & masa berlaku" },
      { title: "Export Excel", content: "📊 Klik tombol 'Excel' pada jenis laporan yang diinginkan. File .xlsx akan otomatis terunduh dengan data terbaru." },
      { title: "Export PDF", content: "📑 Klik tombol 'PDF' pada jenis laporan yang diinginkan. File .pdf akan otomatis terunduh dengan format tabel rapi, lengkap dengan kop surat sesuai pengaturan." },
      { title: "Badge Peringatan", content: "🔴 Beberapa laporan menampilkan badge peringatan:\n• Jadwal Maintenance: jumlah jadwal jatuh tempo\n• Software & Lisensi: jumlah lisensi kadaluarsa\n\nBadge ini membantu Anda mengetahui item yang perlu perhatian segera." },
    ],
  },
  {
    title: "BAB 11: Riwayat Aktivitas",
    sections: [
      { title: "Melihat Log Aktivitas", content: "📜 Akses: Admin only\n\nBuka menu 'Riwayat' di sidebar. Halaman ini mencatat semua aktivitas penting di sistem:\n• Penambahan, perubahan, dan penghapusan barang\n• Perubahan status perbaikan\n• Aktivitas peminjaman\n• Dan aktivitas lainnya\n\nSetiap log mencatat: siapa, apa yang dilakukan, kapan, dan detail perubahan." },
    ],
  },
  {
    title: "BAB 12: Pengaturan",
    sections: [
      { title: "Identitas Aplikasi", content: "⚙️ Akses: Admin only\n\nAtur nama aplikasi, subtitle, prefix kode inventaris, dan upload logo yang akan ditampilkan di sidebar dan halaman login." },
      { title: "Informasi Lembaga", content: "🏢 Akses: Admin only\n\nIsi data lembaga: nama instansi, alamat, kepala lab/pengelola, NIP, telepon, dan email. Data ini digunakan pada laporan PDF." },
      { title: "Pengaturan Lainnya", content: "🔒 Akses: Admin only\n\n• Kop/Header Laporan: teks yang muncul di header laporan export\n• Akses QR Code Publik: izinkan/blokir akses detail barang tanpa login via QR" },
    ],
  },
  {
    title: "BAB 13: Kelola Pengguna",
    sections: [
      { title: "Melihat Daftar Pengguna", content: "👥 Akses: Admin only\n\nBuka menu 'Pengguna' di sidebar untuk melihat semua pengguna terdaftar beserta role mereka." },
      { title: "Mengubah Role Pengguna", content: "🔄 Akses: Admin only\n\nPada halaman Pengguna, klik dropdown role untuk mengubah:\n• User → Admin: memberikan akses penuh\n• Admin → User: membatasi akses ke fitur dasar\n\nCatatan: Admin tidak bisa mengubah role diri sendiri." },
      { title: "Menghapus Pengguna", content: "🗑️ Akses: Admin only\n\nKlik tombol hapus pada pengguna yang ingin dihapus. Konfirmasi penghapusan akan muncul. Admin tidak bisa menghapus diri sendiri." },
    ],
  },
  {
    title: "BAB 14: Troubleshooting",
    sections: [
      { title: "QR Code tidak terbaca", content: "• Pastikan QR Code tidak rusak atau terlipat\n• Pastikan pencahayaan cukup\n• Coba scan dari jarak 10-20 cm\n• Gunakan aplikasi scanner QR bawaan HP" },
      { title: "Lupa Password", content: "Klik 'Lupa Password?' di halaman login, masukkan email, dan ikuti instruksi reset via email." },
      { title: "Data tidak muncul", content: "• Periksa koneksi internet\n• Refresh halaman browser\n• Clear cache browser\n• Hubungi admin jika masalah berlanjut" },
      { title: "Gagal upload foto/logo", content: "• Pastikan ukuran file tidak melebihi 2MB\n• Gunakan format PNG, JPG, atau SVG\n• Periksa koneksi internet" },
      { title: "Menu tidak muncul", content: "Beberapa menu hanya tersedia untuk Admin:\n• Tambah Barang, Import Excel\n• Kategori, Ruangan, Pengguna\n• Jadwal Maintenance (kelola)\n• Software (kelola)\n• Riwayat Aktivitas\n• Pengaturan\n\nHubungi Admin jika Anda memerlukan akses." },
      { title: "Notifikasi tidak muncul", content: "Notifikasi hanya muncul jika ada:\n• Jadwal maintenance yang sudah jatuh tempo\n• Peminjaman yang terlambat dikembalikan\n• Permintaan peminjaman baru (admin)\n• Pengembalian menunggu konfirmasi (admin)\n\nJika badge angka tidak muncul, berarti tidak ada notifikasi aktif." },
      { title: "Peminjaman tidak bisa diubah", content: "• User hanya bisa mengubah status peminjaman miliknya sendiri\n• User hanya bisa 'Kembalikan Barang' saat status 'Sedang Dipinjam'\n• Perubahan status lainnya hanya bisa dilakukan oleh Admin" },
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
