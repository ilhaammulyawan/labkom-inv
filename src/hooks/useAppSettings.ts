import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAppSettings() {
  const queryClient = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("key, value");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((row: { key: string; value: string }) => {
        map[row.key] = row.value;
      });
      return map;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
    },
  });

  const logoUrl = settings["app_logo"] || null;

  return { settings, logoUrl, isLoading, updateSetting };
}

export async function uploadAppLogo(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `logo/app-logo.${ext}`;

  // Remove old file first (ignore errors)
  await supabase.storage.from("app-assets").remove([filePath]);

  const { error } = await supabase.storage
    .from("app-assets")
    .upload(filePath, file, { upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from("app-assets").getPublicUrl(filePath);
  // Add cache-busting param
  return `${data.publicUrl}?t=${Date.now()}`;
}
