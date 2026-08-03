import { useState } from "react";
import {
  LayoutDashboard, Package, PlusCircle, Wrench, FileText, QrCode,
  BookOpen, Settings, Monitor, LogOut, Tag, MapPin, FileSpreadsheet, Users,
  CalendarClock, AppWindow, HandCoins, History, ClipboardCheck, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import type { TranslationKeys } from "@/i18n";

type NavItem = { titleKey: TranslationKeys; url: string; icon: any; adminOnly: boolean };
type NavGroup = { labelKey: TranslationKeys; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    labelKey: "mainMenu",
    items: [
      { titleKey: "dashboard", url: "/dashboard", icon: LayoutDashboard, adminOnly: false },
    ],
  },
  {
    labelKey: "groupAssets",
    items: [
      { titleKey: "inventory", url: "/inventory", icon: Package, adminOnly: false },
      { titleKey: "addItem", url: "/inventory/add", icon: PlusCircle, adminOnly: true },
      { titleKey: "importExcel", url: "/inventory/import", icon: FileSpreadsheet, adminOnly: true },
      { titleKey: "softwareInventory", url: "/software", icon: AppWindow, adminOnly: false },
    ],
  },
  {
    labelKey: "groupOperations",
    items: [
      { titleKey: "maintenance", url: "/maintenance", icon: Wrench, adminOnly: false },
      { titleKey: "maintenanceSchedule", url: "/maintenance/schedule", icon: CalendarClock, adminOnly: false },
      { titleKey: "borrowings", url: "/borrowings", icon: HandCoins, adminOnly: false },
      { titleKey: "stockOpname", url: "/stock-opname", icon: ClipboardCheck, adminOnly: false },
    ],
  },
  {
    labelKey: "groupTools",
    items: [
      { titleKey: "scanQR", url: "/scan-qr", icon: QrCode, adminOnly: false },
      { titleKey: "printQR", url: "/qr-print", icon: QrCode, adminOnly: false },
      { titleKey: "reports", url: "/reports", icon: FileText, adminOnly: false },
      { titleKey: "activityLog", url: "/activity-log", icon: History, adminOnly: true },
    ],
  },
  {
    labelKey: "groupMaster",
    items: [
      { titleKey: "categories", url: "/categories", icon: Tag, adminOnly: true },
      { titleKey: "rooms", url: "/rooms", icon: MapPin, adminOnly: true },
      { titleKey: "users", url: "/users", icon: Users, adminOnly: true },
      { titleKey: "settings", url: "/settings", icon: Settings, adminOnly: true },
    ],
  },
  {
    labelKey: "groupOther",
    items: [
      { titleKey: "guide", url: "/guide", icon: BookOpen, adminOnly: false },
    ],
  },
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

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const groups = navGroups
    .map(g => ({ ...g, items: g.items.filter(i => !i.adminOnly || isAdmin) }))
    .filter(g => g.items.length > 0);

  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3 md:p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="rounded-lg h-8 w-8 md:h-9 md:w-9 overflow-hidden flex items-center justify-center shrink-0">
              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="gradient-primary rounded-lg p-2 flex items-center justify-center shrink-0">
              <Monitor className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight truncate">{appName}</h1>
              <p className="text-[10px] text-sidebar-foreground leading-tight truncate">{appSubtitle}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-1 gap-0">
        {groups.map((group) => {
          const hasActive = group.items.some(i => isActive(i.url));
          const isOpen = collapsed ? true : !closed[group.labelKey] || hasActive;

          const menu = (
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={t(item.titleKey)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          );

          if (collapsed) {
            return (
              <SidebarGroup key={group.labelKey} className="py-1">
                <SidebarGroupContent>{menu}</SidebarGroupContent>
              </SidebarGroup>
            );
          }

          return (
            <Collapsible
              key={group.labelKey}
              open={isOpen}
              onOpenChange={(open) => setClosed(prev => ({ ...prev, [group.labelKey]: !open }))}
            >
              <SidebarGroup className="py-1">
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 cursor-pointer hover:text-sidebar-foreground/80 flex items-center justify-between">
                    <span className="truncate">{t(group.labelKey)}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !isOpen && "-rotate-90")} />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>{menu}</SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-2 md:p-3 border-t border-sidebar-border space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                handleNavClick();
                logout();
              }}
              tooltip={t("logout")}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t("logout")}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="text-[10px] text-sidebar-foreground/40 text-center truncate">
            Login: <span className="font-semibold">{username}</span> · {appName} v1.0 © 2026
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
