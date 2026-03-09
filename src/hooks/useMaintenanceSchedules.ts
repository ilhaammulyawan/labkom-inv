import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MaintenanceSchedule {
  id: string;
  item_id: string;
  title: string;
  description: string;
  frequency: string;
  next_due_date: string;
  last_performed_date: string | null;
  assigned_technician: string;
  is_active: boolean;
  created_at: string;
}

export function useMaintenanceSchedules() {
  return useQuery({
    queryKey: ["maintenance_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_schedules")
        .select("*")
        .order("next_due_date", { ascending: true });
      if (error) throw error;
      return data as MaintenanceSchedule[];
    },
  });
}

export function useInsertSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: Omit<MaintenanceSchedule, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("maintenance_schedules")
        .insert(record as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance_schedules"] }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MaintenanceSchedule> & { id: string }) => {
      const { error } = await supabase
        .from("maintenance_schedules")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance_schedules"] }),
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("maintenance_schedules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance_schedules"] }),
  });
}
