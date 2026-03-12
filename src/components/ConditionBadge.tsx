import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKeys } from "@/i18n";

type ItemCondition = "Baik" | "Rusak Ringan" | "Rusak Berat" | "Diperbaiki";
type ItemStatus = "Aktif" | "Dipinjam" | "Dihapus";
type MaintenanceStatus = "Antrian" | "Dalam Perbaikan" | "Selesai";

const conditionStyles: Record<ItemCondition, string> = {
  'Baik': 'bg-success/10 text-success border-success/20',
  'Rusak Ringan': 'bg-warning/10 text-warning border-warning/20',
  'Rusak Berat': 'bg-destructive/10 text-destructive border-destructive/20',
  'Diperbaiki': 'bg-info/10 text-info border-info/20',
};

const conditionKeys: Record<ItemCondition, TranslationKeys> = {
  'Baik': 'condGood',
  'Rusak Ringan': 'condLightDamage',
  'Rusak Berat': 'condHeavyDamage',
  'Diperbaiki': 'condRepaired',
};

const statusStyles: Record<ItemStatus, string> = {
  'Aktif': 'bg-success/10 text-success border-success/20',
  'Dipinjam': 'bg-warning/10 text-warning border-warning/20',
  'Dihapus': 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusKeys: Record<ItemStatus, TranslationKeys> = {
  'Aktif': 'statusActive',
  'Dipinjam': 'statusBorrowed',
  'Dihapus': 'statusDeleted',
};

const maintenanceStyles: Record<MaintenanceStatus, string> = {
  'Antrian': 'bg-warning/10 text-warning border-warning/20',
  'Dalam Perbaikan': 'bg-info/10 text-info border-info/20',
  'Selesai': 'bg-success/10 text-success border-success/20',
};

const maintenanceKeys: Record<MaintenanceStatus, TranslationKeys> = {
  'Antrian': 'maintenanceQueue',
  'Dalam Perbaikan': 'maintenanceInProgress',
  'Selesai': 'maintenanceDone',
};

export function ConditionBadge({ condition }: { condition: ItemCondition }) {
  const { t } = useLanguage();
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${conditionStyles[condition]}`}>{t(conditionKeys[condition])}</span>;
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const { t } = useLanguage();
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>{t(statusKeys[status])}</span>;
}

export function MaintenanceBadge({ status }: { status: MaintenanceStatus }) {
  const { t } = useLanguage();
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${maintenanceStyles[status]}`}>{t(maintenanceKeys[status])}</span>;
}
