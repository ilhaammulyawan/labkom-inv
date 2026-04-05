import {
  LayoutDashboard, Package, PlusCircle, Wrench, FileText, QrCode,
  BookOpen, Settings, Monitor, LogOut, Tag, MapPin, FileSpreadsheet, Users,
  CalendarClock, AppWindow, HandCoins, History, ClipboardCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import type { TranslationKeys } from "@/i18n";

// Define nav items with admin flag and translation key
const allNavItems: { titleKey: TranslationKeys; url: string; icon: any; adminOnly: boolean }[] = [
  { titleKey: "dashboard", url: "/", icon: LayoutDashboard, adminOnly: false },
  { titleKey: "inventory", url: "/inventory", icon: Package, adminOnly: false },
  { titleKey: "addItem", url: "/inventory/add", icon: PlusCircle, adminOnly: true },
  { titleKey: "importExcel", url: "/inventory/import", icon: FileSpreadsheet, adminOnly: true },
  { titleKey: "maintenance", url: "/maintenance", icon: Wrench, adminOnly: false },
  { titleKey: "maintenanceSchedule", url: "/maintenance/schedule", icon: CalendarClock, adminOnly: false },
  { titleKey: "softwareInventory", url: "/software", icon: AppWindow, adminOnly: false },
  { titleKey: "borrowings", url: "/borrowings", icon: HandCoins, adminOnly: false },
  { titleKey: "scanQR", url: "/scan-qr", icon: QrCode, adminOnly: false },
  { titleKey: "printQR", url: "/qr-print", icon: QrCode, adminOnly: false },
  { titleKey: "reports", url: "/reports", icon: FileText, adminOnly: false },
  { titleKey: "activityLog", url: "/activity-log", icon: History, adminOnly: true },
  { titleKey: "categories", url: "/categories", icon: Tag, adminOnly: true },
  { titleKey: "rooms", url: "/rooms", icon: MapPin, adminOnly: true },
  { titleKey: "users", url: "/users", icon: Users, adminOnly: true },
  { titleKey: "guide", url: "/guide", icon: BookOpen, adminOnly: false },
  { titleKey: "settings", url: "/settings", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const location = useLocation();
  const { logout, username } = useAuth();
  const { isAdmin } = useUserRole();
  const { logoUrl, settings } = useAppSettings();
  const { t } = useLanguage();
  const appName = settings["app_name"] || "SiiLaKu";
  const appSubtitle = settings["app_subtitle"] || "Inventaris Lab Komputer";

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
            {t("mainMenu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
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
              {!collapsed && <span>{t("logout")}</span>}
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
