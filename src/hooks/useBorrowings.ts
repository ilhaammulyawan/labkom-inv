import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BorrowingStatus = 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Dipinjam' | 'Pengembalian' | 'Dikembalikan';

export interface Borrowing {
  id: string;
  item_id: string;
  borrower_id: string;
  borrower_name: string;
  purpose: string;
  borrow_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  status: BorrowingStatus;
  approved_by: string | null;
  notes: string;
  created_at: string;
}

export function useBorrowings() {
  return useQuery({
    queryKey: ["borrowings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("borrowings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Borrowing[];
    },
  });
}

export function useInsertBorrowing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: Omit<Borrowing, "id" | "created_at" | "actual_return_date" | "approved_by">) => {
      const { data, error } = await supabase
        .from("borrowings")
        .insert(record as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["borrowings"] }),
  });
}

export function useUpdateBorrowing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Borrowing> & { id: string }) => {
      const { error } = await supabase
        .from("borrowings")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["borrowings"] }),
  });
}

export function useDeleteBorrowing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("borrowings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["borrowings"] }),
  });
}
