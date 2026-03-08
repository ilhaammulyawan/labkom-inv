import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Diperbaiki';
export type ItemStatus = 'Aktif' | 'Dipinjam' | 'Dihapus';

export interface InventoryItem {
  id: string;
  inventory_code: string;
  category_id: string | null;
  room_id: string | null;
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  hostname: string | null;
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  vga: string | null;
  os: string | null;
  os_license: string | null;
  ip_address: string | null;
  mac_address: string | null;
  screen_size: string | null;
  printer_type: string | null;
  year_manufactured: number | null;
  year_acquired: number | null;
  price: number | null;
  condition: ItemCondition;
  status: ItemStatus;
  last_service_date: string | null;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface ItemInsert {
  inventory_code: string;
  category_id?: string;
  room_id?: string;
  name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  hostname?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  vga?: string;
  os?: string;
  os_license?: string;
  ip_address?: string;
  mac_address?: string;
  screen_size?: string;
  printer_type?: string;
  year_manufactured?: number;
  year_acquired?: number;
  price?: number;
  condition?: ItemCondition;
  status?: ItemStatus;
  last_service_date?: string;
  image_url?: string;
  notes?: string;
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as InventoryItem[];
    },
  });
}

export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as InventoryItem | null;
    },
    enabled: !!id,
  });
}

export function useInsertItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ItemInsert) => {
      const { data, error } = await supabase
        .from("items")
        .insert(item as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { error } = await supabase
        .from("items")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
