import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, CheckCircle2, XCircle, Loader2, Search, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStockOpnameSession, useStockOpnameItems, useUpsertOpnameItem, usePopulateSessionItems } from "@/hooks/useStockOpname";
import { useItems } from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { exportStockOpnameExcel, exportStockOpnamePdf } from "@/lib/export-utils";

const CONDITIONS = ["Baik", "Rusak Ringan", "Rusak Berat", "Diperbaiki"];

const StockOpnameDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: session, isLoading: loadSession } = useStockOpnameSession(id);
  const { data: opnameItems = [], isLoading: loadOpItems } = useStockOpnameItems(id);
  const { data: items = [], isLoading: loadItems } = useItems();
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();
  const { settings } = useAppSettings();
  const upsertItem = useUpsertOpnameItem();
  const populateItems = usePopulateSessionItems();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [checkDialog, setCheckDialog] = useState<string | null>(null);
  const [checkFound, setCheckFound] = useState(true);
  const [checkCondition, setCheckCondition] = useState("Baik");
  const [checkNotes, setCheckNotes] = useState("");

  const isLoading = loadSession || loadOpItems || loadItems;
  const isActive = session?.status === "Berlangsung";

  // Map opname items by item_id
  const opnameMap = useMemo(() => {
    const m = new Map<string, typeof opnameItems[0]>();
    opnameItems.forEach(oi => m.set(oi.item_id, oi));
    return m;
  }, [opnameItems]);

  // Combined list: all items with opname status
  const combinedList = useMemo(() => {
    return items.map(item => {
      const oi = opnameMap.get(item.id);
      return {
        ...item,
        opnameId: oi?.id,
        is_found: oi?.is_found ?? null,
        actual_condition: oi?.actual_condition ?? null,
        opnameNotes: oi?.notes ?? "",
        checked_at: oi?.checked_at ?? null,
      };
    });
  }, [items, opnameMap]);

  const filtered = useMemo(() => {
    let list = combinedList;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.inventory_code.toLowerCase().includes(q));
    }
    if (filterStatus === "checked") list = list.filter(i => i.is_found !== null);
    if (filterStatus === "unchecked") list = list.filter(i => i.is_found === null);
    if (filterStatus === "found") list = list.filter(i => i.is_found === true);
    if (filterStatus === "notfound") list = list.filter(i => i.is_found === false);
    return list;
  }, [combinedList, search, filterStatus]);

  const totalItems = items.length;
  const checkedCount = opnameItems.filter(oi => oi.is_found !== null).length;
  const foundCount = opnameItems.filter(oi => oi.is_found === true).length;
  const notFoundCount = opnameItems.filter(oi => oi.is_found === false).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const handlePopulate = async () => {
    if (!id) return;
    try {
      const count = await populateItems.mutateAsync(id);
      toast.success(`${count} ${t("soItemsPopulated")}`);
    } catch (err: any) { toast.error(err.message); }
  };

  const openCheckDialog = (itemId: string) => {
    const existing = opnameMap.get(itemId);
    setCheckFound(existing?.is_found ?? true);
    setCheckCondition(existing?.actual_condition || "Baik");
    setCheckNotes(existing?.notes || "");
    setCheckDialog(itemId);
  };

  const handleCheck = async () => {
    if (!checkDialog || !id) return;
    try {
      await upsertItem.mutateAsync({
        session_id: id,
        item_id: checkDialog,
        is_found: checkFound,
        actual_condition: checkFound ? checkCondition : null,
        notes: checkNotes,
        checked_by: user?.id,
      });
      toast.success(t("soItemChecked"));
      setCheckDialog(null);
    } catch (err: any) { toast.error(err.message); }
  };

  const getCatName = (cid: string | null) => categories.find(c => c.id === cid)?.name ?? "-";
  const getRoomName = (rid: string | null) => rooms.find(r => r.id === rid)?.name ?? "-";

  const handleExportExcel = () => {
    if (!session) return;
    exportStockOpnameExcel(session, opnameItems, items, categories, rooms);
    toast.success(t("reportDownloaded"));
  };

  const handleExportPdf = async () => {
    if (!session) return;
    await exportStockOpnamePdf(session, opnameItems, items, categories, rooms, settings);
    toast.success(t("reportDownloaded"));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!session) {
    return <div className="text-center py-16 text-muted-foreground">{t("noData")}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/stock-opname")} className="mb-2">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("back")}
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" /> {session.title}
          </h1>
          <p className="text-sm text-muted-foreground">{session.start_date}{session.end_date ? ` — ${session.end_date}` : ""}</p>
          {session.description && <p className="text-sm mt-1">{session.description}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-green-600 border-green-200">
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPdf} className="text-red-600 border-red-200">
            <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="kpi-card space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{t("soProgress")}</span>
          <span className="font-bold">{progress}% ({checkedCount}/{totalItems})</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> {t("soFound")}: {foundCount}</span>
          <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-500" /> {t("soNotFound")}: {notFoundCount}</span>
          <span>{t("soUnchecked")}: {totalItems - checkedCount}</span>
        </div>
        {isActive && (
          <Button size="sm" variant="outline" onClick={handlePopulate} disabled={populateItems.isPending}>
            {t("soPopulateItems")}
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder={t("search")} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="checked">{t("soChecked")}</SelectItem>
            <SelectItem value="unchecked">{t("soUncheckedFilter")}</SelectItem>
            <SelectItem value="found">{t("soFound")}</SelectItem>
            <SelectItem value="notfound">{t("soNotFound")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">{t("inventoryCode")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("itemName")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("category")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("room")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("soStatus")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("soActualCondition")}</th>
              {isActive && <th className="px-3 py-2 text-left font-medium">{t("actions")}</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item, idx) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                <td className="px-3 py-2 font-mono text-xs">{item.inventory_code}</td>
                <td className="px-3 py-2 font-medium">{item.name}</td>
                <td className="px-3 py-2">{getCatName(item.category_id)}</td>
                <td className="px-3 py-2">{getRoomName(item.room_id)}</td>
                <td className="px-3 py-2">
                  {item.is_found === null ? (
                    <Badge variant="secondary">{t("soUnchecked")}</Badge>
                  ) : item.is_found ? (
                    <Badge variant="default" className="bg-green-600">{t("soFound")}</Badge>
                  ) : (
                    <Badge variant="destructive">{t("soNotFound")}</Badge>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">{item.actual_condition || "-"}</td>
                {isActive && (
                  <td className="px-3 py-2">
                    <Button size="sm" variant="outline" onClick={() => openCheckDialog(item.id)}>
                      <ClipboardCheck className="mr-1 h-3.5 w-3.5" /> {t("soCheck")}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">{t("noData")}</div>
        )}
      </div>

      {/* Check Dialog */}
      <Dialog open={!!checkDialog} onOpenChange={(v) => { if (!v) setCheckDialog(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("soCheckItem")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("soItemFound")}</Label>
              <div className="flex gap-3 mt-1">
                <Button variant={checkFound ? "default" : "outline"} size="sm" onClick={() => setCheckFound(true)}>
                  <CheckCircle2 className="mr-1 h-4 w-4" /> {t("soFound")}
                </Button>
                <Button variant={!checkFound ? "destructive" : "outline"} size="sm" onClick={() => setCheckFound(false)}>
                  <XCircle className="mr-1 h-4 w-4" /> {t("soNotFound")}
                </Button>
              </div>
            </div>
            {checkFound && (
              <div>
                <Label>{t("soActualCondition")}</Label>
                <Select value={checkCondition} onValueChange={setCheckCondition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>{t("notes")}</Label>
              <Textarea value={checkNotes} onChange={e => setCheckNotes(e.target.value)} rows={2} />
            </div>
            <Button onClick={handleCheck} disabled={upsertItem.isPending} className="w-full">
              {upsertItem.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              {t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockOpnameDetail;
