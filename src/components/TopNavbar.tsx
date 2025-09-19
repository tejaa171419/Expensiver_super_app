import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, User, Settings, LogOut, Wallet, CreditCard, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UniversalProfileButton from "@/components/UniversalProfileButton";
import ExpensiverLogo from "@/components/ExpensiverLogo";

interface TopNavbarProps {
  activeMode: 'group' | 'personal';
  onModeChange: (mode: 'group' | 'personal') => void;
  showLogo?: boolean;
  showModeToggle?: boolean;
  showOnlyProfile?: boolean;
}

const TopNavbar = ({ 
  activeMode, 
  onModeChange, 
  showLogo = true, 
  showModeToggle = true,
  showOnlyProfile = false 
}: TopNavbarProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <div className={`${showOnlyProfile ? '' : 'sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg'}`}>
      <div className={`flex items-center ${showOnlyProfile ? 'gap-3' : 'justify-between px-4 py-3'}`}>
        {/* Enhanced Logo */}
        {showLogo && (
          <ExpensiverLogo 
            size="md"
            showText={true}
            variant="default"
            onClick={handleLogoClick}
            className=""
          />
        )}

        {/* Enhanced Mode Toggle */}
        {showModeToggle && (
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
            <Button
              variant={activeMode === 'group' ? 'default' : 'ghost'}
              size="sm"
              className={`h-9 px-4 text-sm font-medium transition-all duration-300 ${
                activeMode === 'group'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => onModeChange('group')}
            >
              Group
            </Button>
            <Button
              variant={activeMode === 'personal' ? 'default' : 'ghost'}
              size="sm"
              className={`h-9 px-4 text-sm font-medium transition-all duration-300 ${
                activeMode === 'personal'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => onModeChange('personal')}
            >
              Personal
            </Button>
          </div>
        )}

        {/* Spacer for profile-only mode */}
        {showOnlyProfile && !showLogo && !showModeToggle && <div />}

        {/* Enhanced Right Section */}
        {!showOnlyProfile && (
          <div className="flex items-center gap-3">
            {/* Balance Display */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
              <Wallet className="w-4 h-4 text-green-400" />
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-sm font-semibold">
                ₹2,450
              </Badge>
            </div>

            {/* Enhanced Notification Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center bg-red-500 border-2 border-black animate-pulse"
              >
                3
              </Badge>
            </Button>

            {/* Enhanced Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-2 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                >
                  <Avatar className="w-6 h-6 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white/20">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-semibold">John Doe</p>
                      <p className="text-white/60 text-sm">john.doe@email.com</p>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-3" />
                  View Profile
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/wallet')}
                  className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200"
                >
                  <Wallet className="w-4 h-4 mr-3" />
                  Wallet
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payment Methods
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                  <Shield className="w-4 h-4 mr-3" />
                  Security
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-all duration-200">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Profile-only mode */}
        {showOnlyProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-2 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
              >
                <Avatar className="w-6 h-6 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">John Doe</p>
                    <p className="text-white/60 text-sm">john.doe@email.com</p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200"
              >
                <User className="w-4 h-4 mr-3" />
                View Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => navigate('/wallet')}
                className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200"
              >
                <Wallet className="w-4 h-4 mr-3" />
                Wallet
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                <CreditCard className="w-4 h-4 mr-3" />
                Payment Methods
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                <Shield className="w-4 h-4 mr-3" />
                Security
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-white/10" />
              
              <DropdownMenuItem className="p-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-all duration-200">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;