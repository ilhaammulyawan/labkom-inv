import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center font-bold">3</span>
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold leading-tight">Admin Lab</p>
                  <p className="text-[10px] text-muted-foreground">Super Admin</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="h-8 flex items-center justify-center border-t border-border bg-card shrink-0">
            <p className="text-[10px] text-muted-foreground">
              Developed by <span className="font-semibold text-primary">Guru Informatika</span>
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
