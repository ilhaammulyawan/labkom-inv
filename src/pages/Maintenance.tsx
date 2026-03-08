import { useState } from "react";
import { items, maintenanceRecords, getItemById, formatCurrency } from "@/lib/mock-data";
import { MaintenanceBadge } from "@/components/ConditionBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, PlusCircle } from "lucide-react";

const Maintenance = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = maintenanceRecords.filter(m => statusFilter === "all" || m.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Wrench className="h-6 w-6" /> Perbaikan & Maintenance</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} catatan perbaikan</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0 shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" /> Catat Perbaikan
        </Button>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Filter status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="Antrian">Antrian</SelectItem>
          <SelectItem value="Dalam Perbaikan">Dalam Perbaikan</SelectItem>
          <SelectItem value="Selesai">Selesai</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4">
        {filtered.map(m => {
          const item = getItemById(m.item_id);
          return (
            <div key={m.id} className="kpi-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item?.name || 'Unknown'}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{item?.inventory_code}</p>
                </div>
                <MaintenanceBadge status={m.status} />
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-muted-foreground">Tanggal Kerusakan:</span> {m.issue_date}</p>
                <p><span className="text-muted-foreground">Masalah:</span> {m.description}</p>
                {m.repair_date && <p><span className="text-muted-foreground">Tanggal Perbaikan:</span> {m.repair_date}</p>}
                {m.action && <p><span className="text-muted-foreground">Tindakan:</span> {m.action}</p>}
                {m.cost && <p><span className="text-muted-foreground">Biaya:</span> {formatCurrency(m.cost)}</p>}
                <p><span className="text-muted-foreground">Teknisi:</span> {m.technician}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Tidak ada catatan perbaikan</p>}
      </div>
    </div>
  );
};

export default Maintenance;
