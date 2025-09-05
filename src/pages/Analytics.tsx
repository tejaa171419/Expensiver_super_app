import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExpenseChart from "@/components/ExpenseChart";
import StatsCard from "@/components/StatsCard";
import { TrendingUp, TrendingDown, Calendar, PieChart, BarChart3, Target, Wallet, Users, Download, Filter } from "lucide-react";
interface AnalyticsProps {
  mode?: 'group' | 'personal';
}
const Analytics = ({
  mode = 'group'
}: AnalyticsProps) => {
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'area' | 'line'>('pie');

  // Analytics data
  const analyticsStats = {
    group: [{
      title: "Group Efficiency",
      value: "92%",
      icon: Target,
      trend: {
        value: 8.2,
        label: "vs last month"
      },
      color: 'success' as const
    }, {
      title: "Avg. Settlement Time",
      value: "2.3 days",
      icon: Calendar,
      trend: {
        value: -15.4,
        label: "faster than before"
      },
      color: 'primary' as const
    }, {
      title: "Most Active Spender",
      value: "Rahul",
      icon: Users,
      subtitle: "₹18,400 this month"
    }, {
      title: "Largest Expense",
      value: "₹8,400",
      icon: TrendingUp,
      subtitle: "Goa Trip - Travel"
    }],
    personal: [{
      title: "Spending Efficiency",
      value: "87%",
      icon: Target,
      trend: {
        value: 12.8,
        label: "improvement"
      },
      color: 'success' as const
    }, {
      title: "Daily Average",
      value: "₹956",
      icon: Calendar,
      trend: {
        value: -8.2,
        label: "vs last month"
      },
      color: 'success' as const
    }, {
      title: "Top Category",
      value: "Food",
      icon: PieChart,
      subtitle: "₹8,200 this month"
    }, {
      title: "Savings Rate",
      value: "68%",
      icon: Wallet,
      trend: {
        value: 5.4,
        label: "vs target"
      },
      color: 'primary' as const
    }]
  };
  const categoryTrends = {
    group: [{
      name: 'Food & Dining',
      current: 12400,
      previous: 10800,
      change: 14.8,
      color: '#10b981'
    }, {
      name: 'Travel',
      current: 8900,
      previous: 12200,
      change: -27.0,
      color: '#3b82f6'
    }, {
      name: 'Entertainment',
      current: 4200,
      previous: 3800,
      change: 10.5,
      color: '#8b5cf6'
    }, {
      name: 'Housing',
      current: 15000,
      previous: 15000,
      change: 0,
      color: '#ef4444'
    }, {
      name: 'Shopping',
      current: 3200,
      previous: 4100,
      change: -22.0,
      color: '#f59e0b'
    }],
    personal: [{
      name: 'Food & Dining',
      current: 8200,
      previous: 9100,
      change: -9.9,
      color: '#10b981'
    }, {
      name: 'Transportation',
      current: 3400,
      previous: 4200,
      change: -19.0,
      color: '#3b82f6'
    }, {
      name: 'Entertainment',
      current: 2100,
      previous: 2800,
      change: -25.0,
      color: '#8b5cf6'
    }, {
      name: 'Shopping',
      current: 4800,
      previous: 3900,
      change: 23.1,
      color: '#f59e0b'
    }, {
      name: 'Bills & Utilities',
      current: 6200,
      previous: 6800,
      change: -8.8,
      color: '#ef4444'
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
    }]
  };
  const monthlyData = [{
    month: 'Aug',
    income: 45000,
    expense: 32000,
    savings: 13000
  }, {
    month: 'Sep',
    income: 48000,
    expense: 29000,
    savings: 19000
  }, {
    month: 'Oct',
    income: 45000,
    expense: 31000,
    savings: 14000
  }, {
    month: 'Nov',
    income: 52000,
    expense: 28000,
    savings: 24000
  }, {
    month: 'Dec',
    income: 65000,
    expense: 35000,
    savings: 30000
  }, {
    month: 'Jan',
    income: 65000,
    expense: 28680,
    savings: 36320
  }];
  const currentStats = analyticsStats[mode];
  const currentTrends = categoryTrends[mode];
  const currentChart = chartData[mode];
  return <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'group' ? 'Group Analytics' : 'Personal Analytics'}
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your {mode === 'group' ? 'group spending' : 'financial'} patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="glass-card border-white/20 text-foreground hover:bg-primary/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => <StatsCard key={index} {...stat} />)}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card border-white/10">
          <TabsTrigger value="overview" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Trends</TabsTrigger>
          <TabsTrigger value="categories" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categories</TabsTrigger>
          <TabsTrigger value="insights" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Controls */}
            <Card className="glass-card border-primary/20 shadow-glow hover:shadow-glow-lg transition-all duration-500">
              <div className="p-6 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                      Expense Distribution
                    </h3>
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-lg backdrop-blur-sm">
                      <Button 
                        variant={chartType === 'pie' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setChartType('pie')}
                        className={`${chartType === 'pie' ? 'bg-primary shadow-glow' : 'hover:bg-primary/10'} transition-all duration-300`}
                      >
                        <PieChart className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={chartType === 'bar' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setChartType('bar')}
                        className={`${chartType === 'bar' ? 'bg-primary shadow-glow' : 'hover:bg-primary/10'} transition-all duration-300`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={chartType === 'area' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setChartType('area')}
                        className={`${chartType === 'area' ? 'bg-primary shadow-glow' : 'hover:bg-primary/10'} transition-all duration-300`}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={chartType === 'line' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setChartType('line')}
                        className={`${chartType === 'line' ? 'bg-primary shadow-glow' : 'hover:bg-primary/10'} transition-all duration-300`}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <ExpenseChart type={chartType} data={currentChart} title="" gradient={true} showGlow={true} />
                </div>
              </div>
            </Card>

            {/* Monthly Trends */}
            <Card className="glass-card border-primary/20 shadow-glow hover:shadow-glow-lg transition-all duration-500">
              <div className="p-6 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-success/5 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                    Monthly Trends
                  </h3>
                  <ExpenseChart type="area" data={monthlyData} title="" gradient={true} showGlow={true} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="glass-card border-primary/20 shadow-glow hover:shadow-glow-lg transition-all duration-500">
              <div className="p-6 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-warning/5 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
                    Category Trends
                  </h3>
                  <div className="space-y-4">
                    {currentTrends.map((trend, index) => (
                      <div key={index} className="group glass-card hover-lift p-6 border-white/10 transition-all duration-500 hover:shadow-glow rounded-xl bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div 
                                className="w-5 h-5 rounded-full shadow-glow transition-all duration-500 group-hover:scale-125 group-hover:shadow-glow-lg animate-pulse-subtle" 
                                style={{
                                  backgroundColor: trend.color,
                                  boxShadow: `0 0 20px ${trend.color}60, 0 0 40px ${trend.color}30`
                                }} 
                              />
                              <div 
                                className="absolute inset-0 w-5 h-5 rounded-full opacity-30 animate-ping" 
                                style={{ backgroundColor: trend.color }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {trend.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ₹{trend.current.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-500 shadow-sm hover:shadow-glow ${
                              trend.change > 0 
                                ? 'text-destructive bg-destructive/10 border-destructive/20 group-hover:bg-destructive/20 hover:shadow-destructive/20' 
                                : 'text-success bg-success/10 border-success/20 group-hover:bg-success/20 hover:shadow-success/20'
                            }`}>
                              {trend.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              <span className="font-bold">
                                {Math.abs(trend.change)}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4 w-full bg-muted/30 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 shadow-glow animate-scale-in" 
                            style={{
                              backgroundColor: trend.color,
                              width: `${(trend.current / Math.max(...currentTrends.map(t => t.current))) * 100}%`,
                              boxShadow: `0 0 10px ${trend.color}60, inset 0 1px 2px rgba(255,255,255,0.1)`
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentChart.map((category, index) => <Card key={index} className="group glass-card hover-lift border-white/10 overflow-hidden">
                <div className="p-6 relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 opacity-5">
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-transparent to-current" 
                      style={{ color: category.color }}
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h4>
                      <div 
                        className="w-6 h-6 rounded-full shadow-lg transition-all duration-300 group-hover:scale-125" 
                        style={{
                          backgroundColor: category.color,
                          boxShadow: `0 0 20px ${category.color}40`
                        }} 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-foreground">
                        ₹{category.value.toLocaleString()}
                      </p>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-sm" 
                          style={{
                            backgroundColor: category.color,
                            width: `${category.value / Math.max(...currentChart.map(c => c.value)) * 100}%`,
                            boxShadow: `0 0 10px ${category.color}60`
                          }} 
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {(category.value / currentChart.reduce((sum, c) => sum + c.value, 0) * 100).toFixed(1)}% of total
                        </p>
                        <div className="px-2 py-1 rounded-full text-xs font-medium" style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color
                        }}>
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Smart Insights 🧠</h3>
                <div className="space-y-4">
                  <div className="group p-5 bg-success/10 rounded-xl border border-success/20 hover:bg-success/15 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--success)/0.3)]">
                    <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                      Best Performance 📈
                    </h4>
                    <p className="text-sm text-foreground/80">
                      {mode === 'group' ? 'Your group settles expenses 40% faster than average' : 'Transportation costs reduced by 35% this quarter'}
                    </p>
                  </div>
                  <div className="group p-5 bg-primary/10 rounded-xl border border-primary/20 hover:bg-primary/15 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      Optimization Tip 💡
                    </h4>
                    <p className="text-sm text-foreground/80">
                      {mode === 'group' ? 'Consider using recurring payments for regular group expenses' : 'Set up automatic transfers to reach savings goal faster'}
                    </p>
                  </div>
                  <div className="group p-5 bg-warning/10 rounded-xl border border-warning/20 hover:bg-warning/15 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--warning)/0.3)]">
                    <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-warning rounded-full animate-pulse"></span>
                      Watch Out ⚠️
                    </h4>
                    <p className="text-sm text-foreground/80">
                      {mode === 'group' ? 'Food expenses increased 15% - discuss budget limits' : 'Shopping expenses above average - review recent purchases'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Goals & Targets 🎯</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Monthly Budget</span>
                      <span className="text-sm">₹28,680 / ₹35,000</span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-success h-full rounded-full transition-all duration-1000 shadow-sm" 
                        style={{
                          width: '82%',
                          boxShadow: '0 0 10px hsl(var(--success) / 0.6)'
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Savings Goal</span>
                      <span className="text-sm">₹31,000 / ₹40,000</span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000 shadow-sm" 
                        style={{
                          width: '78%',
                          boxShadow: '0 0 10px hsl(var(--primary) / 0.6)'
                        }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Investment Target</span>
                      <span className="text-sm">₹18,000 / ₹25,000</span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-cyan-light h-full rounded-full transition-all duration-1000 shadow-sm" 
                        style={{
                          width: '72%',
                          boxShadow: '0 0 10px hsl(var(--primary) / 0.4)'
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Analytics;