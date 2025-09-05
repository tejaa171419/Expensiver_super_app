import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Camera, X, Send, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast.error('Camera access denied');
      console.error('Error accessing camera:', error);
    }
  };
  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };
  const handlePayment = () => {
    if (!paymentAmount) {
      toast.error('Please enter payment amount');
      return;
    }

    // Simulate payment processing
    toast.success(`Payment of ₹${paymentAmount} initiated successfully!`);
    setPaymentAmount('');
    setPaymentNote('');
    setScannedData('');
    stopScanning();
  };
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);
  return <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-success" />
          QR Payment Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={startScanning}>
                <Camera className="h-4 w-4" />
                Scan QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan QR Code for Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {isScanning ? <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg bg-muted" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-2 border-success rounded-lg opacity-50" />
                    <Button onClick={stopScanning} className="absolute top-2 right-2" size="sm" variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div> : <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Camera will appear here</p>
                    </div>
                  </div>}
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input id="amount" type="number" placeholder="Enter amount" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="note">Payment Note (Optional)</Label>
                    <Input id="note" placeholder="Add a note" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} />
                  </div>
                  <Button onClick={handlePayment} className="w-full" disabled={!paymentAmount}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="flex items-center gap-2 text-slate-950">
            <CreditCard className="h-4 w-4" />
            Pay Bills
          </Button>
        </div>
        
        <div className="text-center p-4 bg-success/10 rounded-lg">
          <p className="text-sm text-success font-medium">Quick Payment Options</p>
          <p className="text-xs text-muted-foreground mt-1">Scan QR codes for instant payments</p>
        </div>
      </CardContent>
    </Card>;
};
export default QRScanner;