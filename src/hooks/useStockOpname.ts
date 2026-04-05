import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StockOpnameSession {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
}

export interface StockOpnameItem {
  id: string;
  session_id: string;
  item_id: string;
  is_found: boolean | null;
  actual_condition: string | null;
  notes: string | null;
  checked_by: string | null;
  checked_at: string | null;
  created_at: string;
}

export function useStockOpnameSessions() {
  return useQuery({
    queryKey: ["stock_opname_sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_opname_sessions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StockOpnameSession[];
    },
  });
}

export function useStockOpnameSession(id: string | undefined) {
  return useQuery({
    queryKey: ["stock_opname_sessions", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("stock_opname_sessions")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as StockOpnameSession | null;
    },
    enabled: !!id,
  });
}

export function useStockOpnameItems(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["stock_opname_items", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("stock_opname_items")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as StockOpnameItem[];
    },
    enabled: !!sessionId,
  });
}

export function useInsertSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (session: { title: string; description?: string; start_date?: string; end_date?: string }) => {
      const { data, error } = await supabase
        .from("stock_opname_sessions")
        .insert(session as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock_opname_sessions"] }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StockOpnameSession> & { id: string }) => {
      const { error } = await supabase
        .from("stock_opname_sessions")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock_opname_sessions"] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stock_opname_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock_opname_sessions"] }),
  });
}

export function useUpsertOpnameItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      session_id: string;
      item_id: string;
      is_found: boolean;
      actual_condition?: string;
      notes?: string;
      checked_by?: string;
    }) => {
      const { data, error } = await supabase
        .from("stock_opname_items")
        .upsert(
          { ...item, checked_at: new Date().toISOString() } as any,
          { onConflict: "session_id,item_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["stock_opname_items", vars.session_id] }),
  });
}

export function usePopulateSessionItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      // Get all items
      const { data: items, error: itemsErr } = await supabase.from("items").select("id");
      if (itemsErr) throw itemsErr;
      // Get existing entries
      const { data: existing, error: existErr } = await supabase
        .from("stock_opname_items")
        .select("item_id")
        .eq("session_id", sessionId);
      if (existErr) throw existErr;
      const existingIds = new Set((existing || []).map((e: any) => e.item_id));
      const toInsert = (items || [])
        .filter((i: any) => !existingIds.has(i.id))
        .map((i: any) => ({ session_id: sessionId, item_id: i.id }));
      if (toInsert.length > 0) {
        const { error } = await supabase.from("stock_opname_items").insert(toInsert as any);
        if (error) throw error;
      }
      return toInsert.length;
    },
    onSuccess: (_, sessionId) => qc.invalidateQueries({ queryKey: ["stock_opname_items", sessionId] }),
  });
}
