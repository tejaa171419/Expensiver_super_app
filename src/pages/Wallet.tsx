import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  Send, 
  Download, 
  Plus, 
  TrendingUp, 
  Eye, 
  EyeOff,
  QrCode,
  Smartphone,
  Users,
  History,
  Shield,
  Fingerprint,
  Camera,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRPaymentModal from "@/components/QRPaymentModal";
import ContactPayModal from "@/components/ContactPayModal";
import ExpenseManager from "@/components/ExpenseManager";

// Mock data
const mockTransactions = [
  {
    id: 1,
    type: "receive",
    amount: 2125.50,
    currency: "INR",
    from: "Alice Johnson",
    description: "Dinner split payment",
    date: "2024-01-15T14:30:00Z",
    status: "completed",
    method: "UPI"
  },
  {
    id: 2,
    type: "send",
    amount: 845.00,
    currency: "INR",
    to: "Bob Wilson",
    description: "Coffee reimbursement", 
    date: "2024-01-14T09:15:00Z",
    status: "completed",
    method: "Mobile Pay"
  },
  {
    id: 3,
    type: "deposit",
    amount: 15000.00,
    currency: "INR",
    description: "Bank transfer deposit",
    date: "2024-01-13T16:45:00Z",
    status: "completed",
    method: "Bank Transfer"
  },
  {
    id: 4,
    type: "send",
    amount: 3275.25,
    currency: "INR",
    to: "Weekend Trip Group",
    description: "Hotel booking share",
    date: "2024-01-12T11:20:00Z",
    status: "pending",
    method: "QR Code"
  }
];

const mockContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+91 98765-43210",
    email: "alice@email.com",
    upiId: "alice@paytm",
    lastTransaction: "₹2,125",
    isFrequent: true
  },
  {
    id: 2,
    name: "Bob Wilson",
    phone: "+91 87654-32109",
    email: "bob@email.com",
    upiId: "bob@gpay",
    lastTransaction: "₹845",
    isFrequent: true
  },
  {
    id: 3,
    name: "Carol Smith",
    phone: "+91 76543-21098",
    email: "carol@email.com",
    upiId: "carol@phonepe",
    lastTransaction: "₹500",
    isFrequent: false
  }
];

const quickActions = [
  { id: 1, name: "Scan QR", icon: QrCode, color: "bg-blue-500", action: "scan" },
  { id: 2, name: "Mobile Pay", icon: Smartphone, color: "bg-green-500", action: "mobile" },
  { id: 3, name: "UPI Pay", icon: Zap, color: "bg-purple-500", action: "upi" },
  { id: 4, name: "Contacts", icon: Users, color: "bg-orange-500", action: "contacts" },
  { id: 5, name: "Add Expense", icon: Plus, color: "bg-red-500", action: "expense" },
  { id: 6, name: "Bank Transfer", icon: ArrowUpRight, color: "bg-indigo-500", action: "bank" }
];

const paymentMethods = [
  {
    id: 1,
    type: "upi",
    identifier: "john@paytm",
    brand: "Paytm",
    isDefault: true
  },
  {
    id: 2,
    type: "card",
    last4: "4242",
    brand: "HDFC Bank Visa",
    isDefault: false
  },
  {
    id: 3,
    type: "bank",
    last4: "1234",
    brand: "State Bank of India",
    isDefault: false
  }
];

const Wallet = () => {
  const [balance, setBalance] = useState(24832.75);
  const [showBalance, setShowBalance] = useState(true);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [contactPayOpen, setContactPayOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const { toast } = useToast();

  const handleSendMoney = () => {
    if (!sendAmount || !recipient) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this transaction",
        variant: "destructive"
      });
      return;
    }

    setBalance(balance - amount);
    setSendAmount("");
    setRecipient("");
    toast({
      title: "Payment Successful!",
      description: `Successfully sent ₹${amount.toFixed(2)} to ${recipient}`
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "scan":
        setQrModalOpen(true);
        break;
      case "mobile":
        setPaymentMode("mobile");
        setActiveTab("send");
        break;
      case "upi":
        setPaymentMode("upi");
        setActiveTab("send");
        break;
      case "contacts":
        setContactPayOpen(true);
        break;
      case "expense":
        setActiveTab("expenses");
        break;
      case "bank":
        setPaymentMode("bank");
        setActiveTab("send");
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 mb-4 shadow-2xl">
            <WalletIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Zenith Wallet</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Fast, secure payments with UPI, QR codes, and instant transfers
          </p>
        </div>

        {/* Balance Card */}
        <Card className="glass-card bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/10">
                  <WalletIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Balance</p>
                  <p className="text-white text-xs">Last updated: just now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowBalance(!showBalance)} 
                  className="hover:bg-white/10 text-white"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-white/10 text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-white mb-2">
                {showBalance ? `₹${balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : "••••••••"}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+₹5,200 this month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="h-20 flex-col gap-2 hover:bg-white/10 text-white border border-white/20"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs">{action.name}</span>
                </Button>
              ))}
            </div>

            {/* Quick Balance Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveTab("send")}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">Overview</TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-white/20 text-white">Send Money</TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-white/20 text-white">Expenses</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">History</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTransactions.slice(0, 5).map(transaction => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center gap-4 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'receive' ? 'bg-green-500/20 text-green-400' : 
                          transaction.type === 'send' ? 'bg-red-500/20 text-red-400' : 
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {transaction.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> :
                           transaction.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> :
                           <Plus className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <span>
                                  {transaction.type === 'receive' ? `From ${transaction.from}` :
                                   transaction.type === 'send' ? `To ${transaction.to}` :
                                   'Bank deposit'}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {transaction.method}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`font-semibold ${
                                transaction.type === 'receive' || transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {transaction.type === 'receive' || transaction.type === 'deposit' ? '+' : '-'}
                                ₹{transaction.amount.toLocaleString('en-IN')}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-white/60">
                                {getStatusIcon(transaction.status)}
                                <span>{transaction.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Frequent Contacts */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Frequent Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockContacts.filter(c => c.isFrequent).map(contact => (
                      <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{contact.name}</p>
                          <p className="text-white/60 text-xs">{contact.lastTransaction}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paymentMethods.map(method => (
                      <div key={method.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/10">
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                          {method.type === 'upi' ? <Zap className="w-4 h-4 text-purple-400" /> : <CreditCard className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{method.brand}</p>
                          <p className="text-white/60 text-xs">
                            {method.type === 'upi' ? method.identifier : `••••${method.last4}`}
                          </p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Send Money Tab */}
          <TabsContent value="send" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Money
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant={paymentMode === 'upi' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setPaymentMode('upi')}
                      className={paymentMode === 'upi' 
                        ? 'bg-purple-500 hover:bg-purple-600' 
                        : 'border-white/30 text-white'
                      }
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      UPI
                    </Button>
                    <Button 
                      variant={paymentMode === 'mobile' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setPaymentMode('mobile')}
                      className={paymentMode === 'mobile' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'border-white/30 text-white'
                      }
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Mobile
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white font-medium">
                      {paymentMode === 'upi' ? 'UPI ID' : 'Mobile Number'}
                    </Label>
                    <Input 
                      placeholder={paymentMode === 'upi' ? 'user@paytm' : '+91 XXXXX XXXXX'} 
                      value={recipient} 
                      onChange={e => setRecipient(e.target.value)} 
                      className="border-white/30 focus:border-white bg-white/10 text-white placeholder:text-white/60" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Amount</Label>
                    <Input 
                      type="number" 
                      placeholder="₹ 0.00" 
                      value={sendAmount} 
                      onChange={e => setSendAmount(e.target.value)} 
                      className="border-white/30 focus:border-white bg-white/10 text-white placeholder:text-white/60" 
                    />
                  </div>
                  <Button onClick={handleSendMoney} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Send ₹{sendAmount || '0'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code Pay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setQrModalOpen(true)} 
                    className="w-full h-24 bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 text-white"
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <p>Scan QR Code</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expense Management Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <ExpenseManager 
              onExpenseAdded={(expense) => {
                // Update wallet balance based on expense
                if (expense.paidBy === 'You') {
                  setBalance(prevBalance => prevBalance - expense.amount);
                }
                toast({
                  title: "Expense Added!",
                  description: `₹${expense.amount} expense recorded for ${expense.description}`
                });
              }}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg border border-white/10 hover:bg-white/5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'receive' ? 'bg-green-500/20 text-green-400' : 
                        transaction.type === 'send' ? 'bg-red-500/20 text-red-400' : 
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {transaction.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> :
                         transaction.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> :
                         <Plus className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-white/60 text-sm">
                          {transaction.type === 'receive' ? `From ${transaction.from}` :
                           transaction.type === 'send' ? `To ${transaction.to}` :
                           'Bank deposit'} • {transaction.method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'receive' || transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'receive' || transaction.type === 'deposit' ? '+' : '-'}
                          ₹{transaction.amount.toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-white/60 text-xs">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Biometric Authentication</p>
                      <p className="text-white/60 text-sm">Use fingerprint for transactions</p>
                    </div>
                    <Button 
                      variant={biometricEnabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBiometricEnabled(!biometricEnabled)}
                    >
                      <Fingerprint className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Expense Notifications</p>
                      <p className="text-white/60 text-sm">Get alerts for budget limits</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Manage Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Method
                  </Button>
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Expense Categories
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* QR Payment Modal */}
        <QRPaymentModal 
          open={qrModalOpen} 
          onOpenChange={setQrModalOpen}
          onPaymentComplete={(data) => {
            console.log('QR Payment completed:', data);
          }}
        />

        {/* Contact Payment Modal */}
        <ContactPayModal 
          open={contactPayOpen} 
          onOpenChange={setContactPayOpen}
          onPaymentComplete={(data) => {
            console.log('Contact Payment completed:', data);
          }}
        />
      </div>
    </div>
  );
};

export default Wallet;