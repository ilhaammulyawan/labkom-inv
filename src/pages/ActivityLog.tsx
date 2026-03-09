import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Package, Wrench, HandCoins, Settings, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";

const ENTITY_ICONS: Record<string, any> = {
  item: Package,
  maintenance: Wrench,
  borrowing: HandCoins,
  settings: Settings,
  user: User,
};

const ACTION_LABELS: Record<string, string> = {
  create: "Dibuat",
  update: "Diperbarui",
  delete: "Dihapus",
  approve: "Disetujui",
  reject: "Ditolak",
  return: "Dikembalikan",
};

const ActivityLogPage = () => {
  const { data: logs = [], isLoading } = useActivityLogs();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  if (roleLoading) return <Skeleton className="h-32" />;
  if (!isAdmin) return <Navigate to="/" replace />;
  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <History className="h-6 w-6" /> Riwayat Perubahan
        </h1>
        <p className="text-sm text-muted-foreground">{logs.length} aktivitas terakhir</p>
      </div>

      <div className="space-y-3">
        {logs.map(log => {
          const Icon = ENTITY_ICONS[log.entity_type] || Settings;
          const actionLabel = ACTION_LABELS[log.action] || log.action;
          return (
            <div key={log.id} className="kpi-card flex items-start gap-3">
              <div className="rounded-lg p-2 bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">{log.entity_type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{actionLabel}</Badge>
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {log.details.name || log.details.title || JSON.stringify(log.details).slice(0, 100)}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          );
        })}
        {logs.length === 0 && <p className="text-center text-muted-foreground py-12">Belum ada aktivitas tercatat</p>}
      </div>
    </div>
  );
};

export default ActivityLogPage;
