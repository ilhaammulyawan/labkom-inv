import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from "qrcode.react";
import { Printer, QrCode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const QRPrint = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [labelSize, setLabelSize] = useState("3");
  const { data: items = [], isLoading } = useItems();
  const { data: categories = [] } = useCategories();

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || t("unknown");
  const toggle = (id: string) => { setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const selectAll = () => setSelected(selected.length === items.length ? [] : items.map(i => i.id));
  const handlePrint = () => window.print();
  const selectedItems = items.filter(i => selected.includes(i.id));

  if (isLoading) return <div className="space-y-6 animate-fade-in"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><QrCode className="h-6 w-6" /> {t("printQRTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("printQRDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Select value={labelSize} onValueChange={setLabelSize}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2×2 cm</SelectItem>
              <SelectItem value="3">3×3 cm</SelectItem>
              <SelectItem value="4">4×4 cm</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePrint} disabled={selected.length === 0} className="gradient-primary text-primary-foreground border-0">
            <Printer className="mr-2 h-4 w-4" /> {t("printCount")} ({selected.length})
          </Button>
        </div>
      </div>

      <div className="kpi-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 text-left"><Checkbox checked={selected.length === items.length && items.length > 0} onCheckedChange={selectAll} /></th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">{t("code")}</th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">{t("name")}</th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground hidden sm:table-cell">{t("category")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => toggle(item.id)}>
                  <td className="py-2.5 px-4"><Checkbox checked={selected.includes(item.id)} /></td>
                  <td className="py-2.5 px-4 font-mono text-primary">{item.inventory_code}</td>
                  <td className="py-2.5 px-4 font-medium">{item.name}</td>
                  <td className="py-2.5 px-4 hidden sm:table-cell text-muted-foreground">{getCategoryName(item.category_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-4">{t("previewLabel")}</h3>
          <div className="print-area grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedItems.map(item => (
              <div key={item.id} className="border border-border rounded-lg p-3 flex flex-col items-center bg-card" style={{ minWidth: `${parseInt(labelSize) * 35}px` }}>
                <QRCodeSVG value={`${window.location.origin}/item/${item.id}`} size={parseInt(labelSize) * 30} level="M" />
                <p className="text-[9px] font-mono font-bold mt-2 text-center">{item.inventory_code}</p>
                <p className="text-[8px] text-muted-foreground text-center truncate max-w-full">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRPrint;
