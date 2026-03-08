import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Monitor, LogIn, Eye, EyeOff, UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await login(email, password);
    if (error) {
      toast.error("Login gagal", { description: error });
    } else {
      toast.success("Login berhasil!");
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setIsLoading(true);
    const { error } = await signup(email, password, fullName);
    if (error) {
      toast.error("Pendaftaran gagal", { description: error });
    } else {
      toast.success("Pendaftaran berhasil!", {
        description: "Silakan cek email Anda untuk verifikasi akun.",
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
      toast.error("Gagal mengirim email reset", { description: error });
    } else {
      toast.success("Email reset password terkirim!", {
        description: "Cek inbox email Anda.",
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
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mx-auto">
            <Monitor className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">SiiLaKu</h1>
          <p className="text-sm text-muted-foreground">Sistem Informasi Inventaris Laboratorium Komputer</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              {mode === "login" && "Masuk ke Akun"}
              {mode === "signup" && "Daftar Akun Baru"}
              {mode === "forgot" && "Reset Password"}
            </h2>
          </CardHeader>
          <CardContent>
            {/* LOGIN */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">Lupa password?</button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner /> : <><LogIn className="mr-2 h-4 w-4" /> Masuk</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Belum punya akun?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Daftar</button>
                </p>
              </form>
            )}

            {/* SIGNUP */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input id="fullName" placeholder="Nama lengkap Anda" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input id="signupEmail" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Input id="signupPassword" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner /> : <><UserPlus className="mr-2 h-4 w-4" /> Daftar</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Sudah punya akun?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">Masuk</button>
                </p>
              </form>
            )}

            {/* FORGOT PASSWORD */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-muted-foreground">Masukkan email Anda, kami akan mengirim link untuk reset password.</p>
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input id="resetEmail" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner /> : <><Mail className="mr-2 h-4 w-4" /> Kirim Link Reset</>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">Kembali ke login</button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Developed by <span className="font-semibold text-primary">Guru Informatika</span>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2">
      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      Memproses...
    </span>
  );
}
