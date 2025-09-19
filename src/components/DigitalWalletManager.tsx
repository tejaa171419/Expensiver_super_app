import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Plus, 
  Minus, 
  CreditCard, 
  Smartphone, 
  Building2, 
  PiggyBank, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  BarChart3,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  reference: string;
  balanceAfter: number;
}

interface WalletAccount {
  id: string;
  name: string;
  type: 'primary' | 'savings' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  lastUpdated: Date;
  monthlyLimit: number;
  dailyLimit: number;
  usedMonthly: number;
  usedDaily: number;
}

interface BalanceAlert {
  id: string;
  type: 'low_balance' | 'spending_limit' | 'unusual_activity';
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
}

const DigitalWalletManager = () => {
  const [accounts, setAccounts] = useState<WalletAccount[]>([
    {
      id: 'primary',
      name: 'Primary Wallet',
      type: 'primary',
      balance: 24832.75,
      currency: 'INR',
      isActive: true,
      lastUpdated: new Date(),
      monthlyLimit: 100000,
      dailyLimit: 10000,
      usedMonthly: 45230,
      usedDaily: 2150
    },
    {
      id: 'savings',
      name: 'Savings Wallet',
      type: 'savings',
      balance: 156420.30,
      currency: 'INR',
      isActive: true,
      lastUpdated: new Date(),
      monthlyLimit: 50000,
      dailyLimit: 5000,
      usedMonthly: 12800,
      usedDaily: 0
    },
    {
      id: 'investment',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 89750.60,
      currency: 'INR',
      isActive: true,
      lastUpdated: new Date(),
      monthlyLimit: 200000,
      dailyLimit: 25000,
      usedMonthly: 35600,
      usedDaily: 0
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      type: 'credit',
      amount: 5000,
      description: 'Salary Credit',
      category: 'Income',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'SAL2024001',
      balanceAfter: 24832.75
    },
    {
      id: 'txn_002',
      type: 'debit',
      amount: 1250,
      description: 'Grocery Shopping',
      category: 'Food & Dining',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'completed',
      method: 'UPI',
      reference: 'UPI2024001',
      balanceAfter: 19832.75
    },
    {
      id: 'txn_003',
      type: 'debit',
      amount: 850,
      description: 'Movie Tickets',
      category: 'Entertainment',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'completed',
      method: 'QR Payment',
      reference: 'QR2024001',
      balanceAfter: 21082.75
    },
    {
      id: 'txn_004',
      type: 'credit',
      amount: 2500,
      description: 'Expense Settlement',
      category: 'Group Settlement',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'pending',
      method: 'P2P Transfer',
      reference: 'P2P2024001',
      balanceAfter: 21932.75
    }
  ]);

  const [alerts, setAlerts] = useState<BalanceAlert[]>([
    {
      id: 'alert_001',
      type: 'spending_limit',
      message: 'You have used 45% of your monthly spending limit',
      severity: 'warning',
      timestamp: new Date(),
      isRead: false
    },
    {
      id: 'alert_002',
      type: 'unusual_activity',
      message: 'Unusual spending pattern detected in Entertainment category',
      severity: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false
    }
  ]);

  const [showBalance, setShowBalance] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('primary');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const refreshBalances = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate balance updates
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      lastUpdated: new Date(),
      balance: acc.balance + (Math.random() - 0.5) * 100 // Small random change
    })));
    
    setIsRefreshing(false);
    toast.success("Balances updated successfully!");
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'primary': return <Wallet className="w-5 h-5" />;
      case 'savings': return <PiggyBank className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getSpendingProgress = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    return Math.min(percentage, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-success';
    if (percentage < 80) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header with Total Balance */}
      <Card className="glass-card bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Digital Wallet</h1>
                <p className="text-white/70 text-sm">Real-time balance tracking</p>
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
                onClick={refreshBalances}
                disabled={isRefreshing}
                className="hover:bg-white/10 text-white"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-white mb-2">
              {showBalance ? formatCurrency(totalBalance) : "••••••••"}
            </p>
            <p className="text-white/70">Total Balance Across All Accounts</p>
          </div>

          {/* Account Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {accounts.map(account => (
              <Card 
                key={account.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedAccount === account.id 
                    ? 'glass-card border-primary bg-primary/10' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      account.type === 'primary' ? 'bg-blue-500/20' :
                      account.type === 'savings' ? 'bg-green-500/20' : 'bg-purple-500/20'
                    }`}>
                      {getAccountIcon(account.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{account.name}</h3>
                      <p className="text-white/70 text-xs">
                        {showBalance ? formatCurrency(account.balance) : "••••••"}
                      </p>
                    </div>
                  </div>
                  {account.isActive && (
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                      Active
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.filter(alert => !alert.isRead).length > 0 && (
        <div className="space-y-2">
          {alerts.filter(alert => !alert.isRead).map(alert => (
            <Alert 
              key={alert.id} 
              className={`border-l-4 ${
                alert.severity === 'error' ? 'border-l-destructive bg-destructive/5' :
                alert.severity === 'warning' ? 'border-l-warning bg-warning/5' :
                'border-l-info bg-info/5'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAlerts(prev => 
                    prev.map(a => a.id === alert.id ? {...a, isRead: true} : a)
                  )}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Account Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAccountIcon(currentAccount.type)}
                  {currentAccount.name}
                </CardTitle>
                <CardDescription>
                  Last updated: {currentAccount.lastUpdated.toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {showBalance ? formatCurrency(currentAccount.balance) : "••••••••"}
                  </p>
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-success">
                      +{formatCurrency(5000)}
                    </p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-destructive">
                      -{formatCurrency(2100)}
                    </p>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-success/20' : 'bg-destructive/20'
                        }`}>
                          {transaction.type === 'credit' ? 
                            <ArrowDownLeft className="w-4 h-4 text-success" /> :
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs text-muted-foreground">
                            {transaction.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Complete transaction log with real-time updates</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'credit' ? 'bg-success/20' : 'bg-destructive/20'
                      }`}>
                        {transaction.type === 'credit' ? 
                          <ArrowDownLeft className="w-5 h-5 text-success" /> :
                          <ArrowUpRight className="w-5 h-5 text-destructive" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.method}</span>
                          <span>•</span>
                          <span>{transaction.reference}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {transaction.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className="text-sm capitalize">{transaction.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Balance: {formatCurrency(transaction.balanceAfter)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Spending Limits & Usage</CardTitle>
              <CardDescription>Monitor your spending against set limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Daily Limits */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Daily Limits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Spending</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(currentAccount.usedDaily)} / {formatCurrency(currentAccount.dailyLimit)}
                    </span>
                  </div>
                  <Progress 
                    value={getSpendingProgress(currentAccount.usedDaily, currentAccount.dailyLimit)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(currentAccount.dailyLimit - currentAccount.usedDaily)} remaining today
                  </p>
                </div>
              </div>

              {/* Monthly Limits */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Monthly Limits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Spending</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(currentAccount.usedMonthly)} / {formatCurrency(currentAccount.monthlyLimit)}
                    </span>
                  </div>
                  <Progress 
                    value={getSpendingProgress(currentAccount.usedMonthly, currentAccount.monthlyLimit)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(currentAccount.monthlyLimit - currentAccount.usedMonthly)} remaining this month
                  </p>
                </div>
              </div>

              {/* Limit Alerts */}
              <Alert className="border-warning bg-warning/5">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  You've used 45% of your monthly limit. Consider monitoring your spending to stay within budget.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalWalletManager;