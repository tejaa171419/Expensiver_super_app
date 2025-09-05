import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileOptimizedCardProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

const MobileOptimizedCard = ({
  children,
  className = "",
  mobileClassName = "",
  desktopClassName = ""
}: MobileOptimizedCardProps) => {
  const isMobile = useIsMobile();
  
  const combinedClassName = `
    glass-card
    ${className}
    ${isMobile ? `p-4 m-2 ${mobileClassName}` : `p-6 ${desktopClassName}`}
    ${isMobile ? 'hover:scale-[1.02]' : 'hover-scale'}
    animate-fade-in
  `.trim();

  return (
    <Card className={combinedClassName}>
      {children}
    </Card>
  );
};

export default MobileOptimizedCard;