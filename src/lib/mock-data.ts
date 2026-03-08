export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Room = {
  id: string;
  name: string;
  location: string;
};

export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Diperbaiki';
export type ItemStatus = 'Aktif' | 'Dipinjam' | 'Dihapus';
export type MaintenanceStatus = 'Antrian' | 'Dalam Perbaikan' | 'Selesai';

export type InventoryItem = {
  id: string;
  inventory_code: string;
  category_id: string;
  room_id: string;
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  // PC/Laptop specific
  hostname?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  vga?: string;
  os?: string;
  os_license?: string;
  ip_address?: string;
  mac_address?: string;
  // Monitor
  screen_size?: string;
  // Printer
  printer_type?: string;
  // General
  year_manufactured?: number;
  year_acquired?: number;
  price?: number;
  condition: ItemCondition;
  status: ItemStatus;
  last_service_date?: string;
  image_url?: string;
  notes?: string;
  created_at: string;
};

export type MaintenanceRecord = {
  id: string;
  item_id: string;
  issue_date: string;
  description: string;
  repair_date?: string;
  action?: string;
  cost?: number;
  technician: string;
  status: MaintenanceStatus;
};

export const categories: Category[] = [
  { id: 'cat-1', name: 'Komputer/PC', icon: 'Monitor' },
  { id: 'cat-2', name: 'Laptop', icon: 'Laptop' },
  { id: 'cat-3', name: 'Monitor', icon: 'MonitorSmartphone' },
  { id: 'cat-4', name: 'Printer/Scanner', icon: 'Printer' },
  { id: 'cat-5', name: 'Jaringan', icon: 'Wifi' },
  { id: 'cat-6', name: 'Perangkat Input', icon: 'Keyboard' },
  { id: 'cat-7', name: 'Perangkat Audio', icon: 'Headphones' },
  { id: 'cat-8', name: 'Proyektor/LCD', icon: 'Projector' },
  { id: 'cat-9', name: 'Server', icon: 'Server' },
  { id: 'cat-10', name: 'Komponen', icon: 'Cpu' },
  { id: 'cat-11', name: 'Software/Lisensi', icon: 'FileCode' },
  { id: 'cat-12', name: 'Lainnya', icon: 'Package' },
];

export const rooms: Room[] = [
  { id: 'room-1', name: 'Lab Komputer 1', location: 'Gedung A Lt. 2' },
  { id: 'room-2', name: 'Lab Komputer 2', location: 'Gedung A Lt. 2' },
  { id: 'room-3', name: 'Lab Komputer 3', location: 'Gedung A Lt. 3' },
  { id: 'room-4', name: 'Lab Multimedia', location: 'Gedung B Lt. 1' },
  { id: 'room-5', name: 'Server Room', location: 'Gedung A Lt. 1' },
  { id: 'room-6', name: 'Gudang', location: 'Gedung A Lt. 1' },
];

export const items: InventoryItem[] = [
  {
    id: 'item-1', inventory_code: 'INV-PC-001', category_id: 'cat-1', room_id: 'room-1',
    name: 'PC Desktop Lab 1 - Meja 01', brand: 'Dell', model: 'OptiPlex 7090',
    serial_number: 'DLL7090-001', hostname: 'LAB1-PC01', cpu: 'Intel Core i5-11500',
    ram: '16 GB DDR4', storage: 'SSD 512GB', vga: 'Intel UHD 730', os: 'Windows 11 Pro',
    os_license: 'OEM', ip_address: '192.168.1.101', mac_address: 'AA:BB:CC:DD:EE:01',
    year_manufactured: 2022, year_acquired: 2022, price: 12500000,
    condition: 'Baik', status: 'Aktif', last_service_date: '2024-06-15',
    notes: 'Komputer utama meja 1', created_at: '2022-08-01',
  },
  {
    id: 'item-2', inventory_code: 'INV-PC-002', category_id: 'cat-1', room_id: 'room-1',
    name: 'PC Desktop Lab 1 - Meja 02', brand: 'HP', model: 'ProDesk 400 G7',
    serial_number: 'HP400G7-002', hostname: 'LAB1-PC02', cpu: 'Intel Core i5-10500',
    ram: '8 GB DDR4', storage: 'HDD 1TB', vga: 'Intel UHD 630', os: 'Windows 10 Pro',
    ip_address: '192.168.1.102', mac_address: 'AA:BB:CC:DD:EE:02',
    year_manufactured: 2021, year_acquired: 2021, price: 9800000,
    condition: 'Baik', status: 'Aktif', last_service_date: '2024-05-20', created_at: '2021-07-15',
  },
  {
    id: 'item-3', inventory_code: 'INV-PC-003', category_id: 'cat-1', room_id: 'room-1',
    name: 'PC Desktop Lab 1 - Meja 03', brand: 'Lenovo', model: 'ThinkCentre M70q',
    serial_number: 'LNV-M70Q-003', hostname: 'LAB1-PC03', cpu: 'Intel Core i3-10100T',
    ram: '8 GB DDR4', storage: 'SSD 256GB', vga: 'Intel UHD 630', os: 'Windows 10 Pro',
    ip_address: '192.168.1.103', mac_address: 'AA:BB:CC:DD:EE:03',
    year_manufactured: 2021, year_acquired: 2021, price: 8500000,
    condition: 'Rusak Ringan', status: 'Aktif', last_service_date: '2024-03-10', created_at: '2021-07-15',
  },
  {
    id: 'item-4', inventory_code: 'INV-LT-001', category_id: 'cat-2', room_id: 'room-4',
    name: 'Laptop Multimedia 01', brand: 'ASUS', model: 'VivoBook 15 X515',
    serial_number: 'ASUS-VB15-001', cpu: 'AMD Ryzen 5 5500U',
    ram: '8 GB DDR4', storage: 'SSD 512GB', vga: 'AMD Radeon Graphics', os: 'Windows 11 Home',
    year_manufactured: 2023, year_acquired: 2023, price: 7500000,
    condition: 'Baik', status: 'Dipinjam', created_at: '2023-02-20',
  },
  {
    id: 'item-5', inventory_code: 'INV-MON-001', category_id: 'cat-3', room_id: 'room-1',
    name: 'Monitor Lab 1 - Meja 01', brand: 'LG', model: '24MK430H',
    serial_number: 'LG24MK-001', screen_size: '24 inch',
    year_manufactured: 2022, year_acquired: 2022, price: 2200000,
    condition: 'Baik', status: 'Aktif', created_at: '2022-08-01',
  },
  {
    id: 'item-6', inventory_code: 'INV-MON-002', category_id: 'cat-3', room_id: 'room-1',
    name: 'Monitor Lab 1 - Meja 02', brand: 'Samsung', model: 'S24R350',
    serial_number: 'SAM-S24R-002', screen_size: '24 inch',
    year_manufactured: 2021, year_acquired: 2021, price: 2000000,
    condition: 'Baik', status: 'Aktif', created_at: '2021-07-15',
  },
  {
    id: 'item-7', inventory_code: 'INV-PRN-001', category_id: 'cat-4', room_id: 'room-1',
    name: 'Printer Lab 1', brand: 'HP', model: 'LaserJet Pro M404dn',
    serial_number: 'HP-LJ404-001', printer_type: 'Laser',
    ip_address: '192.168.1.200',
    year_manufactured: 2022, year_acquired: 2022, price: 4500000,
    condition: 'Baik', status: 'Aktif', last_service_date: '2024-08-01', created_at: '2022-08-01',
  },
  {
    id: 'item-8', inventory_code: 'INV-NET-001', category_id: 'cat-5', room_id: 'room-1',
    name: 'Switch Lab 1', brand: 'Cisco', model: 'Catalyst 2960-24T',
    serial_number: 'CISCO-2960-001',
    ip_address: '192.168.1.1',
    year_manufactured: 2020, year_acquired: 2020, price: 8000000,
    condition: 'Baik', status: 'Aktif', created_at: '2020-06-01',
  },
  {
    id: 'item-9', inventory_code: 'INV-PC-004', category_id: 'cat-1', room_id: 'room-2',
    name: 'PC Desktop Lab 2 - Meja 01', brand: 'Dell', model: 'OptiPlex 5090',
    serial_number: 'DLL5090-001', hostname: 'LAB2-PC01', cpu: 'Intel Core i5-11400',
    ram: '16 GB DDR4', storage: 'SSD 512GB', vga: 'Intel UHD 730', os: 'Windows 11 Pro',
    ip_address: '192.168.2.101', mac_address: 'BB:CC:DD:EE:FF:01',
    year_manufactured: 2022, year_acquired: 2022, price: 11000000,
    condition: 'Rusak Berat', status: 'Aktif', created_at: '2022-08-01',
  },
  {
    id: 'item-10', inventory_code: 'INV-SRV-001', category_id: 'cat-9', room_id: 'room-5',
    name: 'Server Utama', brand: 'Dell', model: 'PowerEdge R740',
    serial_number: 'DLL-PE740-001', hostname: 'SRV-MAIN', cpu: 'Intel Xeon Silver 4214R',
    ram: '64 GB DDR4 ECC', storage: 'SSD 2TB RAID 1', vga: 'Matrox G200',
    os: 'Ubuntu Server 22.04 LTS', ip_address: '192.168.0.1',
    mac_address: 'CC:DD:EE:FF:00:01',
    year_manufactured: 2020, year_acquired: 2020, price: 85000000,
    condition: 'Baik', status: 'Aktif', last_service_date: '2024-09-01', created_at: '2020-01-15',
  },
  {
    id: 'item-11', inventory_code: 'INV-PRJ-001', category_id: 'cat-8', room_id: 'room-4',
    name: 'Proyektor Multimedia', brand: 'Epson', model: 'EB-X51',
    serial_number: 'EPS-EBX51-001',
    year_manufactured: 2022, year_acquired: 2023, price: 6500000,
    condition: 'Baik', status: 'Aktif', created_at: '2023-01-10',
  },
  {
    id: 'item-12', inventory_code: 'INV-KB-001', category_id: 'cat-6', room_id: 'room-6',
    name: 'Keyboard USB (Stok)', brand: 'Logitech', model: 'K120',
    serial_number: 'LOG-K120-BATCH',
    year_manufactured: 2023, year_acquired: 2023, price: 120000,
    condition: 'Baik', status: 'Aktif', notes: 'Stok 15 unit', created_at: '2023-03-01',
  },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maint-1', item_id: 'item-3', issue_date: '2024-08-10',
    description: 'Fan CPU berisik, performa lambat',
    repair_date: '2024-08-12', action: 'Ganti thermal paste dan bersihkan fan',
    cost: 150000, technician: 'Budi Santoso', status: 'Selesai',
  },
  {
    id: 'maint-2', item_id: 'item-9', issue_date: '2024-09-05',
    description: 'Motherboard mati total, tidak bisa boot',
    technician: 'Budi Santoso', status: 'Dalam Perbaikan',
  },
  {
    id: 'maint-3', item_id: 'item-2', issue_date: '2024-09-15',
    description: 'HDD sering hang, perlu upgrade ke SSD',
    technician: 'Ahmad Rizki', status: 'Antrian',
  },
];

export const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
export const getRoomName = (id: string) => rooms.find(r => r.id === id)?.name || 'Unknown';
export const getItemById = (id: string) => items.find(i => i.id === id);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
