import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileActionButtonProps {
  icon?: LucideIcon;
  label: string;
  variant?: 'primary' | 'success' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ProfileActionButton = ({ 
  icon: Icon, 
  label, 
  variant = 'primary',
  size = 'default',
  onClick, 
  disabled = false,
  loading = false,
  className 
}: ProfileActionButtonProps) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary': return 'cyber';
      case 'success': return 'success';
      case 'destructive': return 'destructive';
      case 'outline': return 'outline';
      case 'ghost': return 'ghost';
      default: return 'cyber';
    }
  };

  return (
    <Button
      variant={getVariant()}
      size={size}
      disabled={disabled || loading}
      className={cn(
        `
        relative group overflow-hidden transition-all duration-300 hover-lift
        ${variant === 'primary' ? 'shadow-glow hover:shadow-large' : ''}
        ${loading ? 'animate-pulse' : ''}
        `,
        className
      )}
      onClick={onClick}
    >
      {/* Loading Spinner Effect */}
      {loading && (
        <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
      )}
      
      {/* Icon */}
      {Icon && (
        <Icon className={cn(
          "w-4 h-4 transition-all duration-300",
          label ? "mr-2" : "",
          loading ? "animate-spin" : ""
        )} />
      )}
      
      {/* Label */}
      <span className="font-medium relative z-10">{label}</span>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </Button>
  );
};

export default ProfileActionButton;