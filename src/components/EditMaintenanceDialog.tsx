import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateMaintenance, type MaintenanceRecord } from "@/hooks/useMaintenance";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from "@/hooks/useItems";

const schema = z.object({
  item_id: z.string().min(1, "Pilih barang"),
  issue_date: z.string().min(1, "Masukkan tanggal kerusakan"),
  description: z.string().min(1, "Masukkan deskripsi masalah"),
  technician: z.string().min(1, "Masukkan nama teknisi"),
  status: z.enum(["Antrian", "Dalam Perbaikan", "Selesai"]),
  repair_date: z.string().optional(),
  action: z.string().optional(),
  cost: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: InventoryItem[];
  record: MaintenanceRecord | null;
}

export function EditMaintenanceDialog({ open, onOpenChange, items, record }: Props) {
  const { toast } = useToast();
  const update = useUpdateMaintenance();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      item_id: "", issue_date: "", description: "", technician: "",
      status: "Antrian", repair_date: "", action: "", cost: "",
    },
  });

  useEffect(() => {
    if (record && open) {
      form.reset({
        item_id: record.item_id,
        issue_date: record.issue_date,
        description: record.description,
        technician: record.technician,
        status: record.status,
        repair_date: record.repair_date || "",
        action: record.action || "",
        cost: record.cost ? String(record.cost) : "",
      });
    }
  }, [record, open]);

  const onSubmit = async (values: FormValues) => {
    if (!record) return;
    try {
      await update.mutateAsync({
        id: record.id,
        item_id: values.item_id,
        issue_date: values.issue_date,
        description: values.description,
        technician: values.technician,
        status: values.status,
        repair_date: values.repair_date || null,
        action: values.action || null,
        cost: values.cost ? Number(values.cost) : null,
      });
      toast({ title: "Berhasil", description: "Catatan perbaikan berhasil diperbarui." });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Catatan Perbaikan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="item_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Barang *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Pilih barang..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    {items.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} <span className="text-muted-foreground text-xs ml-1">({item.inventory_code})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="issue_date" render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Kerusakan *</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Masalah *</FormLabel>
                <FormControl><Textarea placeholder="Jelaskan kerusakan/masalah..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="technician" render={({ field }) => (
              <FormItem>
                <FormLabel>Teknisi *</FormLabel>
                <FormControl><Input placeholder="Nama teknisi..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Antrian">Antrian</SelectItem>
                    <SelectItem value="Dalam Perbaikan">Dalam Perbaikan</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="repair_date" render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Selesai Perbaikan</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="action" render={({ field }) => (
              <FormItem>
                <FormLabel>Tindakan yang Dilakukan</FormLabel>
                <FormControl><Textarea placeholder="Tindakan perbaikan..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cost" render={({ field }) => (
              <FormItem>
                <FormLabel>Biaya (Rp)</FormLabel>
                <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
              <Button type="submit" disabled={update.isPending} className="gradient-primary text-primary-foreground border-0">
                {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
