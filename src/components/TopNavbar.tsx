import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import UniversalProfileButton from "@/components/UniversalProfileButton";

interface TopNavbarProps {
  activeMode: 'group' | 'personal';
  onModeChange: (mode: 'group' | 'personal') => void;
}

const TopNavbar = ({ activeMode, onModeChange }: TopNavbarProps) => {
  return (
    <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-foreground text-lg">Wallet</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <Button
            variant={activeMode === 'group' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onModeChange('group')}
          >
            Group
          </Button>
          <Button
            variant={activeMode === 'personal' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onModeChange('personal')}
          >
            Personal
          </Button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs px-2">
            ₹2,450
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-1 h-8 w-8"
            onClick={() => window.location.href = '/notifications'}
          >
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
          <UniversalProfileButton 
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
          />
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;