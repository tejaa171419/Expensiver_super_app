import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle, Smartphone, Wallet, Building2, Phone, Zap, Shield, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
// Enhanced UPI provider detection and validation
const UPI_PROVIDERS = {
  'paytm': {
    name: 'Paytm',
    icon: '💳',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    website: 'https://paytm.com'
  },
  'gpay': {
    name: 'Google Pay',
    icon: '🎯',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    website: 'https://pay.google.com'
  },
  'phonepe': {
    name: 'PhonePe',
    icon: '📱',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    website: 'https://phonepe.com'
  },
  'amazonpay': {
    name: 'Amazon Pay',
    icon: '🛒',
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
    website: 'https://amazonpay.in'
  },
  'mobikwik': {
    name: 'MobiKwik',
    icon: '💰',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    website: 'https://mobikwik.com'
  },
  'freecharge': {
    name: 'Freecharge',
    icon: '⚡',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgLight: 'bg-yellow-50',
    website: 'https://freecharge.in'
  },
  'olamoney': {
    name: 'Ola Money',
    icon: '🚗',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    website: 'https://olamoney.com'
  },
  'airtel': {
    name: 'Airtel Money',
    icon: '📶',
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
    bgLight: 'bg-pink-50',
    website: 'https://airtel.in'
  },
  'jio': {
    name: 'JioMoney',
    icon: '🌐',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    website: 'https://jio.com'
  },
  'ybl': {
    name: 'Yes Bank',
    icon: '🏦',
    color: 'bg-slate-500',
    textColor: 'text-slate-600',
    bgLight: 'bg-slate-50',
    website: 'https://yesbank.in'
  },
  'icici': {
    name: 'ICICI Bank',
    icon: '🏛️',
    color: 'bg-blue-600',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    website: 'https://icicibank.com'
  },
  'axis': {
    name: 'Axis Bank',
    icon: '🏢',
    color: 'bg-red-600',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    website: 'https://axisbank.com'
  },
  'sbi': {
    name: 'State Bank of India',
    icon: '🇮🇳',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    website: 'https://sbi.co.in'
  },
  'hdfc': {
    name: 'HDFC Bank',
    icon: '🏪',
    color: 'bg-blue-700',
    textColor: 'text-blue-800',
    bgLight: 'bg-blue-50',
    website: 'https://hdfcbank.com'
  }
};

const upiSchema = z.object({
  upiId: z.string()
    .min(1, "UPI ID is required")
    .regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Please enter a valid UPI ID format (e.g., yourname@paytm)")
    .refine((value) => {
      const provider = value.split('@')[1]?.toLowerCase();
      return provider && Object.keys(UPI_PROVIDERS).includes(provider);
    }, "UPI provider not supported. Please use a supported provider."),
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long")
});
type UPIFormData = z.infer<typeof upiSchema>;
interface UPIAccount {
  id: string;
  upiId: string;
  displayName: string;
  isVerified: boolean;
  isPrimary: boolean;
  provider: string;
  providerInfo: {
    name: string;
    icon: string;
    color: string;
    textColor: string;
    bgLight: string;
    website: string;
  };
  verificationStatus: 'pending' | 'verifying' | 'verified' | 'failed';
  lastVerified?: Date;
  transactionCount?: number;
  isActive: boolean;
}
const UPIManagement = () => {
  const [upiAccounts, setUpiAccounts] = useState<UPIAccount[]>([{
    id: "1",
    upiId: "user@paytm",
    displayName: "My Paytm",
    isVerified: true,
    isPrimary: true,
    provider: "paytm",
    providerInfo: UPI_PROVIDERS.paytm,
    verificationStatus: 'verified',
    lastVerified: new Date(),
    transactionCount: 45,
    isActive: true
  }]);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [showAddForm, setShowAddForm] = useState(false);
  const form = useForm<UPIFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: "",
      displayName: ""
    }
  });
  const onSubmit = async (data: UPIFormData) => {
    const provider = data.upiId.split('@')[1].toLowerCase();
    const providerInfo = UPI_PROVIDERS[provider as keyof typeof UPI_PROVIDERS];
    
    const newUPI: UPIAccount = {
      id: Date.now().toString(),
      upiId: data.upiId,
      displayName: data.displayName,
      isVerified: false,
      isPrimary: upiAccounts.length === 0,
      provider: provider,
      providerInfo: providerInfo,
      verificationStatus: 'pending',
      transactionCount: 0,
      isActive: true
    };
    
    setUpiAccounts([...upiAccounts, newUPI]);
    setShowAddForm(false);
    form.reset();
    setValidationStatus('idle');
    
    toast.success(`${providerInfo.name} UPI ID added successfully!`, {
      description: "You can now use this UPI ID for payments. Verify it for secure transactions."
    });
    
    // Auto-trigger verification for new UPI
    setTimeout(() => {
      verifyUPI(newUPI.id);
    }, 1000);
  };
  const deleteUPI = (id: string) => {
    setUpiAccounts(upiAccounts.filter(upi => upi.id !== id));
    toast.success("UPI ID removed successfully!");
  };
  const setPrimary = (id: string) => {
    setUpiAccounts(upiAccounts.map(upi => ({
      ...upi,
      isPrimary: upi.id === id
    })));
    toast.success("Primary UPI ID updated!");
  };
  const verifyUPI = async (id: string) => {
    setIsVerifying(id);
    
    setUpiAccounts(prev => prev.map(upi => upi.id === id ? {
      ...upi,
      verificationStatus: 'verifying'
    } : upi));
    
    try {
      // Simulate real-time verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random verification success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      setUpiAccounts(prev => prev.map(upi => upi.id === id ? {
        ...upi,
        isVerified: isSuccess,
        verificationStatus: isSuccess ? 'verified' : 'failed',
        lastVerified: isSuccess ? new Date() : upi.lastVerified
      } : upi));
      
      if (isSuccess) {
        const upi = upiAccounts.find(u => u.id === id);
        toast.success(`${upi?.providerInfo.name} UPI ID verified successfully! 🎉`, {
          description: "Your UPI ID is now ready for secure transactions."
        });
      } else {
        toast.error("Verification failed", {
          description: "Please check your UPI ID and try again."
        });
      }
    } catch (error) {
      setUpiAccounts(prev => prev.map(upi => upi.id === id ? {
        ...upi,
        verificationStatus: 'failed'
      } : upi));
      
      toast.error("Verification error", {
        description: "Network error occurred. Please try again later."
      });
    } finally {
      setIsVerifying(null);
    }
  };
  const getProviderIcon = (providerInfo: any) => {
    return (
      <div className="flex items-center justify-center w-full h-full text-white font-bold text-lg">
        {providerInfo.icon}
      </div>
    );
  };
  
  const validateUPIRealTime = async (upiId: string) => {
    if (!upiId || !upiId.includes('@')) {
      setValidationStatus('idle');
      return;
    }
    
    setValidationStatus('checking');
    
    // Simulate real-time validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const provider = upiId.split('@')[1]?.toLowerCase();
    const isValidProvider = provider && Object.keys(UPI_PROVIDERS).includes(provider);
    const isValidFormat = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
    
    setValidationStatus(isValidProvider && isValidFormat ? 'valid' : 'invalid');
  };
  
  // Real-time UPI validation on input change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.upiId) {
        validateUPIRealTime(value.upiId);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  return <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <CreditCard className="w-5 h-5" />
            UPI Management
          </CardTitle>
          <CardDescription>
            Manage your UPI IDs for seamless payments and money transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-accent/10 border-accent/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your UPI IDs are used for receiving payments and splitting expenses. 
              Make sure to verify them for secure transactions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* UPI Accounts List */}
      <div className="space-y-4">
        {upiAccounts.map(upi => <Card key={upi.id} className="glass-card">
            <CardContent className="p-6 bg-card/90 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`relative flex items-center justify-center w-12 h-12 ${upi.providerInfo.color} rounded-full shadow-lg transition-all duration-300 hover:scale-105`}>
                    {getProviderIcon(upi.providerInfo)}
                    {upi.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-card-foreground">{upi.displayName}</h3>
                      {upi.isPrimary && <Badge variant="default" className="bg-primary text-primary-foreground">Primary</Badge>}
                      
                      {upi.verificationStatus === 'verified' && (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      {upi.verificationStatus === 'verifying' && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Verifying...
                        </Badge>
                      )}
                      
                      {upi.verificationStatus === 'pending' && (
                        <Badge variant="outline" className="border-warning text-warning">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      
                      {upi.verificationStatus === 'failed' && (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground font-mono">{upi.upiId}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`font-medium ${upi.providerInfo.textColor}`}>{upi.providerInfo.name}</span>
                        {upi.transactionCount !== undefined && (
                          <>
                            <span>•</span>
                            <span>{upi.transactionCount} transactions</span>
                          </>
                        )}
                        {upi.lastVerified && (
                          <>
                            <span>•</span>
                            <span>Verified {upi.lastVerified.toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {upi.verificationStatus !== 'verified' && upi.verificationStatus !== 'verifying' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => verifyUPI(upi.id)}
                      disabled={isVerifying === upi.id}
                      className="border-success text-success hover:bg-success/10"
                    >
                      {isVerifying === upi.id ? (
                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Verifying</>
                      ) : (
                        <><Shield className="w-3 h-3 mr-1" />Verify</>
                      )}
                    </Button>
                  )}
                  
                  {!upi.isPrimary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPrimary(upi.id)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Set Primary
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(upi.providerInfo.website, '_blank')}
                    className="border-muted text-muted-foreground hover:bg-muted/10"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteUPI(upi.id)} 
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    disabled={upi.isPrimary}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Add New UPI Form */}
      {showAddForm ? <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add New UPI ID</CardTitle>
            <CardDescription>
              Enter your UPI ID and a display name for easy identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="upiId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      UPI ID *
                      {validationStatus === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {validationStatus === 'valid' && <CheckCircle className="w-3 h-3 text-success" />}
                      {validationStatus === 'invalid' && <AlertCircle className="w-3 h-3 text-destructive" />}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="yourname@paytm" 
                          {...field} 
                          className={`pr-20 ${
                            validationStatus === 'valid' ? 'border-success focus:border-success' :
                            validationStatus === 'invalid' ? 'border-destructive focus:border-destructive' :
                            'border-input'
                          }`}
                        />
                        {validationStatus === 'checking' && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        {validationStatus === 'valid' && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                        )}
                        {validationStatus === 'invalid' && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    
                    {/* Provider detection preview */}
                    {field.value && field.value.includes('@') && validationStatus === 'valid' && (
                      <div className="mt-2 p-2 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-6 h-6 ${UPI_PROVIDERS[field.value.split('@')[1]?.toLowerCase() as keyof typeof UPI_PROVIDERS]?.color} rounded flex items-center justify-center text-white text-xs`}>
                            {UPI_PROVIDERS[field.value.split('@')[1]?.toLowerCase() as keyof typeof UPI_PROVIDERS]?.icon}
                          </div>
                          <span className="font-medium">
                            Detected: {UPI_PROVIDERS[field.value.split('@')[1]?.toLowerCase() as keyof typeof UPI_PROVIDERS]?.name}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <FormMessage />
                    
                    {/* Supported providers info */}
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p className="mb-1">Supported providers:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(UPI_PROVIDERS).slice(0, 6).map(([key, provider]) => (
                          <span key={key} className={`inline-flex items-center gap-1 px-2 py-1 rounded ${provider.bgLight} ${provider.textColor}`}>
                            <span>{provider.icon}</span>
                            <span>{provider.name}</span>
                          </span>
                        ))}
                        {Object.keys(UPI_PROVIDERS).length > 6 && (
                          <span className="px-2 py-1 text-muted-foreground">+{Object.keys(UPI_PROVIDERS).length - 6} more</span>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="displayName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="My PayTM UPI" 
                        {...field} 
                        maxLength={50}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Choose a name to identify this UPI ID</span>
                      <span>{field.value?.length || 0}/50</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary-dark" 
                    disabled={validationStatus !== 'valid'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add UPI ID
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      form.reset();
                      setValidationStatus('idle');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card> : <Button onClick={() => setShowAddForm(true)} className="w-full bg-primary hover:bg-primary-dark" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New UPI ID
        </Button>}
    </div>;
};
export default UPIManagement;