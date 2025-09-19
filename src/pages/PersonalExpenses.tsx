import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Receipt, 
  ShoppingCart, 
  Car, 
  Home, 
  Heart, 
  Gamepad2, 
  Coffee,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PersonalExpensesProps {
  onAddExpense?: () => void;
  onSendMoney?: () => void;
  onScanQR?: () => void;
  onCalculate?: () => void;
}

const PersonalExpenses = ({
  onAddExpense,
  onSendMoney,
  onScanQR,
  onCalculate
}: PersonalExpensesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const isMobile = useIsMobile();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Comprehensive expense data
  const expenseCategories = [
    { id: 'food', name: 'Food & Dining', icon: Coffee, color: 'bg-orange-500', amount: 8420 },
    { id: 'transport', name: 'Transportation', icon: Car, color: 'bg-blue-500', amount: 3240 },
    { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: 'bg-purple-500', amount: 4800 },
    { id: 'housing', name: 'Housing', icon: Home, color: 'bg-green-500', amount: 12000 },
    { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'bg-red-500', amount: 2100 },
    { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, color: 'bg-pink-500', amount: 1850 }
  ];

  const recentExpenses = [
    {
      id: '1',
      title: 'Swiggy - Lunch Order',
      description: 'Biryani from Paradise Restaurant',
      amount: 420,
      category: 'food',
      date: '2024-01-20T14:30:00',
      paymentMethod: 'UPI',
      merchant: 'Swiggy',
      receipt: true,
      recurring: false,
      tags: ['lunch', 'office']
    },
    {
      id: '2',
      title: 'Uber Ride',
      description: 'Home to Office commute',
      amount: 180,
      category: 'transport',
      date: '2024-01-20T09:15:00',
      paymentMethod: 'Credit Card',
      merchant: 'Uber',
      receipt: false,
      recurring: false,
      tags: ['commute', 'daily']
    },
    {
      id: '3',
      title: 'Netflix Subscription',
      description: 'Monthly entertainment subscription',
      amount: 649,
      category: 'entertainment',
      date: '2024-01-19T00:00:00',
      paymentMethod: 'Debit Card',
      merchant: 'Netflix',
      receipt: true,
      recurring: true,
      tags: ['subscription', 'monthly']
    },
    {
      id: '4',
      title: 'Grocery Shopping',
      description: 'Weekly groceries from Big Bazaar',
      amount: 2350,
      category: 'food',
      date: '2024-01-18T19:45:00',
      paymentMethod: 'UPI',
      merchant: 'Big Bazaar',
      receipt: true,
      recurring: false,
      tags: ['groceries', 'weekly']
    },
    {
      id: '5',
      title: 'Gym Membership',
      description: 'Monthly fitness membership fee',
      amount: 1500,
      category: 'health',
      date: '2024-01-17T10:00:00',
      paymentMethod: 'Bank Transfer',
      merchant: 'Gold\'s Gym',
      receipt: true,
      recurring: true,
      tags: ['fitness', 'monthly']
    },
    {
      id: '6',
      title: 'Amazon Purchase',
      description: 'Electronics accessories',
      amount: 1250,
      category: 'shopping',
      date: '2024-01-16T16:20:00',
      paymentMethod: 'Credit Card',
      merchant: 'Amazon',
      receipt: true,
      recurring: false,
      tags: ['electronics', 'online']
    },
    {
      id: '7',
      title: 'Electricity Bill',
      description: 'Monthly electricity payment',
      amount: 2800,
      category: 'housing',
      date: '2024-01-15T11:30:00',
      paymentMethod: 'UPI',
      merchant: 'BESCOM',
      receipt: true,
      recurring: true,
      tags: ['utility', 'monthly']
    },
    {
      id: '8',
      title: 'Movie Tickets',
      description: 'Avengers: Endgame at PVR',
      amount: 800,
      category: 'entertainment',
      date: '2024-01-14T20:00:00',
      paymentMethod: 'UPI',
      merchant: 'PVR Cinemas',
      receipt: true,
      recurring: false,
      tags: ['movies', 'weekend']
    }
  ];

  const getCategoryDetails = (categoryId: string) => {
    return expenseCategories.find(cat => cat.id === categoryId) || expenseCategories[0];
  };

  const filteredExpenses = recentExpenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const totalSpent = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgPerDay = totalSpent / 30; // Assuming 30 days
  const recurringExpenses = recentExpenses.filter(expense => expense.recurring);
  const totalRecurring = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 py-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 backdrop-blur-sm border border-purple-500/20">
          <Receipt className="w-5 h-5 mr-2 text-purple-400" />
          <span className="text-purple-400 font-medium text-sm">Personal Expenses</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
          Expense Tracker
        </h1>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Monitor your spending patterns, categorize expenses, and gain insights into your financial habits
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="glass-card hover-lift group">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-xl font-bold text-red-400">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </Card>

        <Card className="glass-card hover-lift group">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Daily Average</span>
            </div>
            <p className="text-xl font-bold text-blue-400">₹{Math.round(avgPerDay).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Per day</p>
          </div>
        </Card>

        <Card className="glass-card hover-lift group">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Recurring</span>
            </div>
            <p className="text-xl font-bold text-green-400">₹{totalRecurring.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{recurringExpenses.length} items</p>
          </div>
        </Card>

        <Card className="glass-card hover-lift group">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Transactions</span>
            </div>
            <p className="text-xl font-bold text-purple-400">{recentExpenses.length}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="glass-card animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
              Expense Categories
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:bg-primary/10"
            >
              View All Categories
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {expenseCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id} 
                  className="p-4 rounded-xl bg-card/30 border border-border/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{category.name}</p>
                      <p className="text-lg font-bold text-primary">₹{category.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Expense List */}
      <Card className="glass-card animate-slide-up">
        <div className="p-6">
          {/* Header with filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-primary" />
              Recent Expenses
            </h3>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search expenses..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-10 w-full sm:w-64 bg-background/50 border-border/50 backdrop-blur-sm" 
                />
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="title">Name</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Add Expense Button */}
              <Button 
                onClick={onAddExpense}
                className="bg-gradient-primary hover:shadow-glow text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-4 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {sortedExpenses.length} expenses found
              </span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Filtered by: "{searchTerm}"
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expense List */}
          <div className="space-y-3">
            {sortedExpenses.map((expense, index) => {
              const categoryDetails = getCategoryDetails(expense.category);
              const Icon = categoryDetails.icon;
              
              return (
                <div 
                  key={expense.id} 
                  className="p-4 rounded-xl bg-card/30 border border-border/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-300 hover-lift group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${categoryDetails.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{expense.title}</h4>
                          {expense.recurring && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              Recurring
                            </Badge>
                          )}
                          {expense.receipt && (
                            <Receipt className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(expense.date)}</span>
                          <span>•</span>
                          <span>{expense.paymentMethod}</span>
                          <span>•</span>
                          <span>{expense.merchant}</span>
                        </div>
                        {expense.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {expense.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">
                          -₹{expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{categoryDetails.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {sortedExpenses.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Start tracking your expenses'}
              </p>
              <Button onClick={onAddExpense} className="bg-gradient-primary hover:shadow-glow text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Expense
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PersonalExpenses;