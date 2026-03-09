import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { User, LogOut, Settings } from "lucide-react";
import { NotificationPopover } from "@/components/NotificationPopover";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { ProfileDialog } from "@/components/ProfileDialog";
import { useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, username } = useAuth();
  const { data: profile } = useProfile();
  const { isAdmin } = useUserRole();
  const { t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const displayName = profile?.full_name || username || "User";
  const initials = displayName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 md:h-14 flex items-center justify-between border-b border-border bg-card px-2 md:px-4 shrink-0">
            <div className="flex items-center gap-1 md:gap-2">
              <SidebarTrigger className="h-8 w-8 md:h-9 md:w-9" />
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <NotificationPopover />
              <div className="pl-1 md:pl-2 border-l border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 md:gap-2 rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 hover:bg-muted/50 transition-colors outline-none">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="text-[10px] md:text-xs font-bold bg-primary text-primary-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left max-w-[120px] md:max-w-none">
                        <p className="text-xs font-semibold leading-tight truncate">{displayName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                       <User className="mr-2 h-4 w-4" /> {t("editProfile")}
                     </DropdownMenuItem>
                     {isAdmin && (
                       <>
                         <DropdownMenuItem onClick={() => navigate("/settings")}>
                           <Settings className="mr-2 h-4 w-4" /> {t("settings")}
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                       </>
                     )}
                     <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                       <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 md:p-6">
            {children}
          </main>
          <footer className="h-7 md:h-8 flex items-center justify-center border-t border-border bg-card shrink-0 px-2">
            <p className="text-[9px] md:text-[10px] text-muted-foreground text-center">
              Developed by <span className="font-semibold text-primary">Guru Informatika</span>
            </p>
          </footer>
        </div>
      </div>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </SidebarProvider>
  );
}
