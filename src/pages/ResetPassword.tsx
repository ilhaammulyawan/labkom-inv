import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Monitor, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ResetPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setIsRecovery(true); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error(t("passwordMin")); return; }
    if (password !== confirmPassword) { toast.error(t("passwordMismatch")); return; }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(t("passwordChangeFailed"), { description: error.message }); }
    else { toast.success(t("passwordChanged")); navigate("/"); }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mx-auto"><Monitor className="h-8 w-8 text-primary-foreground" /></div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{t("resetPassword")}</h1>
          <p className="text-sm text-muted-foreground">{t("enterNewPassword")}</p>
        </div>
        <Card className="border-border shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("newPassword")}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder={t("minChars")} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("confirmPassword")}</Label>
                <Input type={showPassword ? "text" : "password"} placeholder={t("repeatPassword")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (<span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{t("processing")}</span>) : (<><Save className="mr-2 h-4 w-4" /> {t("saveNewPassword")}</>)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
