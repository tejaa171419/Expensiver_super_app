import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Wallet, 
  BarChart3, 
  History, 
  CreditCard, 
  Plus,
  UserPlus,
  Settings,
  Bell
} from "lucide-react";

interface HorizontalSubNavbarProps {
  activeMode: 'group' | 'personal';
  activeSubNav: string;
  onSubNavChange: (nav: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const HorizontalSubNavbar = ({ activeMode, activeSubNav, onSubNavChange }: HorizontalSubNavbarProps) => {
  const groupNavItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'create-group', label: 'Create', icon: Plus, badge: 'New' },
    { id: 'join-group', label: 'Join', icon: UserPlus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ];

  const personalNavItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ];

  const navItems = activeMode === 'group' ? groupNavItems : personalNavItems;

  return (
    <div className="sticky top-[55px] z-40 bg-card/90 backdrop-blur-lg border-b border-primary/20 shadow-medium">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 min-w-max touch-pan-x">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubNav === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'cyber' : 'ghost'}
                  size="sm"
                  className={`
                    flex items-center gap-2 h-11 px-4 whitespace-nowrap relative transition-all duration-300 rounded-lg
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow scale-105 border border-primary/30' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 hover:scale-102 border border-transparent'
                    }
                  `}
                  onClick={() => onSubNavChange(item.id)}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse-glow' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && !isActive && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 text-xs px-2 py-0.5 h-5 bg-gradient-success text-success-foreground animate-pulse-glow"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-primary rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 h-11 px-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-300 rounded-lg relative"
            onClick={() => window.location.href = '/notifications'}
          >
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalSubNavbar;