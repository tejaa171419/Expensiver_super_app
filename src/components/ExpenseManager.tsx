import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  User,
  Plus,
  Wallet,
  Target,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  PieChart,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Film,
  Briefcase,
  Coffee
} from 'lucide-react';
import { toast } from 'sonner';
import BudgetAnalytics from './BudgetAnalytics';

interface Budget {
  id: string;
  name: string;
  type: 'group' | 'personal';
  period: 'weekly' | 'monthly' | 'yearly';
  amount: number;
  spent: number;
  category: string;
  startDate: string;
  endDate: string;
  participants?: string[];
}

interface Expense {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  paidBy: string;
  type: 'group' | 'personal';
  participants?: string[];
}

// Mock data
const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Weekend Trip Budget',
    type: 'group',
    period: 'weekly',
    amount: 15000,
    spent: 8750,
    category: 'Travel',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    participants: ['Alice', 'Bob', 'Carol', 'You']
  },
  {
    id: '2',
    name: 'Monthly Groceries',
    type: 'personal',
    period: 'monthly',
    amount: 8000,
    spent: 5200,
    category: 'Food',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: '3',
    name: 'Office Team Lunch',
    type: 'group',
    period: 'weekly',
    amount: 5000,
    spent: 3200,
    category: 'Food',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    participants: ['Team Lead', 'John', 'Sarah', 'Mike', 'You']
  },
  {
    id: '4',
    name: 'Entertainment Budget',
    type: 'personal',
    period: 'monthly',
    amount: 6000,
    spent: 2400,
    category: 'Entertainment',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    budgetId: '1',
    amount: 2500,
    description: 'Hotel booking for weekend trip',
    category: 'Accommodation',
    date: '2024-01-15',
    paidBy: 'Alice',
    type: 'group',
    participants: ['Alice', 'Bob', 'Carol', 'You']
  },
  {
    id: '2',
    budgetId: '2',
    amount: 1200,
    description: 'Weekly grocery shopping',
    category: 'Food',
    date: '2024-01-14',
    paidBy: 'You',
    type: 'personal'
  },
  {
    id: '3',
    budgetId: '1',
    amount: 1800,
    description: 'Gas and tolls for trip',
    category: 'Transport',
    date: '2024-01-16',
    paidBy: 'Bob',
    type: 'group',
    participants: ['Alice', 'Bob', 'Carol', 'You']
  }
];

const categories = [
  { name: 'Food', icon: Utensils, color: 'bg-orange-500' },
  { name: 'Transport', icon: Car, color: 'bg-blue-500' },
  { name: 'Entertainment', icon: Film, color: 'bg-purple-500' },
  { name: 'Shopping', icon: ShoppingCart, color: 'bg-pink-500' },
  { name: 'Accommodation', icon: Home, color: 'bg-green-500' },
  { name: 'Work', icon: Briefcase, color: 'bg-gray-500' },
  { name: 'Coffee', icon: Coffee, color: 'bg-amber-600' },
  { name: 'Travel', icon: Car, color: 'bg-indigo-500' }
];

interface ExpenseManagerProps {
  onExpenseAdded?: (expense: any) => void;
}

const ExpenseManager = ({ onExpenseAdded }: ExpenseManagerProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  
  // Form states
  const [budgetForm, setBudgetForm] = useState({
    name: '',
    type: 'personal' as 'group' | 'personal',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    amount: '',
    category: '',
    participants: [] as string[]
  });

  const [expenseForm, setExpenseForm] = useState({
    budgetId: '',
    amount: '',
    description: '',
    category: '',
    participants: [] as string[]
  });

  const getBudgetProgress = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getBudgetStatus = (budget: Budget) => {
    const progress = getBudgetProgress(budget);
    if (progress >= 90) return { status: 'danger', color: 'text-red-500' };
    if (progress >= 70) return { status: 'warning', color: 'text-yellow-500' };
    return { status: 'good', color: 'text-green-500' };
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const handleAddBudget = () => {
    if (!budgetForm.name || !budgetForm.amount || !budgetForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      name: budgetForm.name,
      type: budgetForm.type,
      period: budgetForm.period,
      amount: parseFloat(budgetForm.amount),
      spent: 0,
      category: budgetForm.category,
      startDate: new Date().toISOString().split('T')[0],
      endDate: (() => {
        const date = new Date();
        if (budgetForm.period === 'weekly') {
          date.setDate(date.getDate() + 7);
        } else if (budgetForm.period === 'monthly') {
          date.setMonth(date.getMonth() + 1);
        } else {
          date.setFullYear(date.getFullYear() + 1);
        }
        return date.toISOString().split('T')[0];
      })(),
      participants: budgetForm.type === 'group' ? budgetForm.participants : undefined
    };

    setBudgets([...budgets, newBudget]);
    setBudgetForm({
      name: '',
      type: 'personal',
      period: 'monthly',
      amount: '',
      category: '',
      participants: []
    });
    setShowAddBudget(false);
    toast.success(`${budgetForm.type === 'group' ? 'Group' : 'Personal'} budget created successfully!`);
  };

  const handleAddExpense = () => {
    if (!expenseForm.budgetId || !expenseForm.amount || !expenseForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const budget = budgets.find(b => b.id === expenseForm.budgetId);
    if (!budget) {
      toast.error('Selected budget not found');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      budgetId: expenseForm.budgetId,
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      category: expenseForm.category || budget.category,
      date: new Date().toISOString().split('T')[0],
      paidBy: 'You',
      type: budget.type,
      participants: budget.type === 'group' ? budget.participants : undefined
    };

    setExpenses([...expenses, newExpense]);
    
    // Update budget spent amount
    const updatedBudgets = budgets.map(b => 
      b.id === expenseForm.budgetId 
        ? { ...b, spent: b.spent + parseFloat(expenseForm.amount) }
        : b
    );
    setBudgets(updatedBudgets);

    setExpenseForm({
      budgetId: '',
      amount: '',
      description: '',
      category: '',
      participants: []
    });
    setShowAddExpense(false);
    onExpenseAdded?.(newExpense);
    toast.success('Expense added successfully!');
  };

  const groupBudgets = budgets.filter(b => b.type === 'group');
  const personalBudgets = budgets.filter(b => b.type === 'personal');

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const progress = getBudgetProgress(budget);
    const status = getBudgetStatus(budget);
    const timeLeft = getTimeRemaining(budget.endDate);
    const categoryInfo = categories.find(c => c.name === budget.category);

    return (
      <Card className="glass-card border-white/20 hover:bg-white/5 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${categoryInfo?.color || 'bg-gray-500'}`}>
                {categoryInfo?.icon && <categoryInfo.icon className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-white">{budget.name}</h3>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Badge variant="outline" className="text-xs">
                    {budget.type === 'group' ? <Users className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                    {budget.type}
                  </Badge>
                  <span>{budget.period}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">₹{budget.spent.toLocaleString('en-IN')}</p>
              <p className="text-white/60 text-xs">of ₹{budget.amount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Progress</span>
              <span className={status.color}>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
            {budget.participants && (
              <span>{budget.participants.length} participants</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6" />
            Expense Manager
          </h2>
          <p className="text-white/60">Track and manage your group and personal budgets</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Budget Name</Label>
                  <Input
                    placeholder="e.g., Weekend Trip, Monthly Groceries"
                    value={budgetForm.name}
                    onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Type</Label>
                    <Select value={budgetForm.type} onValueChange={(value: 'group' | 'personal') => setBudgetForm({...budgetForm, type: value})}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Period</Label>
                    <Select value={budgetForm.period} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setBudgetForm({...budgetForm, period: value})}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Category</Label>
                    <Select value={budgetForm.category} onValueChange={(value) => setBudgetForm({...budgetForm, category: value})}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowAddBudget(false)} className="flex-1 border-white/30 text-white">
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Create Budget
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Select Budget</Label>
                  <Select value={expenseForm.budgetId} onValueChange={(value) => setExpenseForm({...expenseForm, budgetId: value})}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Choose a budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgets.map(budget => (
                        <SelectItem key={budget.id} value={budget.id}>
                          {budget.name} ({budget.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    placeholder="What was this expense for?"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowAddExpense(false)} className="flex-1 border-white/30 text-white">
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Add Expense
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="group" className="data-[state=active]:bg-white/20 text-white">
            Group Budgets ({groupBudgets.length})
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-white/20 text-white">
            Personal Budgets ({personalBudgets.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Budgets</p>
                    <p className="text-white font-semibold text-lg">{budgets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Allocated</p>
                    <p className="text-white font-semibold text-lg">
                      ₹{budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Spent</p>
                    <p className="text-white font-semibold text-lg">
                      ₹{budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Group Budgets
              </h3>
              {groupBudgets.slice(0, 3).map(budget => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Recent Personal Budgets
              </h3>
              {personalBudgets.slice(0, 3).map(budget => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          {groupBudgets.length === 0 ? (
            <Card className="glass-card border-white/20">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">No group budgets yet</p>
                <Button onClick={() => setShowAddBudget(true)} className="bg-blue-500 hover:bg-blue-600">
                  Create Your First Group Budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupBudgets.map(budget => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          {personalBudgets.length === 0 ? (
            <Card className="glass-card border-white/20">
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">No personal budgets yet</p>
                <Button onClick={() => setShowAddBudget(true)} className="bg-blue-500 hover:bg-blue-600">
                  Create Your First Personal Budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalBudgets.map(budget => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          )}
        </TabsContent>
      
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <BudgetAnalytics budgets={budgets} expenses={expenses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseManager;