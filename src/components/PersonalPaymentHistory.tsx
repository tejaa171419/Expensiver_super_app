import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, ArrowUpDown, Download, TrendingUp, TrendingDown, Users, Wallet } from 'lucide-react';
const PersonalPaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const paymentHistory = [{
    id: '1',
    type: 'expense',
    title: 'Grocery Shopping',
    amount: 2500,
    category: 'Food',
    date: '2024-01-20',
    method: 'UPI',
    status: 'completed',
    group: null,
    recipient: 'BigBasket'
  }, {
    id: '2',
    type: 'group_payment',
    title: 'Dinner Split Payment',
    amount: 800,
    category: 'Food',
    date: '2024-01-19',
    method: 'QR Payment',
    status: 'completed',
    group: 'Friends Group',
    recipient: 'John Doe'
  }, {
    id: '3',
    type: 'income',
    title: 'Freelance Payment',
    amount: 15000,
    category: 'Income',
    date: '2024-01-18',
    method: 'Bank Transfer',
    status: 'completed',
    group: null,
    recipient: 'Client XYZ'
  }, {
    id: '4',
    type: 'expense',
    title: 'Electric Bill',
    amount: 3200,
    category: 'Utilities',
    date: '2024-01-17',
    method: 'UPI',
    status: 'completed',
    group: null,
    recipient: 'BESCOM'
  }, {
    id: '5',
    type: 'group_payment',
    title: 'Trip Expense Share',
    amount: 5500,
    category: 'Travel',
    date: '2024-01-16',
    method: 'QR Payment',
    status: 'pending',
    group: 'Travel Buddies',
    recipient: 'Sarah Smith'
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'group_payment':
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };
  const filteredHistory = paymentHistory.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchTerm.toLowerCase()) || payment.category.toLowerCase().includes(searchTerm.toLowerCase()) || payment.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || payment.type === filterType;
    return matchesSearch && matchesFilter;
  });
  return <Card className="glass-card">
      <CardHeader className="bg-card/90 backdrop-blur-lg">
        <CardTitle className="flex items-center justify-between">
          <span>Payment History</span>
          <Button variant="outline" size="sm" className="text-slate-950">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search payments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-input border-border" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="group_payment">Group Payments</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-slate-950">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="bg-card/90 backdrop-blur-lg">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-zinc-950">All</TabsTrigger>
            <TabsTrigger value="personal" className="text-zinc-950">Personal</TabsTrigger>
            <TabsTrigger value="group" className="text-zinc-950">Group</TabsTrigger>
            <TabsTrigger value="bills" className="text-zinc-950">Bills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {filteredHistory.map(payment => <div key={payment.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(payment.type)}
                      <div>
                        <h4 className="font-medium">{payment.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{payment.recipient}</span>
                          {payment.group && <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {payment.group}
                              </Badge>
                            </>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${payment.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {payment.type === 'income' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{payment.date}</span>
                        <Badge variant={getStatusColor(payment.status) as any} className="text-xs">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {payment.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {payment.method}
                    </span>
                  </div>
                </div>)}
            </div>
          </TabsContent>
          
          <TabsContent value="personal">
            <div className="space-y-3">
              {filteredHistory.filter(p => p.type === 'expense' || p.type === 'income').map(payment => <div key={payment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(payment.type)}
                      <div>
                        <h4 className="font-medium">{payment.title}</h4>
                        <p className="text-sm text-muted-foreground">{payment.recipient}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${payment.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {payment.type === 'income' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{payment.date}</div>
                    </div>
                  </div>
                </div>)}
            </div>
          </TabsContent>
          
          <TabsContent value="group">
            <div className="space-y-3">
              {filteredHistory.filter(p => p.type === 'group_payment').map(payment => <div key={payment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(payment.type)}
                      <div>
                        <h4 className="font-medium">{payment.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{payment.recipient}</span>
                          <Badge variant="outline" className="text-xs">
                            {payment.group}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-destructive">
                        -₹{payment.amount.toLocaleString()}
                      </div>
                      <Badge variant={getStatusColor(payment.status) as any} className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>)}
            </div>
          </TabsContent>
          
          <TabsContent value="bills">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bill payments found</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
export default PersonalPaymentHistory;