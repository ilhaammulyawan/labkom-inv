import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useUserRole } from "@/hooks/useUserRole";
import { ConditionBadge, StatusBadge } from "@/components/ConditionBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, Eye, Printer } from "lucide-react";
import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getRoomName = (id: string | null) => rooms.find(r => r.id === id)?.name || 'Unknown';

  const handlePrintTable = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Daftar Inventaris</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1a1a2e; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .sub { color: #666; font-size: 13px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f0f0f0; text-align: left; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #ddd; }
        td { padding: 6px 10px; border-bottom: 1px solid #eee; }
        tr:hover { background: #fafafa; }
        .mono { font-family: monospace; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <h1>Daftar Inventaris Barang</h1>
      <p class="sub">Total: ${filtered.length} barang • Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <table>
        <thead><tr>
          <th>No</th><th>Kode</th><th>Nama Barang</th><th>Merk</th><th>Kategori</th><th>Ruangan</th><th>Kondisi</th><th>Status</th>
        </tr></thead>
        <tbody>
          ${filtered.map((item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td class="mono">${item.inventory_code}</td>
              <td>${item.name}</td>
              <td>${item.brand}</td>
              <td>${getCategoryName(item.category_id)}</td>
              <td>${getRoomName(item.room_id)}</td>
              <td>${item.condition}</td>
              <td>${item.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
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
          <h1 className="text-2xl font-bold tracking-tight">Inventaris</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} dari {items.length} barang</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate("/inventory/add")} className="gradient-primary text-primary-foreground border-0 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Barang
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama, kode, merk..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger><SelectValue placeholder="Kondisi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kondisi</SelectItem>
            <SelectItem value="Baik">Baik</SelectItem>
            <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
            <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
            <SelectItem value="Diperbaiki">Diperbaiki</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger><SelectValue placeholder="Ruangan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Ruangan</SelectItem>
            {rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="kpi-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Kode</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Barang</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Merk</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">Ruangan</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Kondisi</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Aksi</th>
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
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">Tidak ada barang ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
