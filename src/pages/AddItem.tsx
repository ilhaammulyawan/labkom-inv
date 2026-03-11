import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useRooms } from "@/hooks/useRooms";
import { useInsertItem, useItems, type ItemInsert } from "@/hooks/useItems";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const categoryPrefixMap: Record<string, string> = {
  'Komputer/PC': 'PC', 'Laptop': 'LPT', 'Monitor': 'MON',
  'Printer/Scanner': 'PRT', 'Jaringan': 'NET', 'Server': 'SRV',
  'Proyektor': 'PRJ', 'UPS': 'UPS', 'Lainnya': 'OTH',
};

const AddItem = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data: categories = [] } = useCategories();
  const { data: rooms = [] } = useRooms();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error(t("accessDenied"), { description: t("onlyAdmin") });
      navigate("/inventory");
    }
  }, [isAdmin, roleLoading, navigate]);

  const { data: items = [] } = useItems();
  const insertItem = useInsertItem();

  const [categoryId, setCategoryId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [condition, setCondition] = useState("");
  const [hostname, setHostname] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [vga, setVga] = useState("");
  const [os, setOs] = useState("");
  const [osLicense, setOsLicense] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [printerType, setPrinterType] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");
  const [yearAcquired, setYearAcquired] = useState("");
  const [price, setPrice] = useState("");
  const [lastServiceDate, setLastServiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [inventoryCode, setInventoryCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const catName = categories.find(c => c.id === categoryId)?.name || '';
  const isPC = ['Komputer/PC', 'Laptop', 'Server'].includes(catName);
  const isMonitor = catName === 'Monitor';
  const isPrinter = catName === 'Printer/Scanner';
  const isNetwork = catName === 'Jaringan';

  const generateInventoryCode = (selectedCategoryId: string) => {
    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return '';
    const prefix = categoryPrefixMap[category.name] || 'INV';
    const year = new Date().getFullYear().toString().slice(-2);
    const existingCodes = items
      .filter(item => item.inventory_code.startsWith(`${prefix}-${year}`))
      .map(item => {
        const match = item.inventory_code.match(new RegExp(`${prefix}-${year}-(\\d+)`));
        return match ? parseInt(match[1]) : 0;
      });
    const maxNumber = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
    return `${prefix}-${year}-${nextNumber}`;
  };

  useEffect(() => {
    if (categoryId) {
      const newCode = generateInventoryCode(categoryId);
      setInventoryCode(newCode);
    }
  }, [categoryId]);

  const handleRegenerateCode = () => {
    if (categoryId) {
      setInventoryCode(generateInventoryCode(categoryId));
    } else {
      toast.error(t("selectCategoryFirst"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryCode || !name || !brand || !categoryId || !roomId || !condition) {
      toast.error(t("requiredField"));
      return;
    }
    const item: ItemInsert = {
      inventory_code: inventoryCode, category_id: categoryId, room_id: roomId,
      name, brand, model, serial_number: serialNumber, condition: condition as any,
      hostname: hostname || undefined, cpu: cpu || undefined, ram: ram || undefined,
      storage: storage || undefined, vga: vga || undefined, os: os || undefined,
      os_license: osLicense || undefined, ip_address: ipAddress || undefined,
      mac_address: macAddress || undefined, screen_size: screenSize || undefined,
      printer_type: printerType || undefined,
      year_manufactured: yearManufactured ? parseInt(yearManufactured) : undefined,
      year_acquired: yearAcquired ? parseInt(yearAcquired) : undefined,
      price: price ? parseInt(price) : undefined,
      last_service_date: lastServiceDate || undefined, notes: notes || undefined,
      image_url: imageUrl || undefined,
    };
    try {
      await insertItem.mutateAsync(item);
      toast.success(t("itemAdded"));
      navigate("/inventory");
    } catch (err: any) {
      toast.error(t("itemAddFailed"), { description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("addNewItem")}</h1>
          <p className="text-sm text-muted-foreground">{t("fillItemData")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold">{t("basicInfo")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t("inventoryCode")} *</Label>
              <div className="flex gap-2">
                <Input placeholder={t("autoGenerateAfterCategory")} value={inventoryCode} onChange={e => setInventoryCode(e.target.value)} required className="flex-1" />
                <Button type="button" variant="outline" size="icon" onClick={handleRegenerateCode} title={t("regenerateCode")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t("category")} *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t("room")} *</Label>
              <Select value={roomId} onValueChange={setRoomId} required>
                <SelectTrigger><SelectValue placeholder={t("selectRoom")} /></SelectTrigger>
                <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t("condition")} *</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger><SelectValue placeholder={t("selectCondition")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">{t("condGood")}</SelectItem>
                  <SelectItem value="Rusak Ringan">{t("condLightDamage")}</SelectItem>
                  <SelectItem value="Rusak Berat">{t("condHeavyDamage")}</SelectItem>
                  <SelectItem value="Diperbaiki">{t("condRepaired")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">{t("itemName")} *</Label>
              <Input placeholder={t("itemNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">{t("brand")} *</Label><Input placeholder={t("brandPlaceholder")} value={brand} onChange={e => setBrand(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label className="text-xs">Model/Type</Label><Input placeholder={t("modelPlaceholder")} value={model} onChange={e => setModel(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("serialNumber")}</Label><Input placeholder={t("serialPlaceholder")} value={serialNumber} onChange={e => setSerialNumber(e.target.value)} /></div>
          </div>
        </div>

        {isPC && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">{t("specPC")} {catName === 'Laptop' ? 'Laptop' : catName === 'Server' ? 'Server' : 'PC'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">{t("hostname")}</Label><Input placeholder="LAB1-PC01" value={hostname} onChange={e => setHostname(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("processor")}</Label><Input placeholder="Intel Core i5-11500" value={cpu} onChange={e => setCpu(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("ram")}</Label><Input placeholder="16 GB DDR4" value={ram} onChange={e => setRam(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("storage")}</Label><Input placeholder="SSD 512GB" value={storage} onChange={e => setStorage(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("vga")}</Label><Input placeholder="Intel UHD 730" value={vga} onChange={e => setVga(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("operatingSystem")}</Label><Input placeholder="Windows 11 Pro" value={os} onChange={e => setOs(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("osLicense")}</Label><Input placeholder="OEM / Retail" value={osLicense} onChange={e => setOsLicense(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("ipAddress")}</Label><Input placeholder="192.168.1.101" value={ipAddress} onChange={e => setIpAddress(e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">{t("macAddress")}</Label><Input placeholder="AA:BB:CC:DD:EE:FF" value={macAddress} onChange={e => setMacAddress(e.target.value)} /></div>
            </div>
          </div>
        )}

        {isMonitor && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">{t("specMonitor")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">{t("screenSize")}</Label><Input placeholder="24 inch" value={screenSize} onChange={e => setScreenSize(e.target.value)} /></div>
            </div>
          </div>
        )}

        {isPrinter && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">{t("specPrinter")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t("printerType")}</Label>
                <Select value={printerType} onValueChange={setPrinterType}>
                  <SelectTrigger><SelectValue placeholder={t("selectType")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inkjet">Inkjet</SelectItem>
                    <SelectItem value="Laser">Laser</SelectItem>
                    <SelectItem value="Thermal">Thermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">{t("ipAddress")}</Label><Input placeholder="192.168.1.200" value={ipAddress} onChange={e => setIpAddress(e.target.value)} /></div>
            </div>
          </div>
        )}

        {isNetwork && (
          <div className="kpi-card space-y-4">
            <h3 className="text-sm font-semibold">{t("specNetwork")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">{t("ipAddress")}</Label><Input placeholder="192.168.1.1" value={ipAddress} onChange={e => setIpAddress(e.target.value)} /></div>
            </div>
          </div>
        )}

        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold">{t("itemPhoto")}</h3>
          <ImageUpload bucket="item-images" folder="items" currentUrl={imageUrl || null} onUploaded={setImageUrl} onRemoved={() => setImageUrl("")} />
        </div>

        <div className="kpi-card space-y-4">
          <h3 className="text-sm font-semibold">{t("additionalInfo")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">{t("yearManufactured")}</Label><Input type="number" placeholder="2023" value={yearManufactured} onChange={e => setYearManufactured(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("yearAcquired")}</Label><Input type="number" placeholder="2023" value={yearAcquired} onChange={e => setYearAcquired(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("priceRp")}</Label><Input type="number" placeholder="10000000" value={price} onChange={e => setPrice(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("lastServiceDate")}</Label><Input type="date" value={lastServiceDate} onChange={e => setLastServiceDate(e.target.value)} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">{t("notes")}</Label><Textarea placeholder={t("additionalNotesPlaceholder")} rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/inventory")}>{t("cancel")}</Button>
          <Button type="submit" disabled={insertItem.isPending} className="gradient-primary text-primary-foreground border-0">
            <Save className="mr-2 h-4 w-4" /> {insertItem.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
