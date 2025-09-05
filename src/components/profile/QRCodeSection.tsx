import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Share2, Copy, Smartphone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
const QRCodeSection = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [selectedUPI, setSelectedUPI] = useState<string>("user@paytm");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [qrType, setQrType] = useState<"payment" | "profile">("payment");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock UPI accounts - in real app, this would come from context/state
  const upiAccounts = [{
    id: "user@paytm",
    name: "My Paytm",
    provider: "Paytm"
  }, {
    id: "user@gpay",
    name: "My GPay",
    provider: "Google Pay"
  }, {
    id: "user@phonepe",
    name: "My PhonePe",
    provider: "PhonePe"
  }];
  const generateQRCode = async () => {
    try {
      let qrData = "";
      if (qrType === "payment") {
        // UPI Payment QR Code format
        qrData = `upi://pay?pa=${selectedUPI}`;
        if (amount) qrData += `&am=${amount}`;
        if (note) qrData += `&tn=${encodeURIComponent(note)}`;
        qrData += `&cu=INR`;
      } else {
        // Profile QR Code - contains user information
        const profileData = {
          name: "User Name",
          // This would come from profile context
          upi: selectedUPI,
          phone: "+91-9876543210",
          // This would come from profile context
          type: "profile"
        };
        qrData = JSON.stringify(profileData);
      }
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#1f2937",
          light: "#ffffff"
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
      toast.success("QR Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR Code");
      console.error("QR Code generation error:", error);
    }
  };
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `${qrType}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success("QR Code downloaded!");
  };
  const shareQRCode = async () => {
    if (!qrCodeUrl) return;
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${qrType}-qr-code.png`, {
          type: "image/png"
        });
        await navigator.share({
          title: `My ${qrType === 'payment' ? 'Payment' : 'Profile'} QR Code`,
          files: [file]
        });
        toast.success("QR Code shared!");
      } catch (error) {
        // Fallback to copying link
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };
  const copyToClipboard = () => {
    if (qrCodeUrl) {
      // For web, we can copy the data URL or the UPI link
      let textToCopy = "";
      if (qrType === "payment") {
        textToCopy = `upi://pay?pa=${selectedUPI}`;
        if (amount) textToCopy += `&am=${amount}`;
        if (note) textToCopy += `&tn=${encodeURIComponent(note)}`;
        textToCopy += `&cu=INR`;
      } else {
        textToCopy = selectedUPI;
      }
      navigator.clipboard.writeText(textToCopy);
      toast.success("Link copied to clipboard!");
    }
  };
  useEffect(() => {
    if (selectedUPI) {
      generateQRCode();
    }
  }, [selectedUPI, amount, note, qrType]);
  return <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader className="bg-card/90 backdrop-blur-lg">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <QrCode className="w-5 h-5" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes for payments or share your profile information
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={qrType} onValueChange={value => setQrType(value as "payment" | "profile")}>
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/70">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment QR
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/70">
            <Smartphone className="w-4 h-4 mr-2" />
            Profile QR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Payment QR Code</CardTitle>
              <CardDescription>
                Generate a QR code for receiving payments via UPI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-select">Select UPI Account</Label>
                <Select value={selectedUPI} onValueChange={setSelectedUPI}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select UPI account" />
                  </SelectTrigger>
                  <SelectContent>
                    {upiAccounts.map(account => <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center space-x-2">
                          <span>{account.name}</span>
                          <span className="text-sm text-muted-foreground">({account.id})</span>
                        </div>
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Optional)</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input id="note" placeholder="Payment note" value={note} onChange={e => setNote(e.target.value)} className="bg-input border-border" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile QR Code</CardTitle>
              <CardDescription>
                Generate a QR code containing your profile information for easy sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-upi">Primary UPI ID</Label>
                <Select value={selectedUPI} onValueChange={setSelectedUPI}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select UPI account" />
                  </SelectTrigger>
                  <SelectContent>
                    {upiAccounts.map(account => <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center space-x-2">
                          <span>{account.name}</span>
                          <span className="text-sm text-muted-foreground">({account.id})</span>
                        </div>
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Display */}
      {qrCodeUrl && <Card className="glass-card">
          <CardHeader className="bg-card/90 backdrop-blur-lg">
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>
              {qrType === 'payment' ? 'Scan this QR code to make a payment' : 'Scan this QR code to get my contact information'}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-card/90 backdrop-blur-lg">
            <div className="flex flex-col items-center space-y-6">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
              </div>

              {/* QR Code Info */}
              <div className="text-center space-y-2">
                <p className="font-semibold text-card-foreground">
                  {qrType === 'payment' ? 'Payment QR Code' : 'Profile QR Code'}
                </p>
                <p className="text-sm text-muted-foreground">UPI ID: {selectedUPI}</p>
                {qrType === 'payment' && amount && <p className="text-sm text-muted-foreground">Amount: ₹{amount}</p>}
                {qrType === 'payment' && note && <p className="text-sm text-muted-foreground">Note: {note}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={downloadQRCode} variant="outline" className="text-zinc-950 bg-zinc-100">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={shareQRCode} variant="outline" className="text-zinc-950 bg-blue-600 hover:bg-blue-500">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="text-gray-950 bg-gray-50">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default QRCodeSection;