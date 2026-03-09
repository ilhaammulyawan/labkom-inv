import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useUserRole } from "@/hooks/useUserRole";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ConditionBadge, StatusBadge } from "@/components/ConditionBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, Eye, Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const InventoryList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");

  const { data: items = [], isLoading } = useItems();
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const { isAdmin } = useUserRole();
  const { settings } = useAppSettings();
  const { t } = useLanguage();

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getRoomName = (id: string | null) => rooms.find(r => r.id === id)?.name || 'Unknown';

  const handlePrintTable = () => {
    window.print();
  };

  const filtered = items.filter(item => {
    const matchSearch = search === "" || item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.inventory_code.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    const matchCondition = conditionFilter === "all" || item.condition === conditionFilter;
    const matchRoom = roomFilter === "all" || item.room_id === roomFilter;
    return matchSearch && matchCategory && matchCondition && matchRoom;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("inventoryTitle")}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} {t("itemsOf")} {items.length} {t("items")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintTable} disabled={filtered.length === 0}>
            <Printer className="mr-2 h-4 w-4" /> {t("print")}
          </Button>
          {isAdmin && (
            <Button onClick={() => navigate("/inventory/add")} className="gradient-primary text-primary-foreground border-0 shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> {t("addItemBtn")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger><SelectValue placeholder={t("category")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger><SelectValue placeholder={t("condition")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allConditions")}</SelectItem>
            <SelectItem value="Baik">{t("condGood")}</SelectItem>
            <SelectItem value="Rusak Ringan">{t("condLightDamage")}</SelectItem>
            <SelectItem value="Rusak Berat">{t("condHeavyDamage")}</SelectItem>
            <SelectItem value="Diperbaiki">{t("condRepaired")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger><SelectValue placeholder={t("room")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allRooms")}</SelectItem>
            {rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="kpi-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t("code")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t("itemName")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">{t("brand")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">{t("category")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">{t("room")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t("condition")}</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">{t("status")}</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary font-medium text-[11px]">{item.inventory_code}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-xs">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground lg:hidden">{getCategoryName(item.category_id)}</p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{item.brand}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{getCategoryName(item.category_id)}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{getRoomName(item.room_id)}</td>
                  <td className="py-3 px-4"><ConditionBadge condition={item.condition} /></td>
                  <td className="py-3 px-4 hidden sm:table-cell"><StatusBadge status={item.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/inventory/${item.id}`)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">{t("noItemsFound")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Hidden print content */}
       <div className="print-area" style={{display:'none'}}>
         <style>{`
           @media print {
             .print-area { display: block !important; font-family: 'Segoe UI', sans-serif; color: #111; }
             .print-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 2px solid #333; padding-bottom: 12px; }
             .print-logo { max-width: 80px; max-height: 80px; object-fit: contain; }
             .print-area h1 { font-size: 18px; margin: 0 0 4px; }
             .print-area .print-sub { color: #666; font-size: 12px; margin-bottom: 12px; }
             .print-area table { width: 100%; border-collapse: collapse; font-size: 11px; }
             .print-area th { background: #f0f0f0; text-align: left; padding: 6px 8px; font-weight: 600; border-bottom: 2px solid #ddd; }
             .print-area td { padding: 5px 8px; border-bottom: 1px solid #eee; }
             .print-area .mono { font-family: monospace; }
           }
         `}</style>
         <div className="print-header">
           {settings?.app_logo && <img className="print-logo" src={settings.app_logo} alt="Logo" />}
           <div>
             <h1>{t("inventoryListTitle")}</h1>
             <p className="print-sub">{t("total")}: {filtered.length} {t("items")} • {t("printedAt")}: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>
         </div>
        <table>
          <thead>
            <tr>
              <th>No</th><th>{t("code")}</th><th>{t("itemName")}</th><th>{t("brand")}</th><th>{t("category")}</th><th>{t("room")}</th><th>{t("condition")}</th><th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td className="mono">{item.inventory_code}</td>
                <td>{item.name}</td>
                <td>{item.brand}</td>
                <td>{getCategoryName(item.category_id)}</td>
                <td>{getRoomName(item.room_id)}</td>
                <td>{item.condition}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;
