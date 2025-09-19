import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  User, 
  Home, 
  Plus, 
  UserPlus, 
  Wallet, 
  PieChart, 
  History, 
  Settings, 
  TrendingUp,
  Menu,
  ChevronDown,
  LogOut,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExpensiverCompactLogo } from "@/components/ExpensiverLogo";

interface AppSidebarProps {
  activeMode: 'group' | 'personal';
  onModeChange: (mode: 'group' | 'personal') => void;
  activeSubNav: string;
  onSubNavChange: (nav: string) => void;
}

export function AppSidebar({ activeMode, onModeChange, activeSubNav, onSubNavChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const [groupOpen, setGroupOpen] = useState(activeMode === 'group');
  const [personalOpen, setPersonalOpen] = useState(activeMode === 'personal');

  const groupNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'create-group', label: 'Create Group', icon: Plus },
    { id: 'join-group', label: 'Join Group', icon: UserPlus },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
  ];

  const personalNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (nav: string, mode?: 'group' | 'personal') => {
    if (mode && mode !== activeMode) {
      onModeChange(mode);
      if (mode === 'group') {
        setGroupOpen(true);
        setPersonalOpen(false);
      } else {
        setPersonalOpen(true);
        setGroupOpen(false);
      }
    }
    
    // Handle special navigation cases
    if (nav === 'notifications') {
      window.location.href = '/notifications';
      return;
    }
    
    onSubNavChange(nav);
  };

  return (
    <Sidebar className="border-r border-white/10 bg-card/95 backdrop-blur-xl">
      {/* Header */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <ExpensiverCompactLogo 
            size="md"
            variant="default"
            onClick={() => navigate('/')}
            className="cursor-pointer"
          />
          {!collapsed && (
            <div>
              <h2 className="text-gradient-cyber font-bold text-lg">
                Expensiver
              </h2>
              <p className="text-xs text-muted-foreground">
                Smart Expense Tracker
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Group Expenses Section */}
        <SidebarGroup>
          <Collapsible open={groupOpen} onOpenChange={setGroupOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {!collapsed && "Group Expenses"}
                </div>
                {!collapsed && (
                  <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/label:rotate-180" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupNavItems.map((item) => (
                    <SidebarMenuItem key={`group-${item.id}`}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeMode === 'group' && activeSubNav === item.id}
                      >
                        <button
                          onClick={() => handleNavClick(item.id, 'group')}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            activeMode === 'group' && activeSubNav === item.id
                              ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Personal Finance Section */}
        <SidebarGroup>
          <Collapsible open={personalOpen} onOpenChange={setPersonalOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {!collapsed && "Personal Finance"}
                </div>
                {!collapsed && (
                  <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/label:rotate-180" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {personalNavItems.map((item) => (
                    <SidebarMenuItem key={`personal-${item.id}`}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeMode === 'personal' && activeSubNav === item.id}
                      >
                        <button
                          onClick={() => handleNavClick(item.id, 'personal')}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            activeMode === 'personal' && activeSubNav === item.id
                              ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-2 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {!collapsed && "Account"}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeSubNav === 'notifications'}>
                  <button
                    onClick={() => handleNavClick('notifications')}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSubNav === 'notifications'
                        ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Bell className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>Notifications</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeSubNav === 'profile'}>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSubNav === 'profile'
                        ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>Profile & Settings</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Enhanced Footer */}
      <SidebarFooter className="border-t border-white/10 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto bg-white/5 hover:bg-white/10 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="w-8 h-8 border border-primary/20">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      User Account
                    </p>
                    <p className="text-xs text-white/60">
                      Premium Plan
                    </p>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-black/95 backdrop-blur-xl border border-white/10">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="p-3 text-white/80 hover:text-white hover:bg-white/10">
              <User className="w-4 h-4 mr-3" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}