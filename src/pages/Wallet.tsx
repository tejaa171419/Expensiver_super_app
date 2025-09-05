import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet as WalletIcon, CreditCard, Send, Download, Plus, TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockTransactions = [
  {
    id: 1,
    type: "receive",
    amount: 125.50,
    currency: "USD",
    from: "Alice Johnson",
    description: "Dinner split payment",
    date: "2024-01-15T14:30:00Z",
    status: "completed"
  },
  {
    id: 2,
    type: "send",
    amount: 45.00,
    currency: "USD",
    to: "Bob Wilson",
    description: "Coffee reimbursement",
    date: "2024-01-14T09:15:00Z",
    status: "completed"
  },
  {
    id: 3,
    type: "deposit",
    amount: 500.00,
    currency: "USD",
    description: "Bank transfer deposit",
    date: "2024-01-13T16:45:00Z",
    status: "completed"
  },
  {
    id: 4,
    type: "send",
    amount: 75.25,
    currency: "USD",
    to: "Weekend Trip Group",
    description: "Hotel booking share",
    date: "2024-01-12T11:20:00Z",
    status: "pending"
  }
];

const paymentMethods = [
  {
    id: 1,
    type: "card",
    last4: "4242",
    brand: "Visa",
    isDefault: true
  },
  {
    id: 2,
    type: "card",
    last4: "8888",
    brand: "Mastercard",
    isDefault: false
  },
  {
    id: 3,
    type: "bank",
    last4: "1234",
    brand: "Chase Bank",
    isDefault: false
  }
];

const Wallet = () => {
  const [balance, setBalance] = useState(432.75);
  const [showBalance, setShowBalance] = useState(true);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
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
      title: "Money Sent!",
      description: `Successfully sent $${amount.toFixed(2)} to ${recipient}`
    });
  };

  const handleDeposit = () => {
    if (!depositAmount) {
      toast({
        title: "Error",
        description: "Please enter an amount to deposit",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    setBalance(balance + amount);
    setDepositAmount("");
    toast({
      title: "Deposit Successful!",
      description: `Added $${amount.toFixed(2)} to your wallet`
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
            <WalletIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">My Wallet</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Manage your money, send payments, and track your transaction history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card bg-gradient-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary flex items-center gap-2">
                    <WalletIcon className="w-6 h-6" />
                    Wallet Balance
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowBalance(!showBalance)} 
                    className="hover:bg-primary/10"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">
                      {showBalance ? `$${balance.toFixed(2)}` : "••••••"}
                    </p>
                    <p className="text-primary/80">Available Balance</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Button className="bg-primary hover:bg-primary-dark text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Send Money */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Money
                  </CardTitle>
                  <CardDescription>Send money to friends or groups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-primary font-medium">Recipient</Label>
                    <Input 
                      id="recipient" 
                      placeholder="Email or username" 
                      value={recipient} 
                      onChange={e => setRecipient(e.target.value)} 
                      className="border-primary/30 focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="send-amount" className="text-primary font-medium">Amount</Label>
                    <Input 
                      id="send-amount" 
                      type="number" 
                      placeholder="0.00" 
                      value={sendAmount} 
                      onChange={e => setSendAmount(e.target.value)} 
                      className="border-primary/30 focus:border-primary" 
                    />
                  </div>
                  <Button onClick={handleSendMoney} className="w-full bg-gradient-primary hover:bg-primary text-white">
                    Send Money
                  </Button>
                </CardContent>
              </Card>

              {/* Add Money */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Money
                  </CardTitle>
                  <CardDescription>Deposit money to your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount" className="text-primary font-medium">Amount</Label>
                    <Input 
                      id="deposit-amount" 
                      type="number" 
                      placeholder="0.00" 
                      value={depositAmount} 
                      onChange={e => setDepositAmount(e.target.value)} 
                      className="border-primary/30 focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-primary font-medium">Payment Method</Label>
                    <Select defaultValue="card1">
                      <SelectTrigger className="border-primary/30 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card1">Visa ••••4242</SelectItem>
                        <SelectItem value="card2">Mastercard ••••8888</SelectItem>
                        <SelectItem value="bank1">Chase Bank ••••1234</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleDeposit} className="w-full bg-gradient-primary hover:bg-primary text-white">
                    Add Money
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map(transaction => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'receive' ? 'bg-success text-white' : 
                        transaction.type === 'send' ? 'bg-primary text-white' : 
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {transaction.type === 'receive' ? <TrendingUp className="w-5 h-5" /> :
                         transaction.type === 'send' ? <Send className="w-5 h-5" /> :
                         <Plus className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-card-foreground">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.type === 'receive' ? `From ${transaction.from}` :
                               transaction.type === 'send' ? `To ${transaction.to}` :
                               'Bank deposit'}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'receive' || transaction.type === 'deposit' ? 'text-success' : 'text-destructive'
                            }`}>
                              {transaction.type === 'receive' || transaction.type === 'deposit' ? '+' : '-'}
                              ${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'} 
                        className={transaction.status === 'completed' ? 'bg-success text-white' : ''}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center gap-3 p-3 rounded-lg border border-primary/20">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{method.brand}</p>
                      <p className="text-sm text-muted-foreground">••••{method.last4}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline" className="border-primary text-primary text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Money Sent:</span>
                    <span className="font-medium text-destructive">-$245.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Money Received:</span>
                    <span className="font-medium text-success">+$125.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposits:</span>
                    <span className="font-medium text-success">+$500.00</span>
                  </div>
                  <hr className="border-primary/20" />
                  <div className="flex justify-between">
                    <span className="font-medium text-card-foreground">Net Change:</span>
                    <span className="font-bold text-success">+$379.75</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;