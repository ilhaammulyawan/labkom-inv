// Utility types and functions - keep only what's not in the database

export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Diperbaiki';
export type ItemStatus = 'Aktif' | 'Dipinjam' | 'Dihapus';
export type MaintenanceStatus = 'Antrian' | 'Dalam Perbaikan' | 'Selesai';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
