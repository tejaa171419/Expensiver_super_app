import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import ExpenseCard from "@/components/ExpenseCard";
import QuickActions from "@/components/QuickActions";
import ExpenseChart from "@/components/ExpenseChart";
import QRScanner from "@/components/QRScanner";
import PersonalPaymentHistory from "@/components/PersonalPaymentHistory";
import MoneyManagement from "@/components/MoneyManagement";
import AdvancedInsights from "@/components/AdvancedInsights";
import ResponsiveTable, { ResponsiveTableRow } from "@/components/ResponsiveTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, TrendingDown, Users, Calendar, Search, Filter, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface DashboardProps {
  mode?: 'group' | 'personal';
  onAddExpense?: () => void;
  onSendMoney?: () => void;
  onScanQR?: () => void;
  onCalculate?: () => void;
}
const Dashboard = ({
  mode = 'group',
  onAddExpense,
  onSendMoney,
  onScanQR,
  onCalculate
}: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Enhanced Mock Data with realistic scenarios
  const statsData = {
    group: [{
      title: "Outstanding Balance",
      value: "₹3,840",
      icon: Wallet,
      trend: {
        value: -18.2,
        label: "reduced this month"
      },
      color: 'success' as const
    }, {
      title: "You Owe",
      value: "₹1,250",
      icon: TrendingDown,
      trend: {
        value: 5.8,
        label: "vs last month"
      },
      color: 'destructive' as const
    }, {
      title: "You're Owed",
      value: "₹2,590",
      icon: TrendingUp,
      trend: {
        value: 22.4,
        label: "vs last month"
      },
      color: 'success' as const
    }, {
      title: "Active Groups",
      value: "4",
      icon: Users,
      color: 'primary' as const,
      subtitle: "Family, Office, Trip, Friends"
    }],
    personal: [{
      title: "Available Balance",
      value: "₹47,320",
      icon: Wallet,
      trend: {
        value: 8.4,
        label: "vs last month"
      },
      color: 'success' as const
    }, {
      title: "This Month Income",
      value: "₹65,000",
      icon: TrendingUp,
      trend: {
        value: 0,
        label: "salary + freelance"
      },
      color: 'success' as const
    }, {
      title: "This Month Spent",
      value: "₹28,680",
      icon: TrendingDown,
      trend: {
        value: -12.3,
        label: "vs last month"
      },
      color: 'warning' as const
    }, {
      title: "Savings Goal",
      value: "78%",
      icon: Calendar,
      color: 'primary' as const,
      subtitle: "₹31,000 of ₹40,000"
    }]
  };
  const recentExpenses = {
    group: [{
      id: '1',
      title: 'Weekend Trip to Goa',
      amount: 8400,
      type: 'expense' as const,
      category: 'Travel',
      date: '2024-01-20',
      description: 'Hotel, food and activities for 3 days',
      paidBy: 'Rahul',
      splitBetween: ['Rahul', 'Priya', 'Amit', 'Sneha'],
      status: 'settled'
    }, {
      id: '2',
      title: 'Office Lunch',
      amount: 1680,
      type: 'expense' as const,
      category: 'Food',
      date: '2024-01-19',
      description: 'Team lunch at Pizza Hut',
      paidBy: 'Amit',
      splitBetween: ['Amit', 'Pooja', 'Vikash', 'Ravi', 'Neha', 'Kiran'],
      status: 'pending'
    }, {
      id: '3',
      title: 'Apartment Rent',
      amount: 12000,
      type: 'expense' as const,
      category: 'Housing',
      date: '2024-01-01',
      description: 'Monthly rent split',
      paidBy: 'Priya',
      splitBetween: ['Priya', 'Sneha', 'Kavya'],
      status: 'partial'
    }],
    personal: [{
      id: '1',
      title: 'Freelance Project Payment',
      amount: 25000,
      type: 'income' as const,
      category: 'Work',
      date: '2024-01-18',
      description: 'Web development project completion'
    }, {
      id: '2',
      title: 'Swiggy Order',
      amount: 420,
      type: 'expense' as const,
      category: 'Food',
      date: '2024-01-19',
      description: 'Dinner from favorite restaurant'
    }, {
      id: '3',
      title: 'Netflix Subscription',
      amount: 649,
      type: 'expense' as const,
      category: 'Entertainment',
      date: '2024-01-15',
      description: 'Monthly subscription renewal'
    }, {
      id: '4',
      title: 'Salary Credit',
      amount: 40000,
      type: 'income' as const,
      category: 'Salary',
      date: '2024-01-01',
      description: 'Monthly salary from company'
    }]
  };
  const chartData = {
    group: [{
      name: 'Food & Dining',
      value: 12400,
      color: '#10b981'
    }, {
      name: 'Travel & Transport',
      value: 8900,
      color: '#3b82f6'
    }, {
      name: 'Entertainment',
      value: 4200,
      color: '#8b5cf6'
    }, {
      name: 'Housing',
      value: 15000,
      color: '#ef4444'
    }, {
      name: 'Shopping',
      value: 3200,
      color: '#f59e0b'
    }],
    personal: [{
      name: 'Food & Dining',
      value: 8200,
      color: '#10b981'
    }, {
      name: 'Transportation',
      value: 3400,
      color: '#3b82f6'
    }, {
      name: 'Entertainment',
      value: 2100,
      color: '#8b5cf6'
    }, {
      name: 'Shopping',
      value: 4800,
      color: '#f59e0b'
    }, {
      name: 'Bills & Utilities',
      value: 6200,
      color: '#ef4444'
    }, {
      name: 'Health & Fitness',
      value: 1500,
      color: '#06b6d4'
    }]
  };
  const currentStats = statsData[mode];
  const currentExpenses = recentExpenses[mode];
  const currentChart = chartData[mode];
  if (mode === 'personal') {
    return <div className="space-y-8 py-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 backdrop-blur-sm border border-primary/20">
            <Wallet className="w-5 h-5 mr-2 text-primary" />
            <span className="text-primary font-medium text-sm">Personal Dashboard</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-cyber mb-2">
            Financial Overview
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your expenses, manage budgets, and achieve your financial goals
          </p>
        </div>

        {/* Enhanced Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {currentStats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                      stat.trend.value > 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {stat.trend.value > 0 ? 
                        <TrendingUp className="w-3 h-3 mr-1" /> : 
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      {Math.abs(stat.trend.value)}%
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  {stat.trend && (
                    <p className="text-xs text-muted-foreground">
                      {stat.trend.label}
                    </p>
                  )}
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-card/60 backdrop-blur-lg border border-border/50 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow rounded-lg transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isMobile ? 'Overview' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow rounded-lg transition-all duration-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isMobile ? 'Budget' : 'Budget Tracker'}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow rounded-lg transition-all duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger 
                  value="money" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow rounded-lg transition-all duration-300"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow rounded-lg transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Insights
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="mt-8 space-y-8">
            {/* Quick Actions & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="glass-card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-primary" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={onAddExpense}
                        className="w-full justify-start bg-gradient-primary hover:shadow-glow text-primary-foreground transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-3" />
                        Add Expense
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 hover:bg-primary/10"
                        onClick={onSendMoney}
                      >
                        <Wallet className="w-4 h-4 mr-3" />
                        Send Money
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 hover:bg-primary/10"
                        onClick={onScanQR}
                      >
                        <Search className="w-4 h-4 mr-3" />
                        Scan QR
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 hover:bg-primary/10"
                        onClick={onCalculate}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        Split Bill
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <ExpenseChart type="pie" data={currentChart} title="Expense Breakdown" />
              </div>
            </div>
            
            {/* Recent Expenses */}
            <Card className="glass-card animate-slide-up">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    Recent Transactions
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Search transactions..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="pl-10 w-full sm:w-64 bg-background/50 border-border/50 backdrop-blur-sm" 
                      />
                    </div>
                    
                    {!isMobile && (
                      <>
                        <Button variant="outline" size="default" className="border-primary/20 hover:bg-primary/10">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button 
                          size="default" 
                          className="bg-gradient-primary hover:shadow-glow text-primary-foreground"
                          onClick={onAddExpense}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {currentExpenses.map((expense, index) => (
                    <div 
                      key={expense.id} 
                      className="p-4 rounded-xl bg-card/30 border border-border/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-300 hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${
                            expense.type === 'income' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {expense.type === 'income' ? 
                              <TrendingUp className="w-5 h-5" /> : 
                              <TrendingDown className="w-5 h-5" />
                            }
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-foreground">{expense.title}</h4>
                            <p className="text-sm text-muted-foreground">{expense.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{expense.date}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            expense.type === 'income' ? 'text-success' : 'text-destructive'
                          }`}>
                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{expense.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="budget" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Budget Overview */}
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    Monthly Budget
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { category: 'Food & Dining', spent: 8200, budget: 10000, color: 'success' },
                      { category: 'Transportation', spent: 3400, budget: 4000, color: 'warning' },
                      { category: 'Entertainment', spent: 2100, budget: 3000, color: 'primary' },
                      { category: 'Shopping', spent: 4800, budget: 4000, color: 'destructive' },
                    ].map((item, index) => {
                      const percentage = Math.min((item.spent / item.budget) * 100, 100);
                      const isOverBudget = item.spent > item.budget;
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{item.category}</span>
                            <span className={`text-sm font-bold ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                              ₹{item.spent.toLocaleString()} / ₹{item.budget.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="w-full bg-muted/30 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isOverBudget ? 'bg-destructive' : 'bg-gradient-primary'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(0)}% used</span>
                            <span className={isOverBudget ? 'text-destructive font-medium' : ''}>
                              {isOverBudget ? 'Over budget!' : `₹${(item.budget - item.spent).toLocaleString()} left`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
              
              {/* Savings Goal */}
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Savings Goal
                  </h3>
                  
                  <div className="text-center space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted/20"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${78 * 2 * Math.PI * 56 / 100} ${2 * Math.PI * 56}`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--success))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">78%</div>
                          <div className="text-xs text-muted-foreground">Complete</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground">₹31,000 saved</p>
                      <p className="text-sm text-muted-foreground">Goal: ₹40,000</p>
                      <p className="text-xs text-primary">₹9,000 remaining</p>
                    </div>
                    
                    <Button className="w-full bg-gradient-primary hover:shadow-glow text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Savings
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {!isMobile && (
            <>
              <TabsContent value="history" className="mt-8">
                <PersonalPaymentHistory />
              </TabsContent>
              
              <TabsContent value="money" className="mt-8">
                <MoneyManagement />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-8">
                <AdvancedInsights mode={mode} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>;
  }
  return <div className="space-y-6 py-4">
      {/* Stats Cards - Mobile First Grid */}
      <div className="grid grid-mobile-1 grid-tablet-2 grid-desktop-4 gap-responsive">
        {currentStats.map((stat, index) => <StatsCard key={index} {...stat} />)}
      </div>

      {/* Quick Actions & Chart */}
      <div className="grid grid-mobile-1 lg:grid-cols-3 gap-responsive">
        <div className="lg:col-span-1">
          <QuickActions 
            mode={mode} 
            onAddExpense={onAddExpense}
            onSendMoney={onSendMoney}
            onScanQR={onScanQR}
            onCalculate={onCalculate}
          />
        </div>
        <div className="lg:col-span-2">
          <ExpenseChart type="pie" data={currentChart} title="Group Expense Breakdown" />
        </div>
      </div>

      {/* Recent Expenses */}
      <Card className="glass-card animate-slide-up">
        <div className={`${isMobile ? 'card-mobile' : 'card-desktop'} bg-card/90 backdrop-blur-lg`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-responsive-lg font-semibold text-card-foreground">Recent Group Expenses</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search expenses..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-10 w-full sm:w-64 bg-input border-border touch-target" 
                />
              </div>
              {!isMobile && (
                  <>
                    <Button variant="outline" size="default" className="touch-target">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      size="default" 
                      className="touch-target"
                      onClick={onAddExpense}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {currentExpenses.map(expense => <ExpenseCard key={expense.id} {...expense} />)}
          </div>
        </div>
      </Card>
    </div>;
};
export default Dashboard;