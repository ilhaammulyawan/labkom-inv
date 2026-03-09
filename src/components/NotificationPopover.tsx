import { useNotifications } from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const severityIcon = {
  destructive: <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />,
  warning: <Clock className="h-4 w-4 text-amber-500 shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
};

export function NotificationPopover() {
  const { notifications, count } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9">
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 md:h-4 md:w-4 rounded-full bg-destructive text-[8px] md:text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">Notifikasi</p>
          <p className="text-[11px] text-muted-foreground">{count} notifikasi aktif</p>
        </div>
        <ScrollArea className="max-h-[320px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada notifikasi
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <button
                  key={n.id}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3"
                  onClick={() => {
                    if (n.link) navigate(n.link);
                    setOpen(false);
                  }}
                >
                  {severityIcon[n.severity]}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-tight">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{n.description}</p>
                  </div>
                  <Badge
                    variant={n.severity === "destructive" ? "destructive" : "secondary"}
                    className="text-[9px] shrink-0"
                  >
                    {n.severity === "destructive" ? "Urgent" : n.severity === "warning" ? "Perlu Aksi" : "Info"}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
