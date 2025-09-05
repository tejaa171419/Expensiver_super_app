import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TopNavbar from "@/components/TopNavbar";
import HorizontalSubNavbar from "@/components/HorizontalSubNavbar";
import Navigation from "@/components/Navigation";

interface LayoutProps {
  children: ReactNode;
  activeMode: 'group' | 'personal';
  onModeChange: (mode: 'group' | 'personal') => void;
  activeSubNav: string;
  onSubNavChange: (nav: string) => void;
}

const Layout = ({ 
  children, 
  activeMode, 
  onModeChange, 
  activeSubNav, 
  onSubNavChange 
}: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-background">
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <TopNavbar 
            activeMode={activeMode}
            onModeChange={onModeChange}
          />
          <HorizontalSubNavbar 
            activeMode={activeMode}
            activeSubNav={activeSubNav}
            onSubNavChange={onSubNavChange}
          />
        </>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <Navigation 
          activeMode={activeMode} 
          onModeChange={onModeChange}
          activeSubNav={activeSubNav}
          onSubNavChange={onSubNavChange}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${
        isMobile 
          ? 'pt-[128px] pb-24' // TopNavbar (55px) + HorizontalSubNavbar (73px) 
          : 'pt-32 pb-8'
      }`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;