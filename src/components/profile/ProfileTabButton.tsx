import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const ProfileTabButton = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  className 
}: ProfileTabButtonProps) => {
  return (
    <Button
      variant={isActive ? "cyber" : "outline"}
      size="lg"
      className={cn(
        `
        relative group overflow-hidden transition-all duration-500 
        ${isActive 
          ? 'bg-gradient-primary text-primary-foreground shadow-glow scale-105 border-primary/50' 
          : 'bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 hover:border-primary/30 hover:scale-102'
        }
        `,
        className
      )}
      onClick={onClick}
    >
      {/* Background Effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
      )}
      
      {/* Icon with Glow Effect */}
      <Icon className={cn(
        "w-5 h-5 mr-3 transition-all duration-300",
        isActive ? "animate-pulse-glow" : "group-hover:text-primary"
      )} />
      
      {/* Label */}
      <span className="font-medium text-sm md:text-base">{label}</span>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute inset-0 border border-primary/30 rounded-lg animate-pulse"></div>
      )}
    </Button>
  );
};

export default ProfileTabButton;