import { ItemCondition, ItemStatus, MaintenanceStatus } from "@/lib/mock-data";

const conditionStyles: Record<ItemCondition, string> = {
  'Baik': 'bg-success/10 text-success border-success/20',
  'Rusak Ringan': 'bg-warning/10 text-warning border-warning/20',
  'Rusak Berat': 'bg-destructive/10 text-destructive border-destructive/20',
  'Diperbaiki': 'bg-info/10 text-info border-info/20',
};

const statusStyles: Record<ItemStatus, string> = {
  'Aktif': 'bg-success/10 text-success border-success/20',
  'Dipinjam': 'bg-warning/10 text-warning border-warning/20',
  'Dihapus': 'bg-destructive/10 text-destructive border-destructive/20',
};

const maintenanceStyles: Record<MaintenanceStatus, string> = {
  'Antrian': 'bg-warning/10 text-warning border-warning/20',
  'Dalam Perbaikan': 'bg-info/10 text-info border-info/20',
  'Selesai': 'bg-success/10 text-success border-success/20',
};

export function ConditionBadge({ condition }: { condition: ItemCondition }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${conditionStyles[condition]}`}>{condition}</span>;
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>{status}</span>;
}

export function MaintenanceBadge({ status }: { status: MaintenanceStatus }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${maintenanceStyles[status]}`}>{status}</span>;
}
