import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile, uploadAvatar } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ProfileDialogProps { open: boolean; onOpenChange: (open: boolean) => void; }

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { if (profile) { setFullName(profile.full_name || ""); setAvatarPreview(profile.avatar_url || null); } }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error(`${t("maxFileSize")} 2MB`); return; }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let avatarUrl = profile?.avatar_url || undefined;
      if (avatarFile) { avatarUrl = await uploadAvatar(user.id, avatarFile); setAvatarFile(null); }
      await updateProfile.mutateAsync({ full_name: fullName, avatar_url: avatarUrl });
      toast.success(t("profileUpdated"));
      onOpenChange(false);
    } catch (err: any) { toast.error(t("profileFailed"), { description: err.message }); }
    setIsSaving(false);
  };

  const initials = (fullName || user?.email || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{t("editProfile")}</DialogTitle></DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24"><AvatarImage src={avatarPreview || undefined} alt="Avatar" /><AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback></Avatar>
              <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors"><Camera className="h-4 w-4" /><input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} /></label>
            </div>
            <p className="text-[10px] text-muted-foreground">{t("clickCameraToChange")}</p>
          </div>
          <div className="space-y-2"><Label className="text-xs">{t("fullName")}</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t("enterFullName")} /></div>
          <div className="space-y-2"><Label className="text-xs">{t("email")}</Label><Input value={user?.email || ""} disabled className="opacity-60" /><p className="text-[10px] text-muted-foreground">{t("emailCannotChange")}</p></div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gradient-primary text-primary-foreground border-0"><Save className="mr-2 h-4 w-4" /> {isSaving ? t("saving") : t("save")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
