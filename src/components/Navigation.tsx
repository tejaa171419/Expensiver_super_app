import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, User, Home, Plus, UserPlus, Wallet, PieChart, History, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import UniversalProfileButton from "@/components/UniversalProfileButton";

interface NavigationProps {
  activeMode: 'group' | 'personal';
  onModeChange: (mode: 'group' | 'personal') => void;
  activeSubNav: string;
  onSubNavChange: (nav: string) => void;
}

const Navigation = ({ activeMode, onModeChange, activeSubNav, onSubNavChange }: NavigationProps) => {
  const isMobile = useIsMobile();

  const groupNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create-group', label: 'Create Group', icon: Plus },
    { id: 'join-group', label: 'Join Group', icon: UserPlus },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
  ];

  const personalNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
  ];

  const currentNavItems = activeMode === 'group' ? groupNavItems : personalNavItems;

  // Hide navigation on mobile - will be replaced by MobileNavigation
  if (isMobile) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto container-desktop">
        {/* Main Mode Toggle */}
        <div className="flex items-center justify-between py-4">
          {/* Logo and Mode Toggles */}
          <div className="flex items-center space-x-6">
            <div className="text-gradient-cyber font-bold text-xl">
              Zenith Wallet
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={activeMode === 'group' ? 'default' : 'ghost'}
                size="default"
                onClick={() => onModeChange('group')}
                className={`${
                  activeMode === 'group' 
                    ? 'nav-active' 
                    : 'nav-inactive'
                } transition-all duration-300 hover-lift`}
              >
                <Users className="w-5 h-5 mr-3" />
                Group Expenses
              </Button>
              <Button
                variant={activeMode === 'personal' ? 'default' : 'ghost'}
                size="default"
                onClick={() => onModeChange('personal')}
                className={`${
                  activeMode === 'personal' 
                    ? 'nav-active' 
                    : 'nav-inactive'
                } transition-all duration-300 hover-lift`}
              >
                <User className="w-5 h-5 mr-3" />
                Personal Finance
              </Button>
            </div>
          </div>

          {/* Universal Profile Button */}
          <UniversalProfileButton 
            showLabel={true}
            variant="ghost"
            size="default"
            className="nav-inactive transition-all duration-300 hover-lift"
          />
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-2 pb-4">
          {currentNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="default"
                onClick={() => onSubNavChange(item.id)}
                className={`${
                  activeSubNav === item.id 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                } transition-all duration-300 whitespace-nowrap hover-lift animate-slide-in-left`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;