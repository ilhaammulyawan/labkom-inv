import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Monitor, LogIn, LayoutDashboard, Pencil, Plus, Trash2, Save,
  Package, Wrench, QrCode, ClipboardCheck, FileText, ShieldCheck,
  HandCoins, AppWindow, BookOpen, Sparkles, BarChart3, Users,
} from "lucide-react";
import { toast } from "sonner";

type Feature = { icon: string; title: string; desc: string };

const ICON_MAP: Record<string, any> = {
  Package, Wrench, QrCode, ClipboardCheck, FileText, ShieldCheck,
  HandCoins, AppWindow, BookOpen, Sparkles, BarChart3, Users, Monitor,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULTS = {
  hero_eyebrow: "Sistem Informasi Inventaris",
  hero_title: "Kelola Aset Lab Komputer dengan Mudah & Modern",
  hero_subtitle:
    "Pantau seluruh perangkat, perbaikan, peminjaman, dan stock opname dalam satu platform terintegrasi. Cepat, akurat, dan siap dipakai sekolah maupun institusi Anda.",
  hero_cta_primary: "Mulai Sekarang",
  hero_cta_secondary: "Pelajari Lebih Lanjut",
  stats_1_value: "100%",
  stats_1_label: "Digital Inventory",
  stats_2_value: "3",
  stats_2_label: "Bahasa Didukung",
  stats_3_value: "24/7",
  stats_3_label: "Akses Online",
  features_title: "Fitur Lengkap untuk Kebutuhan Anda",
  features_subtitle: "Semua yang Anda butuhkan untuk mengelola inventaris lab komputer.",
  features_json: JSON.stringify([
    { icon: "Package", title: "Manajemen Inventaris", desc: "Catat seluruh aset dengan detail spesifikasi, kondisi, dan lokasi." },
    { icon: "Wrench", title: "Perbaikan & Maintenance", desc: "Lacak riwayat perbaikan dan jadwal maintenance berkala." },
    { icon: "HandCoins", title: "Peminjaman Barang", desc: "Sistem peminjaman dengan approval dan pelacakan pengembalian." },
    { icon: "QrCode", title: "QR Code Barang", desc: "Cetak dan scan QR untuk akses cepat detail setiap aset." },
    { icon: "ClipboardCheck", title: "Stock Opname", desc: "Audit fisik berkala dengan laporan PDF & Excel profesional." },
    { icon: "FileText", title: "Laporan Otomatis", desc: "Export laporan inventaris, perbaikan, dan peminjaman dalam sekejap." },
  ]),
  about_title: "Dirancang untuk Lab Modern",
  about_body:
    "Aplikasi ini membantu pengelola laboratorium komputer mendokumentasikan, memantau, dan melaporkan kondisi seluruh aset secara real-time. Dilengkapi dukungan multi-bahasa (Indonesia, English, Arabic), tema gelap/terang, dan kontrol akses berbasis peran.",
  cta_title: "Siap Mengelola Lab Anda Lebih Baik?",
  cta_subtitle: "Masuk sekarang dan nikmati kemudahan mengelola seluruh aset dalam satu sistem.",
  cta_button: "Masuk ke Sistem",
  footer_text: "© 2026 SiiLaKu. Semua hak dilindungi.",
  footer_tagline: "Inventaris Lab Komputer · Modern · Aman · Multibahasa",
};

export default function Landing() {
  const { settings, logoUrl, updateSetting } = useAppSettings();
  const { isAdmin } = useUserRole();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const get = (k: keyof typeof DEFAULTS) => settings[`landing_${k}`] ?? DEFAULTS[k];

  const features: Feature[] = useMemo(() => {
    try {
      const raw = settings["landing_features_json"] ?? DEFAULTS.features_json;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return JSON.parse(DEFAULTS.features_json);
    }
  }, [settings]);

  const appName = settings["app_name"] || "SiiLaKu";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            {logoUrl ? (
              <img src={logoUrl} alt={appName} className="h-9 w-9 object-contain rounded-lg" />
            ) : (
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Monitor className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <span className="font-bold tracking-tight text-lg">{appName}</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && <EditDialog settings={settings} updateSetting={updateSetting} />}
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} size="sm">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/login")} size="sm">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl -z-10" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5 border border-primary/20">
            <Sparkles className="inline h-3 w-3 mr-1" /> {get("hero_eyebrow")}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            {get("hero_title")}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {get("hero_subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}>
              <LogIn className="h-4 w-4" /> {get("hero_cta_primary")}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">{get("hero_cta_secondary")}</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 md:p-6 bg-card/60 backdrop-blur border-border">
                <div className="text-2xl md:text-4xl font-extrabold text-primary">
                  {get(`stats_${i}_value` as any)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {get(`stats_${i}_label` as any)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{get("features_title")}</h2>
            <p className="mt-3 text-muted-foreground">{get("features_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = ICON_MAP[f.icon] ?? Package;
              return (
                <Card key={i} className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all border-border">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">{get("about_title")}</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
            {get("about_body")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Card className="p-8 md:p-12 text-center gradient-primary text-primary-foreground border-0 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">{get("cta_title")}</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">{get("cta_subtitle")}</p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            >
              <LogIn className="h-4 w-4" /> {get("cta_button")}
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center space-y-1">
          <p className="text-sm font-medium">{get("footer_text")}</p>
          <p className="text-xs text-muted-foreground">{get("footer_tagline")}</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------- Admin Edit Dialog ------------------- */

function EditDialog({
  settings,
  updateSetting,
}: {
  settings: Record<string, string>;
  updateSetting: ReturnType<typeof useAppSettings>["updateSetting"];
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<Feature[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]).forEach((k) => {
      next[k] = settings[`landing_${k}`] ?? DEFAULTS[k];
    });
    setForm(next);
    try {
      const raw = settings["landing_features_json"] ?? DEFAULTS.features_json;
      setFeatures(JSON.parse(raw));
    } catch {
      setFeatures(JSON.parse(DEFAULTS.features_json));
    }
  }, [open, settings]);

  const onField = (k: string) => (e: any) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const updateFeature = (idx: number, patch: Partial<Feature>) =>
    setFeatures((p) => p.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const addFeature = () =>
    setFeatures((p) => [...p, { icon: "Package", title: "Fitur Baru", desc: "Deskripsi singkat." }]);

  const removeFeature = (idx: number) => setFeatures((p) => p.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, features_json: JSON.stringify(features) };
      for (const [k, v] of Object.entries(payload)) {
        await updateSetting.mutateAsync({ key: `landing_${k}`, value: v });
      }
      toast.success("Landing page tersimpan");
      setOpen(false);
    } catch (e: any) {
      toast.error("Gagal menyimpan", { description: e.message });
    }
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="h-4 w-4" /> Edit Halaman
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Landing Page</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <Section title="Hero">
            <Field label="Eyebrow / Tag" value={form.hero_eyebrow} onChange={onField("hero_eyebrow")} />
            <Field label="Judul Utama" value={form.hero_title} onChange={onField("hero_title")} textarea />
            <Field label="Subjudul" value={form.hero_subtitle} onChange={onField("hero_subtitle")} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tombol Utama" value={form.hero_cta_primary} onChange={onField("hero_cta_primary")} />
              <Field label="Tombol Sekunder" value={form.hero_cta_secondary} onChange={onField("hero_cta_secondary")} />
            </div>
          </Section>

          <Section title="Statistik">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <Field label={`Nilai #${i}`} value={form[`stats_${i}_value`]} onChange={onField(`stats_${i}_value`)} />
                <Field label={`Label #${i}`} value={form[`stats_${i}_label`]} onChange={onField(`stats_${i}_label`)} />
              </div>
            ))}
          </Section>

          <Section title="Fitur">
            <Field label="Judul Section" value={form.features_title} onChange={onField("features_title")} />
            <Field label="Subjudul Section" value={form.features_subtitle} onChange={onField("features_subtitle")} textarea />
            <div className="space-y-3">
              {features.map((f, i) => (
                <Card key={i} className="p-3 space-y-2 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Fitur #{i + 1}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeFeature(i)} className="h-7 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Icon</Label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
                        value={f.icon}
                        onChange={(e) => updateFeature(i, { icon: e.target.value })}
                      >
                        {ICON_NAMES.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <Field label="Judul" value={f.title} onChange={(e: any) => updateFeature(i, { title: e.target.value })} />
                  </div>
                  <Field label="Deskripsi" value={f.desc} onChange={(e: any) => updateFeature(i, { desc: e.target.value })} textarea />
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={addFeature} className="w-full">
                <Plus className="h-4 w-4" /> Tambah Fitur
              </Button>
            </div>
          </Section>

          <Section title="Tentang">
            <Field label="Judul" value={form.about_title} onChange={onField("about_title")} />
            <Field label="Isi" value={form.about_body} onChange={onField("about_body")} textarea rows={5} />
          </Section>

          <Section title="CTA Banner">
            <Field label="Judul" value={form.cta_title} onChange={onField("cta_title")} />
            <Field label="Subjudul" value={form.cta_subtitle} onChange={onField("cta_subtitle")} textarea />
            <Field label="Teks Tombol" value={form.cta_button} onChange={onField("cta_button")} />
          </Section>

          <Section title="Footer">
            <Field label="Teks Footer" value={form.footer_text} onChange={onField("footer_text")} />
            <Field label="Tagline" value={form.footer_tagline} onChange={onField("footer_tagline")} />
          </Section>
        </div>

        <SheetFooter className="mt-6 sticky bottom-0 bg-background pt-3 pb-1 border-t">
          <Button onClick={save} disabled={saving} className="w-full">
            <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label, value, onChange, textarea, rows,
}: { label: string; value: string; onChange: any; textarea?: boolean; rows?: number }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {textarea ? (
        <Textarea value={value ?? ""} onChange={onChange} rows={rows ?? 3} />
      ) : (
        <Input value={value ?? ""} onChange={onChange} />
      )}
    </div>
  );
}
