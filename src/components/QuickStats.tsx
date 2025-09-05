import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Eye } from "lucide-react";

interface QuickStatsProps {
  totalGroups: number;
  activeGroups: number;
  totalExpenses: number;
  totalMembers: number;
}

const QuickStats = ({ totalGroups, activeGroups, totalExpenses, totalMembers }: QuickStatsProps) => {
  const stats = [
    {
      icon: Users,
      value: totalGroups,
      label: "Total Groups",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      value: activeGroups,
      label: "Active Groups", 
      color: "text-success"
    },
    {
      icon: DollarSign,
      value: totalExpenses.toFixed(0),
      label: "Total Expenses",
      color: "text-warning"
    },
    {
      icon: Eye,
      value: totalMembers,
      label: "Total Members",
      color: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className="glass-card text-center p-4 hover-lift"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div className="text-2xl font-bold text-white animate-bounce-in">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;