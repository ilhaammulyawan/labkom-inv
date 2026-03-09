import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SoftwareItem {
  id: string;
  item_id: string;
  software_name: string;
  version: string;
  license_type: string;
  license_key: string;
  expiry_date: string | null;
  notes: string;
  created_at: string;
}

export function useSoftwareInventory() {
  return useQuery({
    queryKey: ["software_inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("software_inventory")
        .select("*")
        .order("software_name");
      if (error) throw error;
      return data as SoftwareItem[];
    },
  });
}

export function useItemSoftware(itemId: string | undefined) {
  return useQuery({
    queryKey: ["software_inventory", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const { data, error } = await supabase
        .from("software_inventory")
        .select("*")
        .eq("item_id", itemId)
        .order("software_name");
      if (error) throw error;
      return data as SoftwareItem[];
    },
    enabled: !!itemId,
  });
}

export function useInsertSoftware() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: Omit<SoftwareItem, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("software_inventory")
        .insert(record as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["software_inventory"] }),
  });
}

export function useUpdateSoftware() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SoftwareItem> & { id: string }) => {
      const { error } = await supabase
        .from("software_inventory")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["software_inventory"] }),
  });
}

export function useDeleteSoftware() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("software_inventory").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["software_inventory"] }),
  });
}
