import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  subtitle?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  subtitle
}: StatsCardProps) => {
  const colorClasses = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-to-br from-warning to-warning/80',
    destructive: 'bg-gradient-to-br from-destructive to-destructive/80'
  };

  const glowClasses = {
    primary: 'group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]',
    success: 'group-hover:shadow-[0_0_30px_hsl(var(--success)/0.4)]',
    warning: 'group-hover:shadow-[0_0_30px_hsl(var(--warning)/0.4)]',
    destructive: 'group-hover:shadow-[0_0_30px_hsl(var(--destructive)/0.4)]'
  };

  return (
    <Card className="group glass-card hover-lift animate-fade-in relative overflow-hidden border-white/10">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card/95 to-card/90" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -skew-x-12 animate-pulse" />
      </div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Icon with Glow Effect */}
          <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-lg transform transition-all duration-300 group-hover:scale-110 ${glowClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Trend Indicator */}
          {trend && (
            <div className="text-right">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                trend.value >= 0 
                  ? 'text-success bg-success/10 border-success/20 group-hover:bg-success/20' 
                  : 'text-destructive bg-destructive/10 border-destructive/20 group-hover:bg-destructive/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                  trend.value >= 0 ? 'bg-success' : 'bg-destructive'
                }`} />
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </h3>
          
          <div>
            <p className="text-3xl font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-primary">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Progress Bar for Trend */}
        {trend && (
          <div className="mt-4">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  trend.value >= 0 ? 'bg-success' : 'bg-destructive'
                }`}
                style={{ 
                  width: `${Math.min(Math.abs(trend.value), 100)}%`,
                  transform: 'translateX(-100%)',
                  animation: 'slideInRight 1s ease-out 0.5s forwards'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Hover Border Glow */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 ${
        color === 'primary' ? 'group-hover:border-primary/30' :
        color === 'success' ? 'group-hover:border-success/30' :
        color === 'warning' ? 'group-hover:border-warning/30' :
        'group-hover:border-destructive/30'
      }`} />
    </Card>
  );
};

export default StatsCard;