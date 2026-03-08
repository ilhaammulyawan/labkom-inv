import { Monitor, Laptop, Printer, Server, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { ConditionBadge, StatusBadge } from "@/components/ConditionBadge";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useMaintenanceRecords } from "@/hooks/useMaintenance";
import { formatCurrency } from "@/lib/mock-data";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = ['hsl(217,91%,60%)', 'hsl(160,84%,39%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(199,89%,48%)', 'hsl(280,65%,60%)', 'hsl(340,75%,55%)', 'hsl(30,80%,55%)'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: items = [], isLoading: loadingItems } = useItems();
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const { data: maintenanceRecords = [] } = useMaintenanceRecords();

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getRoomName = (id: string | null) => rooms.find(r => r.id === id)?.name || 'Unknown';

  if (loadingItems) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Find category IDs by name
  const pcCatId = categories.find(c => c.name === 'Komputer/PC')?.id;
  const laptopCatId = categories.find(c => c.name === 'Laptop')?.id;
  const monitorCatId = categories.find(c => c.name === 'Monitor')?.id;
  const printerCatId = categories.find(c => c.name === 'Printer/Scanner')?.id;

  const totalPC = items.filter(i => i.category_id === pcCatId).length;
  const totalLaptop = items.filter(i => i.category_id === laptopCatId).length;
  const totalMonitor = items.filter(i => i.category_id === monitorCatId).length;
  const totalPrinter = items.filter(i => i.category_id === printerCatId).length;
  const totalBaik = items.filter(i => i.condition === 'Baik').length;
  const totalRusak = items.filter(i => i.condition === 'Rusak Ringan' || i.condition === 'Rusak Berat').length;
  const totalAsset = items.reduce((sum, i) => sum + (i.price || 0), 0);

  const categoryData = categories.map(c => ({
    name: c.name,
    value: items.filter(i => i.category_id === c.id).length,
  })).filter(d => d.value > 0);

  const conditionData = [
    { name: 'Baik', value: items.filter(i => i.condition === 'Baik').length },
    { name: 'Rusak Ringan', value: items.filter(i => i.condition === 'Rusak Ringan').length },
    { name: 'Rusak Berat', value: items.filter(i => i.condition === 'Rusak Berat').length },
    { name: 'Diperbaiki', value: items.filter(i => i.condition === 'Diperbaiki').length },
  ].filter(d => d.value > 0);

  const roomData = rooms.map(r => ({
    name: r.name.replace('Lab Komputer ', 'Lab '),
    value: items.filter(i => i.room_id === r.id).length,
  })).filter(d => d.value > 0);

  const recentItems = [...items].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan inventaris laboratorium komputer</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total PC/Desktop" value={totalPC} icon={Monitor} gradient="gradient-primary" />
        <KpiCard title="Total Laptop" value={totalLaptop} icon={Laptop} gradient="gradient-primary" />
        <KpiCard title="Kondisi Baik" value={totalBaik} icon={CheckCircle} gradient="gradient-success" />
        <KpiCard title="Perlu Perhatian" value={totalRusak} icon={AlertTriangle} gradient="gradient-danger" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Monitor" value={totalMonitor} icon={Monitor} gradient="gradient-primary" />
        <KpiCard title="Total Printer" value={totalPrinter} icon={Printer} gradient="gradient-warning" />
        <KpiCard title="Total Nilai Aset" value={formatCurrency(totalAsset)} icon={Package} gradient="gradient-success" subtitle={`${items.length} item`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="kpi-card">
          <h3 className="text-sm font-semibold mb-4">Komposisi per Kategori</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={2} label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="kpi-card">
          <h3 className="text-sm font-semibold mb-4">Kondisi Barang</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conditionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {conditionData.map((entry, i) => {
                  const colors: Record<string, string> = { 'Baik': 'hsl(160,84%,39%)', 'Rusak Ringan': 'hsl(38,92%,50%)', 'Rusak Berat': 'hsl(0,84%,60%)', 'Diperbaiki': 'hsl(199,89%,48%)' };
                  return <Cell key={i} fill={colors[entry.name] || CHART_COLORS[0]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="kpi-card">
          <h3 className="text-sm font-semibold mb-4">Sebaran per Ruangan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="kpi-card">
          <h3 className="text-sm font-semibold mb-4">Perbaikan Terkini</h3>
          <div className="space-y-3">
            {maintenanceRecords.slice(0, 5).map(m => {
              const item = items.find(i => i.id === m.item_id);
              return (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="shrink-0 mt-0.5">
                    <div className={`h-2 w-2 rounded-full ${m.status === 'Selesai' ? 'bg-success' : m.status === 'Dalam Perbaikan' ? 'bg-info' : 'bg-warning'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{item?.name || 'Unknown'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{m.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{m.issue_date} • {m.technician}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${m.status === 'Selesai' ? 'bg-success/10 text-success' : m.status === 'Dalam Perbaikan' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>
                    {m.status}
                  </span>
                </div>
              );
            })}
            {maintenanceRecords.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Belum ada catatan perbaikan</p>}
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <h3 className="text-sm font-semibold mb-4">Barang Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Kode</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden sm:table-cell">Kategori</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden md:table-cell">Ruangan</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Kondisi</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map(item => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/inventory/${item.id}`)}>
                  <td className="py-2.5 px-3 font-mono text-primary font-medium">{item.inventory_code}</td>
                  <td className="py-2.5 px-3 font-medium">{item.name}</td>
                  <td className="py-2.5 px-3 hidden sm:table-cell text-muted-foreground">{getCategoryName(item.category_id)}</td>
                  <td className="py-2.5 px-3 hidden md:table-cell text-muted-foreground">{getRoomName(item.room_id)}</td>
                  <td className="py-2.5 px-3"><ConditionBadge condition={item.condition} /></td>
                  <td className="py-2.5 px-3"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
