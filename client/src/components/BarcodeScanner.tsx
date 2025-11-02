import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, X, CheckCircle } from 'lucide-react';

interface ScanResult {
  decodedText: string;
  result: any;
}

interface Food {
  food_id: string;
  barcode: string;
  name: string;
  brand?: string;
  serving_sizes: Array<{ label: string; grams: number }>;
  nutr_per_serving: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
  };
  verified: boolean;
  source: string;
}

interface BarcodeScannerProps {
  onFoodFound: (food: Food) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onFoodFound, onClose, isLoading = false }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const scannerRef = useRef<HTMLDivElement>(null);

  // Initialize scanner
  useEffect(() => {
    if (!scanning || !scannerRef.current) return;

    const html5QrCodeScanner = new Html5QrcodeScanner(
      "barcode-scanner",
      {
        fps: 10,
        qrbox: { width: 280, height: 120 },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false // verbose logging
    );

    const onScanSuccess = async (decodedText: string, decodedResult: any) => {
      console.log("📱 Barcode scanned:", decodedText);
      setError(null);
      
      try {
        // Normalize barcode (remove spaces, leading zeros)
        const normalizedBarcode = decodedText.replace(/\s+/g, '').replace(/^0+/, '');
        
        // Look up the barcode
        const response = await fetch(`/api/barcode/${encodeURIComponent(normalizedBarcode)}`);
        
        if (response.ok) {
          const food = await response.json();
          console.log("✅ Food found:", food);
          
          // Stop scanner and pass food data
          html5QrCodeScanner.clear();
          setScanning(false);
          onFoodFound(food);
        } else if (response.status === 404) {
          const errorData = await response.json();
          setError(`Product not found in database: ${decodedText}`);
          console.log("❌ Product not found:", errorData);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } catch (err) {
        console.error("❌ Barcode lookup failed:", err);
        setError(`Failed to lookup barcode: ${err.message}`);
      }
    };

    const onScanFailure = (error: string) => {
      // Silent fail for scan attempts - this is normal
      if (!error.includes("NotFoundException")) {
        console.warn("Scan attempt failed:", error);
      }
    };

    html5QrCodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrCodeScanner);

    return () => {
      if (html5QrCodeScanner) {
        try {
          html5QrCodeScanner.clear();
        } catch (e) {
          console.warn("Scanner cleanup error:", e);
        }
      }
    };
  }, [scanning, onFoodFound]);

  // Check camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraPermission('denied');
          setError('Camera not supported on this device');
          return;
        }

        // Try to get camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Prefer back camera
        });
        
        // Success - stop the stream and set permission
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission('granted');
      } catch (err) {
        console.error("Camera permission error:", err);
        setCameraPermission('denied');
        setError('Camera access denied. Please enable camera permissions.');
      }
    };

    checkCameraPermission();
  }, []);

  const startScanning = () => {
    if (cameraPermission === 'granted') {
      setScanning(true);
      setError(null);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/30 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Scan Barcode
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Camera Permission Status */}
          {cameraPermission === 'pending' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Checking camera access...</span>
            </div>
          )}

          {cameraPermission === 'denied' && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-4">Camera access is required to scan barcodes</div>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
            </div>
          )}

          {/* Scanner UI */}
          {cameraPermission === 'granted' && !scanning && (
            <div className="text-center space-y-4">
              <div className="text-gray-300">
                Point your camera at a product barcode to scan it
              </div>
              <Button onClick={startScanning} className="bg-blue-600 hover:bg-blue-700">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {/* Active Scanner */}
          {scanning && (
            <div className="space-y-4">
              <div 
                id="barcode-scanner" 
                ref={scannerRef}
                className="w-full rounded-lg overflow-hidden"
              />
              <div className="flex justify-center">
                <Button 
                  onClick={stopScanning}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
              <span className="text-white">Looking up product...</span>
            </div>
          )}

          {/* Supported Formats */}
          <div className="text-center text-xs text-gray-400">
            <div className="mb-2">Supported formats:</div>
            <div className="flex flex-wrap justify-center gap-1">
              {['UPC-A', 'UPC-E', 'EAN-13', 'EAN-8', 'Code 128', 'Code 39', 'QR Code'].map(format => (
                <Badge key={format} variant="outline" className="text-gray-400 border-gray-600">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;