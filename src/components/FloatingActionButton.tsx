import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Send, CreditCard, Scan, Calculator, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onAddExpense?: () => void;
  onSendMoney?: () => void;
  onScanQR?: () => void;
  onCalculate?: () => void;
}

const FloatingActionButton = ({ 
  onAddExpense, 
  onSendMoney, 
  onScanQR, 
  onCalculate 
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: CreditCard,
      label: "Add Expense",
      onClick: onAddExpense,
      color: "bg-destructive hover:bg-destructive/90"
    },
    {
      icon: Send,
      label: "Send Money",
      onClick: onSendMoney,
      color: "bg-success hover:bg-success/90"
    },
    {
      icon: Scan,
      label: "Scan QR",
      onClick: onScanQR,
      color: "bg-warning hover:bg-warning/90"
    },
    {
      icon: Calculator,
      label: "Calculator",
      onClick: onCalculate,
      color: "bg-secondary hover:bg-secondary/90"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={action.label}
                className="flex items-center gap-3 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground border border-border">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg hover-scale",
                    action.color
                  )}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        className={cn(
          "w-14 h-14 rounded-full shadow-lg hover-scale animate-pulse-glow btn-cyber",
          "bg-gradient-cyber border-0 text-white"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-rotate" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;