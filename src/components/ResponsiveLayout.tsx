import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveLayoutProps {
  children: ReactNode;
  mobileLayout?: ReactNode;
  desktopLayout?: ReactNode;
}

const ResponsiveLayout = ({ 
  children, 
  mobileLayout, 
  desktopLayout 
}: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  
  if (mobileLayout && isMobile) {
    return <>{mobileLayout}</>;
  }
  
  if (desktopLayout && !isMobile) {
    return <>{desktopLayout}</>;
  }
  
  return <>{children}</>;
};

export default ResponsiveLayout;