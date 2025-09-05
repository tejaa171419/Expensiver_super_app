import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
const upiSchema = z.object({
  upiId: z.string().min(1, "UPI ID is required").regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Please enter a valid UPI ID"),
  displayName: z.string().min(1, "Display name is required")
});
type UPIFormData = z.infer<typeof upiSchema>;
interface UPIAccount {
  id: string;
  upiId: string;
  displayName: string;
  isVerified: boolean;
  isPrimary: boolean;
  provider: string;
}
const UPIManagement = () => {
  const [upiAccounts, setUpiAccounts] = useState<UPIAccount[]>([{
    id: "1",
    upiId: "user@paytm",
    displayName: "My Paytm",
    isVerified: true,
    isPrimary: true,
    provider: "Paytm"
  }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const form = useForm<UPIFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: "",
      displayName: ""
    }
  });
  const onSubmit = (data: UPIFormData) => {
    const provider = data.upiId.split('@')[1];
    const newUPI: UPIAccount = {
      id: Date.now().toString(),
      upiId: data.upiId,
      displayName: data.displayName,
      isVerified: false,
      isPrimary: upiAccounts.length === 0,
      provider: provider.charAt(0).toUpperCase() + provider.slice(1)
    };
    setUpiAccounts([...upiAccounts, newUPI]);
    setShowAddForm(false);
    form.reset();
    toast.success("UPI ID added successfully!");
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
  const verifyUPI = (id: string) => {
    // Simulate verification process
    setUpiAccounts(upiAccounts.map(upi => upi.id === id ? {
      ...upi,
      isVerified: true
    } : upi));
    toast.success("UPI ID verified successfully!");
  };
  const getProviderIcon = (provider: string) => {
    // You can add specific icons for different providers
    return <Smartphone className="w-5 h-5" />;
  };
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
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                    {getProviderIcon(upi.provider)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{upi.displayName}</h3>
                      {upi.isPrimary && <Badge variant="default">Primary</Badge>}
                      {upi.isVerified ? <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge> : <Badge variant="outline">Unverified</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{upi.upiId}</p>
                    <p className="text-xs text-muted-foreground">{upi.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!upi.isVerified && <Button variant="outline" size="sm" onClick={() => verifyUPI(upi.id)}>
                      Verify
                    </Button>}
                  {!upi.isPrimary && <Button variant="outline" size="sm" onClick={() => setPrimary(upi.id)}>
                      Set Primary
                    </Button>}
                  <Button variant="outline" size="sm" onClick={() => deleteUPI(upi.id)} className="text-gray-950 bg-yellow-50">
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
                <FormField control={form.control} name="upiId" render={({
              field
            }) => <FormItem>
                      <FormLabel>UPI ID *</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@paytm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.control} name="displayName" render={({
              field
            }) => <FormItem>
                      <FormLabel>Display Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="My PayTM UPI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-primary hover:bg-primary-dark">
                    Add UPI ID
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                setShowAddForm(false);
                form.reset();
              }}>
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