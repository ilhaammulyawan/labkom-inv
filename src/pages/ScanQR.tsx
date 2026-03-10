import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, ScanLine } from "lucide-react";

const ScanQR = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScanSuccess = (decodedText: string) => {
    stopScanner();
    try { const url = new URL(decodedText); const match = url.pathname.match(/\/item\/(.+)/); if (match) { navigate(`/inventory/${match[1]}`); return; } } catch {}
    if (decodedText.startsWith("item-")) { navigate(`/inventory/${decodedText}`); return; }
    setError(`${t("qrNotRecognized")}: ${decodedText}`);
  };

  const startScanner = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, handleScanSuccess, () => {});
      setScanning(true);
    } catch (err: any) {
      setError(err?.message?.includes("NotAllowed") ? t("cameraAccessDenied") : t("cameraAccessFailed"));
    }
  };

  const stopScanner = async () => { if (scannerRef.current?.isScanning) { await scannerRef.current.stop(); } scannerRef.current = null; setScanning(false); };
  useEffect(() => { return () => { stopScanner(); }; }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      <div><h1 className="text-xl font-bold tracking-tight">{t("scanQRTitle")}</h1><p className="text-sm text-muted-foreground">{t("scanQRDesc")}</p></div>
      <div className="kpi-card overflow-hidden">
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted relative">
          {!scanning && !error && (<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground z-10"><ScanLine className="h-12 w-12" /><p className="text-sm">{t("pressToScan")}</p></div>)}
          <div id="qr-reader" ref={containerRef} className="w-full h-full" />
        </div>
        {error && (<div className="mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">{error}</div>)}
        <div className="mt-4">
          {!scanning ? (<Button onClick={startScanner} className="w-full"><Camera className="mr-2 h-4 w-4" /> {t("startScan")}</Button>) : (<Button onClick={stopScanner} variant="outline" className="w-full"><CameraOff className="mr-2 h-4 w-4" /> {t("stopScan")}</Button>)}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
