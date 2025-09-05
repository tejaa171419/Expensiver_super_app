import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "@/components/TopNavbar";
import HorizontalSubNavbar from "@/components/HorizontalSubNavbar";
import StickyActionBar from "@/components/StickyActionBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Dashboard from "./Dashboard";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import Wallet from "./Wallet";
import Analytics from "./Analytics";
import History from "./History";
import Profile from "./Profile";
import Groups from "./Groups";
import WelcomeHero from "@/components/WelcomeHero";
import FloatingActionButton from "@/components/FloatingActionButton";
import AddExpenseModal from "@/components/AddExpenseModal";
import CalculatorModal from "@/components/CalculatorModal";
import QRScannerModal from "@/components/QRScannerModal";
import PullToRefresh from "@/components/PullToRefresh";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'group' | 'personal'>('group');
  const [activeSubNav, setActiveSubNav] = useState('home');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if user is new (this would typically come from auth/storage)
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsNewUser(false);
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisited', 'true');
    setIsNewUser(false);
  };

  const handleNavigation = (nav: string) => {
    // Handle profile navigation
    if (nav === 'profile') {
      navigate('/profile');
      return;
    }
    
    // For all other navigation, set the sub nav (stays on current page)
    setActiveSubNav(nav);
  };

  const handleFloatingAction = (action: string) => {
    switch (action) {
      case 'addExpense':
        setShowAddExpense(true);
        break;
      case 'sendMoney':
        setActiveSubNav('wallet');
        toast({
          title: "Send Money",
          description: "Navigating to wallet...",
        });
        break;
      case 'scanQR':
        setShowQRScanner(true);
        break;
      case 'calculate':
        setShowCalculator(true);
        break;
    }
  };

  const handleRefresh = async () => {
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Refreshed!",
      description: "Data has been updated.",
    });
  };

  const renderContent = () => {
    // Show welcome hero for new users
    if (isNewUser && showWelcome && activeSubNav === 'home') {
      return (
        <WelcomeHero 
          onDismiss={handleWelcomeDismiss} 
          onCreateGroup={() => handleNavigation('create-group')}
          onStartPersonalTracking={() => {
            setActiveMode('personal');
            setActiveSubNav('expenses');
          }}
        />
      );
    }

    switch (activeSubNav) {
      case 'home':
        if (activeMode === 'group') {
          return <Groups />;
        } else {
          return (
            <Dashboard 
              mode="personal" 
              onAddExpense={() => handleFloatingAction('addExpense')}
              onSendMoney={() => handleFloatingAction('sendMoney')}
              onScanQR={() => handleFloatingAction('scanQR')}
              onCalculate={() => handleFloatingAction('calculate')}
            />
          );
        }
      case 'create-group':
        return <CreateGroup />;
      case 'join-group':
        return <JoinGroup />;
      case 'wallet':
        return <Wallet />;
      case 'analytics':
        return <Analytics mode={activeMode} />;
      case 'history':
        return <History mode={activeMode} />;
      case 'expenses':
        return (
          <Dashboard 
            mode="personal" 
            onAddExpense={() => handleFloatingAction('addExpense')}
            onSendMoney={() => handleFloatingAction('sendMoney')}
            onScanQR={() => handleFloatingAction('scanQR')}
            onCalculate={() => handleFloatingAction('calculate')}
          />
        );
      default:
        return (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">{activeSubNav} Page</h2>
              <p className="text-muted-foreground">This section is under construction</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-background">
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Mobile Top Navigation */}
          <TopNavbar 
            activeMode={activeMode}
            onModeChange={setActiveMode}
          />
          <HorizontalSubNavbar 
            activeMode={activeMode}
            activeSubNav={activeSubNav}
            onSubNavChange={handleNavigation}
          />

          {/* Mobile Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 pb-24 max-w-7xl mx-auto">
              <PullToRefresh onRefresh={handleRefresh}>
                <div className="animate-fade-in">
                  {renderContent()}
                </div>
              </PullToRefresh>
            </div>
          </main>
        </>
      ) : (
        /* Desktop Layout with Sidebar */
        <SidebarProvider>
          <AppSidebar 
            activeMode={activeMode}
            onModeChange={setActiveMode}
            activeSubNav={activeSubNav}
            onSubNavChange={handleNavigation}
          />
          <SidebarInset>
            {/* Desktop Header */}
            <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-card/50 backdrop-blur-sm">
              <SidebarTrigger className="mr-2" />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">
                  {activeSubNav === 'home' ? `${activeMode === 'group' ? 'Group' : 'Personal'} Dashboard` :
                   activeSubNav === 'create-group' ? 'Create Group' :
                   activeSubNav === 'join-group' ? 'Join Group' :
                   activeSubNav === 'profile' ? 'Profile & Settings' :
                   activeSubNav.charAt(0).toUpperCase() + activeSubNav.slice(1)}
                </h1>
              </div>
            </header>

            {/* Desktop Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-fade-in">
                  {renderContent()}
                </div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}

      {/* Mobile Sticky Action Bar */}
      {isMobile && !(isNewUser && showWelcome && activeSubNav === 'home') && (
        <StickyActionBar
          onAddExpense={() => handleFloatingAction('addExpense')}
          onSendMoney={() => handleFloatingAction('sendMoney')}
          onScanQR={() => handleFloatingAction('scanQR')}
          onCalculate={() => handleFloatingAction('calculate')}
          mode={activeMode}
        />
      )}

      {/* Desktop Floating Action Button */}
      {!isMobile && !(isNewUser && showWelcome && activeSubNav === 'home') && (
        <FloatingActionButton
          onAddExpense={() => handleFloatingAction('addExpense')}
          onSendMoney={() => handleFloatingAction('sendMoney')}
          onScanQR={() => handleFloatingAction('scanQR')}
          onCalculate={() => handleFloatingAction('calculate')}
        />
      )}

        {/* Add Expense Modal */}
        <AddExpenseModal 
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          mode={activeMode}
        />

        {/* Calculator Modal */}
        <CalculatorModal 
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />

      {/* QR Scanner Modal */}
      <QRScannerModal 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
};

export default Index;
