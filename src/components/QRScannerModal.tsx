import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scan, 
  Camera, 
  CameraOff,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRScannerModal = ({ isOpen, onClose }: QRScannerModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Simulate QR scanning since we don't have actual camera implementation
  const simulateQRScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    
    // Simulate scanning delay
    setTimeout(() => {
      const mockQRCodes = [
        "upi://pay?pa=user@paytm&pn=John%20Doe&am=500.00&cu=INR&tn=Payment",
        "https://zenith-wallet.app/pay/abc123",
        "EXPENSE_SPLIT:GROUP_ID_123:AMOUNT_250:TITLE_Lunch",
        "USER_ID:john_doe_123:PROFILE_SHARE",
        "PAYMENT:MERCHANT_ABC:AMOUNT_1500:DESC_Grocery"
      ];
      
      const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
      setScannedData(randomCode);
      setScanStatus('success');
      setIsScanning(false);
      
      toast({
        title: "QR Code Scanned! 📱",
        description: "Successfully detected QR code data",
      });
    }, 2000);
  };

  const startScanning = async () => {
    try {
      // In a real implementation, you would request camera access here
      // For now, we'll just simulate it
      setIsScanning(true);
      setScanStatus('scanning');
      
      setTimeout(() => {
        simulateQRScan();
      }, 500);
      
    } catch (error) {
      setHasCamera(false);
      setScanStatus('error');
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanStatus('idle');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const resetScanner = () => {
    setScannedData("");
    setScanStatus('idle');
    setIsScanning(false);
  };

  const handleQRAction = (data: string) => {
    if (data.startsWith("upi://")) {
      toast({
        title: "UPI Payment Detected",
        description: "Opening payment interface...",
      });
    } else if (data.includes("EXPENSE_SPLIT")) {
      toast({
        title: "Expense Split Request",
        description: "Processing group expense...",
      });
    } else if (data.includes("USER_ID")) {
      toast({
        title: "User Profile Shared",
        description: "Adding contact...",
      });
    } else {
      toast({
        title: "QR Code Processed",
        description: "Data has been processed successfully",
      });
    }
    onClose();
  };

  const getStatusColor = () => {
    switch (scanStatus) {
      case 'scanning': return 'text-warning';
      case 'success': return 'text-success';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (scanStatus) {
      case 'scanning': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Scan className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient-cyber">
            <Scan className="w-5 h-5" />
            QR Code Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera View */}
          <Card className="relative overflow-hidden bg-background/50">
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border">
              {!hasCamera ? (
                <div className="text-center space-y-4">
                  <CameraOff className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Camera not available</p>
                  <Button onClick={() => setHasCamera(true)} variant="outline" size="sm">
                    Retry Camera Access
                  </Button>
                </div>
              ) : isScanning ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-48 h-48 border-4 border-primary/30 rounded-2xl flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-primary rounded-xl animate-pulse">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <Scan className="w-8 h-8 text-primary animate-bounce" />
                        </div>
                      </div>
                    </div>
                    {/* Scanning line animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-ping"></div>
                    </div>
                  </div>
                  <p className="text-primary font-medium">Scanning for QR codes...</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Ready to scan QR codes</p>
                </div>
              )}
            </div>

            {/* Scanner overlay corners */}
            {isScanning && (
              <div className="absolute inset-4">
                <div className="w-full h-full relative">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary"></div>
                </div>
              </div>
            )}
          </Card>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-2", getStatusColor())}>
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {scanStatus === 'idle' && 'Ready to scan'}
                  {scanStatus === 'scanning' && 'Scanning...'}
                  {scanStatus === 'success' && 'QR code detected'}
                  {scanStatus === 'error' && 'Scanner error'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={cn(flashEnabled && "bg-warning text-warning-foreground")}
              >
                {flashEnabled ? 
                  <Flashlight className="w-4 h-4" /> : 
                  <FlashlightOff className="w-4 h-4" />
                }
              </Button>
              
              {scannedData && (
                <Button variant="outline" size="icon" onClick={resetScanner}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Scanned Result */}
          {scannedData && (
            <Card className="p-4 bg-success/10 border-success/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">QR Code Detected</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-mono bg-background/50 p-2 rounded text-muted-foreground break-all">
                    {scannedData}
                  </p>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {scannedData.startsWith("upi://") ? "UPI Payment" :
                       scannedData.includes("EXPENSE") ? "Expense Split" :
                       scannedData.includes("USER_ID") ? "User Profile" :
                       scannedData.startsWith("http") ? "Web Link" :
                       "Data"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Cancel
            </Button>
            
            {scannedData ? (
              <Button 
                onClick={() => handleQRAction(scannedData)}
                className="flex-1 btn-cyber"
              >
                Process QR Data
              </Button>
            ) : (
              <Button 
                onClick={isScanning ? stopScanning : startScanning}
                disabled={!hasCamera}
                className="flex-1 btn-cyber"
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerModal;