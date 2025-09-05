import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversalProfileButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

const UniversalProfileButton = ({ 
  className,
  variant = 'ghost',
  size = 'default',
  showLabel = false
}: UniversalProfileButtonProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleProfileClick}
      className={cn(
        "relative group overflow-hidden transition-all duration-300 hover-lift",
        "hover:bg-primary/10 hover:border-primary/30",
        className
      )}
    >
      <Avatar className="w-6 h-6 mr-2 border border-primary/20">
        <AvatarImage src="" alt="Profile" />
        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
          <User className="w-3 h-3" />
        </AvatarFallback>
      </Avatar>
      
      {showLabel && (
        <span className="font-medium">Profile</span>
      )}
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </Button>
  );
};

export default UniversalProfileButton;