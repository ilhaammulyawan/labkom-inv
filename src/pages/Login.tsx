import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Monitor, LogIn, Eye, EyeOff, UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useLanguage } from "@/contexts/LanguageContext";

type Mode = "login" | "signup" | "forgot";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { logoUrl, settings } = useAppSettings();
  const { t } = useLanguage();

  const appName = settings["app_name"] || "SiiLaKu";
  const appSubtitle = settings["app_subtitle"] || "Sistem Informasi Inventaris Laboratorium Komputer";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await login(email, password);
    if (error) {
      toast.error(t("loginFailed"), { description: error });
    } else {
      toast.success(t("loginSuccess"));
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t("passwordMin"));
      return;
    }
    setIsLoading(true);
    const { error } = await signup(email, password, fullName);
    if (error) {
      toast.error(t("signupFailed"), { description: error });
    } else {
      toast.success(t("signupSuccess"), {
        description: t("signupVerify"),
      });
      setMode("login");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      toast.error(t("resetEmailFailed"), { description: error });
    } else {
      toast.success(t("resetEmailSent"), {
        description: t("checkInbox"),
      });
      setMode("login");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          {logoUrl ? (
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl overflow-hidden mx-auto">
              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mx-auto">
              <Monitor className="h-8 w-8 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{appName}</h1>
          <p className="text-sm text-muted-foreground">{appSubtitle}</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              {mode === "login" && t("loginTitle")}
              {mode === "signup" && t("signupTitle")}
              {mode === "forgot" && t("resetPasswordTitle")}
            </h2>
          </CardHeader>
          <CardContent>
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("enterPassword")} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">{t("forgotPassword")}</button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner label={t("processing")} /> : <><LogIn className="mr-2 h-4 w-4" /> {t("login")}</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t("noAccount")}{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">{t("signup")}</button>
                </p>
              </form>
            )}

            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input id="fullName" placeholder={t("fullName")} value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">{t("email")}</Label>
                  <Input id="signupEmail" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">{t("password")}</Label>
                  <div className="relative">
                    <Input id="signupPassword" type={showPassword ? "text" : "password"} placeholder={t("minChars")} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner label={t("processing")} /> : <><UserPlus className="mr-2 h-4 w-4" /> {t("signup")}</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t("hasAccount")}{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">{t("login")}</button>
                </p>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-muted-foreground">{t("resetEmailDesc")}</p>
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">{t("email")}</Label>
                  <Input id="resetEmail" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner label={t("processing")} /> : <><Mail className="mr-2 h-4 w-4" /> {t("sendResetLink")}</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">{t("backToLogin")}</button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          {t("developedBy")} <span className="font-semibold text-primary">Guru Informatika</span>
        </p>
      </div>
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      {label}
    </span>
  );
}
