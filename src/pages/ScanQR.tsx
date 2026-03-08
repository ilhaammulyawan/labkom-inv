import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, ScanLine } from "lucide-react";

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScanSuccess = (decodedText: string) => {
    // Stop scanner first
    stopScanner();

    try {
      const url = new URL(decodedText);
      const match = url.pathname.match(/\/item\/(.+)/);
      if (match) {
        navigate(`/inventory/${match[1]}`);
        return;
      }
    } catch {
      // Not a URL, try as raw ID
    }

    // Try as raw item ID
    if (decodedText.startsWith("item-")) {
      navigate(`/inventory/${decodedText}`);
      return;
    }

    setError(`QR Code tidak dikenali: ${decodedText}`);
  };

  const startScanner = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {} // ignore scan failures
      );
      setScanning(true);
    } catch (err: any) {
      setError(
        err?.message?.includes("NotAllowed")
          ? "Akses kamera ditolak. Izinkan akses kamera di pengaturan browser."
          : "Gagal mengakses kamera. Pastikan perangkat memiliki kamera."
      );
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Scan QR Code</h1>
        <p className="text-sm text-muted-foreground">Arahkan kamera ke QR Code barang inventaris</p>
      </div>

      <div className="kpi-card overflow-hidden">
        <div
          id="qr-reader"
          ref={containerRef}
          className="w-full aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center relative"
        >
          {!scanning && !error && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <ScanLine className="h-12 w-12" />
              <p className="text-sm">Tekan tombol untuk mulai scan</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
            {error}
          </div>
        )}

        <div className="mt-4">
          {!scanning ? (
            <Button onClick={startScanner} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Mulai Scan
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="outline" className="w-full">
              <CameraOff className="mr-2 h-4 w-4" /> Berhenti
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
