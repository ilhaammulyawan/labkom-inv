import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MaintenanceStatus = 'Antrian' | 'Dalam Perbaikan' | 'Selesai';

export interface MaintenanceRecord {
  id: string;
  item_id: string;
  issue_date: string;
  description: string;
  repair_date: string | null;
  action: string | null;
  cost: number | null;
  technician: string;
  status: MaintenanceStatus;
  created_at: string;
}

export function useMaintenanceRecords() {
  return useQuery({
    queryKey: ["maintenance_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*")
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });
}

export function useItemMaintenanceRecords(itemId: string | undefined) {
  return useQuery({
    queryKey: ["maintenance_records", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("item_id", itemId)
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
    enabled: !!itemId,
  });
}

export function useInsertMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: Omit<MaintenanceRecord, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("maintenance_records")
        .insert(record as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance_records"] });
    },
  });
}
