import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "user";

export interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .order("created_at", { ascending: false });
      
      if (profilesError) throw profilesError;

      // Get roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
      
      if (rolesError) throw rolesError;

      // Create role map
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role as AppRole]) || []);

      // Combine data - we'll show profile info, email will be fetched separately or shown as ID
      return (profiles || []).map(p => ({
        id: p.id,
        email: p.id, // Will display as user ID since we can't access auth.users
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        role: roleMap.get(p.id) || "user",
        created_at: p.created_at,
      })) as UserWithRole[];
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users-with-roles"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      // Delete from profiles (will cascade to user_roles due to FK)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users-with-roles"] }),
  });
}
