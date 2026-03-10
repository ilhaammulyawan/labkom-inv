import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Upload, Save, Building, Palette, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppSettings, uploadAppLogo } from "@/hooks/useAppSettings";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";

const SettingsPage = () => {
  const { t } = useLanguage();
  const { settings, logoUrl, updateSetting } = useAppSettings();
  const { isAdmin } = useUserRole();
  const [appName, setAppName] = useState("SiiLaKu");
  const [appSubtitle, setAppSubtitle] = useState("Sistem Informasi Inventaris Laboratorium Komputer");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionAddress, setInstitutionAddress] = useState("");
  const [labManager, setLabManager] = useState("");
  const [labManagerNip, setLabManagerNip] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalNip, setPrincipalNip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [reportHeader, setReportHeader] = useState("");
  const [inventoryPrefix, setInventoryPrefix] = useState("INV");
  const [qrPublicAccess, setQrPublicAccess] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings["app_name"]) setAppName(settings["app_name"]);
    if (settings["app_subtitle"]) setAppSubtitle(settings["app_subtitle"]);
    if (settings["institution_name"]) setInstitutionName(settings["institution_name"]);
    if (settings["institution_address"]) setInstitutionAddress(settings["institution_address"]);
    if (settings["lab_manager"]) setLabManager(settings["lab_manager"]);
    if (settings["lab_manager_nip"]) setLabManagerNip(settings["lab_manager_nip"]);
    if (settings["principal_name"]) setPrincipalName(settings["principal_name"]);
    if (settings["principal_nip"]) setPrincipalNip(settings["principal_nip"]);
    if (settings["phone"]) setPhone(settings["phone"]);
    if (settings["email"]) setEmail(settings["email"]);
    if (settings["report_header"]) setReportHeader(settings["report_header"]);
    if (settings["inventory_prefix"]) setInventoryPrefix(settings["inventory_prefix"]);
    if (settings["qr_public_access"]) setQrPublicAccess(settings["qr_public_access"] === "true");
    if (logoUrl) setLogoPreview(logoUrl);
  }, [settings, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error(`${t("maxFileSize")} 2MB`); return; }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => { setLogoPreview(null); setLogoFile(null); };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalLogoUrl = logoUrl;
      if (logoFile) { finalLogoUrl = await uploadAppLogo(logoFile); setLogoFile(null); }
      if (!logoPreview && logoUrl) { finalLogoUrl = ""; }
      const pairs: Record<string, string> = { app_name: appName, app_subtitle: appSubtitle, institution_name: institutionName, institution_address: institutionAddress, lab_manager: labManager, lab_manager_nip: labManagerNip, principal_name: principalName, principal_nip: principalNip, phone, email, report_header: reportHeader, inventory_prefix: inventoryPrefix, qr_public_access: String(qrPublicAccess), app_logo: finalLogoUrl || "" };
      for (const [key, value] of Object.entries(pairs)) { await updateSetting.mutateAsync({ key, value }); }
      toast.success(t("settingsSaved"));
    } catch (err: any) { toast.error(t("settingsFailed"), { description: err.message }); }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><SettingsIcon className="h-6 w-6" /> {t("settings")}</h1>
        <p className="text-sm text-muted-foreground">{t("settingsSubtitle")}</p>
      </div>

      <div className="kpi-card space-y-5">
        <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">{t("appIdentity")}</h3></div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">{t("appName")}</Label><Input value={appName} onChange={e => setAppName(e.target.value)} placeholder="SiiLaKu" /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("inventoryCodePrefix")}</Label><Input value={inventoryPrefix} onChange={e => setInventoryPrefix(e.target.value)} placeholder="INV" /><p className="text-[10px] text-muted-foreground">ex: {inventoryPrefix}-PC-001</p></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">{t("subtitleDesc")}</Label><Input value={appSubtitle} onChange={e => setAppSubtitle(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t("appLogo")}</Label>
          <p className="text-[10px] text-muted-foreground">{t("logoDisplayedAt")}</p>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden shrink-0">
              {logoPreview ? (<div className="relative h-full w-full"><img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-1" /><button onClick={handleRemoveLogo} className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="h-3 w-3" /></button></div>) : (<Upload className="h-6 w-6 text-muted-foreground/50" />)}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /><div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 transition-colors"><Upload className="h-3.5 w-3.5" /> {t("selectLogo")}</div></label>
              <p className="text-[10px] text-muted-foreground mt-1.5">{t("logoFormat")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-card space-y-5">
        <div className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">{t("institutionInfo")}</h3></div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">{t("institutionName")}</Label><Input value={institutionName} onChange={e => setInstitutionName(e.target.value)} placeholder={t("institutionPlaceholder")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">{t("institutionAddress")}</Label><Textarea value={institutionAddress} onChange={e => setInstitutionAddress(e.target.value)} placeholder={t("addressPlaceholder")} rows={2} /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("labManagerName")}</Label><Input value={labManager} onChange={e => setLabManager(e.target.value)} placeholder={t("labManagerPlaceholder")} /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("labManagerNip")}</Label><Input value={labManagerNip} onChange={e => setLabManagerNip(e.target.value)} placeholder={t("nipPlaceholder")} /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("principalName")}</Label><Input value={principalName} onChange={e => setPrincipalName(e.target.value)} placeholder={t("labManagerPlaceholder")} /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("principalNip")}</Label><Input value={principalNip} onChange={e => setPrincipalNip(e.target.value)} placeholder={t("nipPlaceholder")} /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("phone")}</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="021-12345678" /></div>
          <div className="space-y-1.5"><Label className="text-xs">{t("email")}</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="lab@sekolah.sch.id" type="email" /></div>
        </div>
      </div>

      <div className="kpi-card space-y-5">
        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">{t("otherSettings")}</h3></div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-1.5"><Label className="text-xs">{t("reportHeader")}</Label><Textarea value={reportHeader} onChange={e => setReportHeader(e.target.value)} placeholder={t("reportHeaderDesc")} rows={3} /><p className="text-[10px] text-muted-foreground">{t("reportHeaderDisplayed")}</p></div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div><p className="text-xs font-medium">{t("qrPublicAccess")}</p><p className="text-[10px] text-muted-foreground">{t("qrPublicAccessDesc")}</p></div>
            <button onClick={() => setQrPublicAccess(!qrPublicAccess)} className={`relative h-6 w-11 rounded-full transition-colors ${qrPublicAccess ? 'bg-primary' : 'bg-muted-foreground/30'}`}><span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-primary-foreground transition-transform shadow-sm ${qrPublicAccess ? 'translate-x-5' : ''}`} /></button>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="outline">{t("reset")}</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gradient-primary text-primary-foreground border-0"><Save className="mr-2 h-4 w-4" /> {isSaving ? t("saving") : t("saveSettings")}</Button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
