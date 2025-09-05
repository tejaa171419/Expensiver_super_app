import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Zap, Brain, Star } from "lucide-react";

interface AdvancedInsightsProps {
  mode?: 'group' | 'personal';
}

const AdvancedInsights = ({ mode = 'personal' }: AdvancedInsightsProps) => {
  const insights = {
    personal: [
      {
        type: 'achievement',
        icon: Star,
        title: 'Spending Champion!',
        description: 'You\'ve reduced dining expenses by 23% this month',
        impact: 'high',
        action: 'Keep it up!',
        color: 'success'
      },
      {
        type: 'prediction',
        icon: Brain,
        title: 'AI Forecast',
        description: 'Based on current patterns, you\'ll save ₹4,200 extra this month',
        impact: 'medium',
        action: 'Consider investing surplus',
        color: 'primary'
      },
      {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Budget Alert',
        description: 'Transportation costs trending 15% above normal',
        impact: 'medium',
        action: 'Review recent trips',
        color: 'warning'
      },
      {
        type: 'opportunity',
        icon: Target,
        title: 'Investment Opportunity',
        description: 'You have ₹18,000 ideal for SIP investment',
        impact: 'high',
        action: 'Explore mutual funds',
        color: 'success'
      }
    ],
    group: [
      {
        type: 'efficiency',
        icon: Zap,
        title: 'Group Efficiency',
        description: 'Your group settles 40% faster than average groups',
        impact: 'high',
        action: 'Great teamwork!',
        color: 'success'
      },
      {
        type: 'trend',
        icon: TrendingUp,
        title: 'Expense Pattern',
        description: 'Food expenses peak on weekends - consider budget limits',
        impact: 'medium',
        action: 'Set weekend budgets',
        color: 'warning'
      },
      {
        type: 'suggestion',
        icon: Brain,
        title: 'Smart Split',
        description: 'Consider using percentage splits for income-based fairness',
        impact: 'low',
        action: 'Discuss with group',
        color: 'primary'
      }
    ]
  };

  const currentInsights = insights[mode];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  const getInsightColor = (color: string) => {
    switch (color) {
      case 'success': return 'from-success/20 to-success/5 border-success/20';
      case 'warning': return 'from-warning/20 to-warning/5 border-warning/20';
      case 'primary': return 'from-primary/20 to-primary/5 border-primary/20';
      default: return 'from-secondary/20 to-secondary/5 border-secondary/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-cyber">
            AI-Powered Insights
          </h2>
          <p className="text-muted-foreground text-sm">
            Smart recommendations based on your financial behavior
          </p>
        </div>
        <Badge variant="outline" className="border-primary text-primary animate-pulse-glow">
          <Brain className="w-3 h-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card 
              key={index}
              className={`glass-card hover-lift animate-fade-in bg-gradient-to-br ${getInsightColor(insight.color)} border`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.color === 'success' ? 'bg-success/20' :
                      insight.color === 'warning' ? 'bg-warning/20' :
                      'bg-primary/20'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        insight.color === 'success' ? 'text-success' :
                        insight.color === 'warning' ? 'text-warning' :
                        'text-primary'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{insight.title}</h3>
                      <Badge className={`text-xs mt-1 ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs font-medium text-muted-foreground">
                    Recommended Action:
                  </span>
                  <span className={`text-xs font-medium ${
                    insight.color === 'success' ? 'text-success' :
                    insight.color === 'warning' ? 'text-warning' :
                    'text-primary'
                  }`}>
                    {insight.action}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI Score Card */}
      <Card className="glass-card bg-gradient-to-r from-primary/10 to-cyan/5">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gradient-cyber">Financial Health Score</h3>
              <p className="text-sm text-muted-foreground">AI-calculated based on your habits</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">87</div>
              <div className="text-xs text-muted-foreground">out of 100</div>
            </div>
          </div>
          
          <Progress value={87} className="h-3 mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-success font-semibold">92</div>
              <div className="text-muted-foreground">Savings</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold">85</div>
              <div className="text-muted-foreground">Budgeting</div>
            </div>
            <div className="text-center">
              <div className="text-warning font-semibold">78</div>
              <div className="text-muted-foreground">Spending</div>
            </div>
            <div className="text-center">
              <div className="text-success font-semibold">91</div>
              <div className="text-muted-foreground">Planning</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedInsights;