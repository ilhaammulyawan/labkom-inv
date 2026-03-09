import {
  LayoutDashboard, Package, PlusCircle, Wrench, FileText, QrCode,
  BookOpen, Settings, Monitor, LogOut, Tag, MapPin, FileSpreadsheet, Users,
  CalendarClock, AppWindow, HandCoins, History,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

// Define nav items with admin flag
const allNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, adminOnly: false },
  { title: "Inventaris", url: "/inventory", icon: Package, adminOnly: false },
  { title: "Tambah Barang", url: "/inventory/add", icon: PlusCircle, adminOnly: true },
  { title: "Import Excel", url: "/inventory/import", icon: FileSpreadsheet, adminOnly: true },
  { title: "Perbaikan", url: "/maintenance", icon: Wrench, adminOnly: false },
  { title: "Jadwal Maintenance", url: "/maintenance/schedule", icon: CalendarClock, adminOnly: false },
  { title: "Software Inventory", url: "/software", icon: AppWindow, adminOnly: false },
  { title: "Peminjaman", url: "/borrowings", icon: HandCoins, adminOnly: false },
  { title: "Scan QR", url: "/scan-qr", icon: QrCode, adminOnly: false },
  { title: "Cetak QR", url: "/qr-print", icon: QrCode, adminOnly: false },
  { title: "Laporan", url: "/reports", icon: FileText, adminOnly: false },
  { title: "Riwayat", url: "/activity-log", icon: History, adminOnly: true },
  { title: "Kategori", url: "/categories", icon: Tag, adminOnly: true },
  { title: "Ruangan", url: "/rooms", icon: MapPin, adminOnly: true },
  { title: "Pengguna", url: "/users", icon: Users, adminOnly: true },
  { title: "Buku Panduan", url: "/guide", icon: BookOpen, adminOnly: false },
  { title: "Pengaturan", url: "/settings", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const location = useLocation();
  const { logout, username } = useAuth();
  const { isAdmin } = useUserRole();
  const { logoUrl, settings } = useAppSettings();
  const appName = settings["app_name"] || "SiiLaKu";
  const appSubtitle = settings["app_subtitle"] || "Inventaris Lab Komputer";

  // Filter nav items based on role
  const mainNav = allNavItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="rounded-lg h-9 w-9 overflow-hidden flex items-center justify-center shrink-0">
              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="gradient-primary rounded-lg p-2 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">{appName}</h1>
              <p className="text-[10px] text-sidebar-foreground leading-tight">{appSubtitle}</p>
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
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                      onClick={handleNavClick}
                    >
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
            <SidebarMenuButton 
              onClick={() => {
                handleNavClick();
                logout();
              }} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Keluar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="text-[10px] text-sidebar-foreground/40 text-center">
            Login: <span className="font-semibold">{username}</span> · {appName} v1.0 © 2026
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
