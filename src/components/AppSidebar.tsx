import {
  LayoutDashboard, Package, PlusCircle, Wrench, FileText, QrCode,
  BookOpen, Settings, Monitor, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventaris", url: "/inventory", icon: Package },
  { title: "Tambah Barang", url: "/inventory/add", icon: PlusCircle },
  { title: "Perbaikan", url: "/maintenance", icon: Wrench },
  { title: "Scan QR", url: "/scan-qr", icon: QrCode },
  { title: "Cetak QR", url: "/qr-print", icon: QrCode },
  { title: "Laporan", url: "/reports", icon: FileText },
  { title: "Buku Panduan", url: "/guide", icon: BookOpen },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { logout, username } = useAuth();
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="gradient-primary rounded-lg p-2 flex items-center justify-center">
            <Monitor className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">SiiLaKu</h1>
              <p className="text-[10px] text-sidebar-foreground leading-tight">Inventaris Lab Komputer</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 px-4">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Keluar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="text-[10px] text-sidebar-foreground/40 text-center">
            Login: <span className="font-semibold">{username}</span> · SiiLaKu v1.0 © 2026
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
