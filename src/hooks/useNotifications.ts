import { useMemo } from "react";
import { useMaintenanceSchedules } from "./useMaintenanceSchedules";
import { useBorrowings } from "./useBorrowings";
import { useUserRole } from "./useUserRole";
import { useAuth } from "@/contexts/AuthContext";

export interface AppNotification {
  id: string;
  type: "maintenance_overdue" | "borrowing_overdue" | "borrowing_pending" | "borrowing_return";
  title: string;
  description: string;
  date: string;
  severity: "warning" | "destructive" | "info";
  link?: string;
}

export function useNotifications() {
  const { data: schedules = [] } = useMaintenanceSchedules();
  const { data: borrowings = [] } = useBorrowings();
  const { isAdmin } = useUserRole();
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const notifications = useMemo(() => {
    const notifs: AppNotification[] = [];

    // Maintenance schedules overdue
    schedules
      .filter(s => s.is_active && s.next_due_date <= today)
      .forEach(s => {
        notifs.push({
          id: `maint-${s.id}`,
          type: "maintenance_overdue",
          title: "Maintenance Jatuh Tempo",
          description: s.title,
          date: s.next_due_date,
          severity: "destructive",
          link: "/maintenance-schedule",
        });
      });

    // Borrowing overdue (status Dipinjam & past expected return)
    borrowings
      .filter(b => b.status === "Dipinjam" && b.expected_return_date < today)
      .forEach(b => {
        notifs.push({
          id: `borrow-overdue-${b.id}`,
          type: "borrowing_overdue",
          title: "Peminjaman Terlambat",
          description: `${b.borrower_name} - jatuh tempo ${b.expected_return_date}`,
          date: b.expected_return_date,
          severity: "destructive",
          link: "/borrowings",
        });
      });

    // Pending borrowing requests (admin only)
    if (isAdmin) {
      borrowings
        .filter(b => b.status === "Menunggu")
        .forEach(b => {
          notifs.push({
            id: `borrow-pending-${b.id}`,
            type: "borrowing_pending",
            title: "Permintaan Peminjaman",
            description: `${b.borrower_name} mengajukan peminjaman`,
            date: b.created_at,
            severity: "info",
            link: "/borrowings",
          });
        });

      // Return requests pending admin confirmation
      borrowings
        .filter(b => b.status === "Pengembalian")
        .forEach(b => {
          notifs.push({
            id: `borrow-return-${b.id}`,
            type: "borrowing_return",
            title: "Pengembalian Menunggu",
            description: `${b.borrower_name} mengembalikan barang`,
            date: b.created_at,
            severity: "warning",
            link: "/borrowings",
          });
        });
    }

    // For regular users: show their own overdue borrowings
    if (!isAdmin && user?.id) {
      borrowings
        .filter(b => b.borrower_id === user.id && b.status === "Dipinjam" && b.expected_return_date < today)
        .forEach(b => {
          // Avoid duplicate if already added above
          const exists = notifs.some(n => n.id === `borrow-overdue-${b.id}`);
          if (!exists) {
            notifs.push({
              id: `borrow-user-overdue-${b.id}`,
              type: "borrowing_overdue",
              title: "Peminjaman Anda Terlambat",
              description: `Jatuh tempo ${b.expected_return_date}`,
              date: b.expected_return_date,
              severity: "destructive",
              link: "/borrowings",
            });
          }
        });
    }

    // Sort by severity (destructive first)
    const severityOrder = { destructive: 0, warning: 1, info: 2 };
    notifs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return notifs;
  }, [schedules, borrowings, isAdmin, user?.id, today]);

  return { notifications, count: notifications.length };
}
