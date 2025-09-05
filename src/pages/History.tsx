import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Calendar as CalendarIcon, Download, SortAsc, SortDesc, ArrowUpDown, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
interface HistoryProps {
  mode?: 'group' | 'personal';
}
interface GroupTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense';
  category: string;
  date: string;
  description: string;
  paidBy: string;
  splitBetween: string[];
  status: string;
  settlement_date?: string;
}
interface PersonalTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
  description: string;
}
const History = ({
  mode = 'group'
}: HistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>();
  const [selectedTab, setSelectedTab] = useState('all');

  // Comprehensive transaction history
  const transactionHistory: {
    group: GroupTransaction[];
    personal: PersonalTransaction[];
  } = {
    group: [{
      id: '1',
      title: 'Weekend Trip to Goa',
      amount: 8400,
      type: 'expense',
      category: 'Travel',
      date: '2024-01-20',
      description: 'Hotel, food and activities for 3 days',
      paidBy: 'Rahul',
      splitBetween: ['Rahul', 'Priya', 'Amit', 'Sneha'],
      status: 'settled',
      settlement_date: '2024-01-22'
    }, {
      id: '2',
      title: 'Office Lunch',
      amount: 1680,
      type: 'expense',
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
      type: 'expense',
      category: 'Housing',
      date: '2024-01-01',
      description: 'Monthly rent split',
      paidBy: 'Priya',
      splitBetween: ['Priya', 'Sneha', 'Kavya'],
      status: 'partial'
    }, {
      id: '4',
      title: 'Movie Night',
      amount: 2400,
      type: 'expense',
      category: 'Entertainment',
      date: '2024-01-15',
      description: 'Cinema tickets and snacks',
      paidBy: 'Sneha',
      splitBetween: ['Sneha', 'Rahul', 'Priya', 'Amit'],
      status: 'settled',
      settlement_date: '2024-01-16'
    }, {
      id: '5',
      title: 'Grocery Shopping',
      amount: 3200,
      type: 'expense',
      category: 'Food',
      date: '2024-01-12',
      description: 'Weekly groceries for apartment',
      paidBy: 'Kavya',
      splitBetween: ['Kavya', 'Priya', 'Sneha'],
      status: 'settled',
      settlement_date: '2024-01-14'
    }, {
      id: '6',
      title: 'Electricity Bill',
      amount: 1800,
      type: 'expense',
      category: 'Utilities',
      date: '2024-01-10',
      description: 'Monthly electricity bill',
      paidBy: 'Rahul',
      splitBetween: ['Rahul', 'Amit', 'Vikash'],
      status: 'pending'
    }],
    personal: [{
      id: '1',
      title: 'Freelance Project Payment',
      amount: 25000,
      type: 'income',
      category: 'Work',
      date: '2024-01-18',
      description: 'Web development project completion'
    }, {
      id: '2',
      title: 'Swiggy Order',
      amount: 420,
      type: 'expense',
      category: 'Food',
      date: '2024-01-19',
      description: 'Dinner from favorite restaurant'
    }, {
      id: '3',
      title: 'Netflix Subscription',
      amount: 649,
      type: 'expense',
      category: 'Entertainment',
      date: '2024-01-15',
      description: 'Monthly subscription renewal'
    }, {
      id: '4',
      title: 'Salary Credit',
      amount: 40000,
      type: 'income',
      category: 'Salary',
      date: '2024-01-01',
      description: 'Monthly salary from company'
    }, {
      id: '5',
      title: 'Metro Card Recharge',
      amount: 500,
      type: 'expense',
      category: 'Transportation',
      date: '2024-01-17',
      description: 'Monthly metro card top-up'
    }, {
      id: '6',
      title: 'Gym Membership',
      amount: 2000,
      type: 'expense',
      category: 'Health',
      date: '2024-01-05',
      description: 'Monthly gym membership fee'
    }, {
      id: '7',
      title: 'Online Course',
      amount: 1500,
      type: 'expense',
      category: 'Education',
      date: '2024-01-08',
      description: 'React Advanced Course on Udemy'
    }, {
      id: '8',
      title: 'Book Purchase',
      amount: 800,
      type: 'expense',
      category: 'Shopping',
      date: '2024-01-11',
      description: 'Technical books from Amazon'
    }]
  };
  const categories = mode === 'group' ? ['Food', 'Travel', 'Entertainment', 'Housing', 'Utilities', 'Transportation'] : ['Food', 'Work', 'Entertainment', 'Transportation', 'Health', 'Education', 'Shopping', 'Salary'];
  const currentTransactions = transactionHistory[mode];

  // Filter and sort transactions
  const filteredTransactions = currentTransactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || mode === 'group' && 'status' in transaction && transaction.status === filterStatus;
    const matchesTab = selectedTab === 'all' || selectedTab === 'income' && mode === 'personal' && (transaction as PersonalTransaction).type === 'income' || selectedTab === 'expense' && transaction.type === 'expense';
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-primary" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'partial':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-secondary';
    }
  };
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  return <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'group' ? 'Group Transaction History' : 'Personal Transaction History'}
          </h1>
          <p className="text-muted-foreground">
            Complete history of all your {mode === 'group' ? 'group' : 'personal'} transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Status Filter (Group Mode Only) */}
            {mode === 'group' && <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>}

            {/* Sort Options */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={value => {
            const [field, order] = value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
          }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left text-zinc-950">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDateRange?.from ? filterDateRange.to ? <>
                        {format(filterDateRange.from, "LLL dd")} -{" "}
                        {format(filterDateRange.to, "LLL dd")}
                      </> : format(filterDateRange.from, "LLL dd, y") : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={filterDateRange?.from} selected={filterDateRange} onSelect={setFilterDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* Transaction Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-slate-950">All Transactions</TabsTrigger>
          <TabsTrigger value="expense" className="text-slate-950">Expenses</TabsTrigger>
          <TabsTrigger value="income" className="text-slate-950">Income</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {currentTransactions.length} transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleSort('date')} className="gap-2 text-slate-950">
                Date
                {sortBy === 'date' ? sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleSort('amount')} className="gap-2 text-slate-950">
                Amount
                {sortBy === 'amount' ? sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? filteredTransactions.map(transaction => <Card key={transaction.id} className="glass-card hover-scale">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{transaction.title}</h4>
                            {mode === 'group' && 'status' in transaction && <Badge className={getStatusColor((transaction as GroupTransaction).status)}>
                                {getStatusIcon((transaction as GroupTransaction).status)}
                                <span className="ml-1 capitalize">{(transaction as GroupTransaction).status}</span>
                              </Badge>}
                            <Badge variant="outline">{transaction.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{transaction.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{format(new Date(transaction.date), 'PPP')}</span>
                            {mode === 'group' && 'paidBy' in transaction && <span>Paid by {(transaction as GroupTransaction).paidBy}</span>}
                            {mode === 'group' && 'splitBetween' in transaction && <span>Split between {(transaction as GroupTransaction).splitBetween.length} people</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-success' : 'text-foreground'}`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                          </p>
                          {mode === 'group' && 'status' in transaction && (transaction as GroupTransaction).status === 'settled' && 'settlement_date' in transaction && (transaction as GroupTransaction).settlement_date && <p className="text-xs text-success">
                              Settled on {format(new Date((transaction as GroupTransaction).settlement_date!), 'PP')}
                            </p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>) : <Card className="glass-card">
                <div className="p-12 text-center">
                  <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              </Card>}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default History;