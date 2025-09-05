import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, Target, TrendingUp, AlertTriangle, Plus, Calendar, DollarSign, Percent } from 'lucide-react';
const MoneyManagement = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const savingsGoals = [{
    id: '1',
    title: 'Emergency Fund',
    target: 100000,
    current: 65000,
    deadline: '2024-12-31',
    category: 'Safety',
    priority: 'high'
  }, {
    id: '2',
    title: 'Vacation Trip',
    target: 50000,
    current: 32000,
    deadline: '2024-06-15',
    category: 'Travel',
    priority: 'medium'
  }, {
    id: '3',
    title: 'New Laptop',
    target: 80000,
    current: 25000,
    deadline: '2024-05-01',
    category: 'Technology',
    priority: 'low'
  }];
  const budgetCategories = [{
    category: 'Food & Dining',
    allocated: 15000,
    spent: 12500,
    remaining: 2500,
    color: 'success'
  }, {
    category: 'Transportation',
    allocated: 8000,
    spent: 8500,
    remaining: -500,
    color: 'destructive'
  }, {
    category: 'Entertainment',
    allocated: 5000,
    spent: 3200,
    remaining: 1800,
    color: 'success'
  }, {
    category: 'Shopping',
    allocated: 10000,
    spent: 9800,
    remaining: 200,
    color: 'warning'
  }];
  const investments = [{
    type: 'Mutual Funds',
    amount: 45000,
    returns: 8.5,
    status: 'Growing'
  }, {
    type: 'Fixed Deposit',
    amount: 25000,
    returns: 6.2,
    status: 'Stable'
  }, {
    type: 'Stocks',
    amount: 18000,
    returns: 12.3,
    status: 'Volatile'
  }];
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  const getBudgetColor = (remaining: number) => {
    if (remaining < 0) return 'destructive';
    if (remaining < 1000) return 'warning';
    return 'success';
  };
  return <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <PiggyBank className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-xl font-bold text-card-foreground">₹1,22,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Progress</p>
                <p className="text-xl font-bold text-card-foreground">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-xl font-bold text-card-foreground">₹88,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Savings Goals</TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Budget</TabsTrigger>
          <TabsTrigger value="investments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Investments</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Insights</TabsTrigger>
        </TabsList>
        
        {/* Savings Goals */}
        <TabsContent value="goals">
          <Card className="glass-card">
            <CardHeader className="bg-gradient-card">
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground">Savings Goals</CardTitle>
                <Button size="sm" variant="cyber">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 bg-gradient-card">
              {savingsGoals.map(goal => {
              const progress = goal.current / goal.target * 100;
              return <div key={goal.id} className="p-4 border border-border rounded-lg space-y-3 bg-secondary/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-card-foreground">{goal.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{goal.deadline}</span>
                          <Badge variant={getPriorityColor(goal.priority) as any} className="text-xs">
                            {goal.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-card-foreground">₹{goal.current.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">of ₹{goal.target.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-card-foreground">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span>₹{(goal.target - goal.current).toLocaleString()} remaining</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Add Funds
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        Edit Goal
                      </Button>
                    </div>
                  </div>;
            })}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budget Tracking */}
        <TabsContent value="budget">
          <Card className="glass-card">
            <CardHeader className="bg-gradient-card">
              <CardTitle className="text-card-foreground">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-gradient-card">
              {budgetCategories.map((budget, index) => {
              const spentPercentage = budget.spent / budget.allocated * 100;
              return <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-secondary/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-card-foreground">{budget.category}</h4>
                      <div className="text-right">
                        <p className="font-semibold text-card-foreground">₹{budget.spent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">of ₹{budget.allocated.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Progress value={Math.min(spentPercentage, 100)} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm text-card-foreground">
                      <span>{spentPercentage.toFixed(1)}% used</span>
                      <span className={`font-medium ${budget.remaining < 0 ? 'text-destructive' : 'text-success'}`}>
                        {budget.remaining < 0 ? 'Over by ' : 'Remaining '}
                        ₹{Math.abs(budget.remaining).toLocaleString()}
                      </span>
                    </div>
                    
                    {budget.remaining < 0 && <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Budget exceeded</span>
                      </div>}
                  </div>;
            })}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Investments */}
        <TabsContent value="investments">
          <Card className="glass-card">
            <CardHeader className="bg-gradient-card">
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground">Investment Portfolio</CardTitle>
                <Button size="sm" variant="cyber">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 bg-gradient-card">
              {investments.map((investment, index) => <div key={index} className="p-4 border border-border rounded-lg bg-secondary/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground">{investment.type}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {investment.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-card-foreground">₹{investment.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm text-success">
                        <TrendingUp className="h-3 w-3" />
                        <span>{investment.returns}% returns</span>
                      </div>
                    </div>
                  </div>
                </div>)}
              
              <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Total Portfolio Value</p>
                    <p className="text-sm text-muted-foreground">Average Returns: 9.2%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-card-foreground">₹88,000</p>
                    <p className="text-sm text-success">+₹8,100 profit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Insights */}
        <TabsContent value="insights">
          <Card className="glass-card">
            <CardHeader className="bg-gradient-card">
              <CardTitle className="text-card-foreground">Financial Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-gradient-card">
              <div className="space-y-3">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-success">Great Savings Progress!</p>
                      <p className="text-sm text-muted-foreground">
                        You've saved 15% more this month compared to last month. Keep it up!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-warning">Budget Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Transportation spending is over budget by ₹500 this month.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">Goal Reminder</p>
                      <p className="text-sm text-muted-foreground">
                        You need to save ₹4,167 monthly to reach your vacation goal on time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};

export default MoneyManagement;