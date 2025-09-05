import { Button } from "@/components/ui/button";
import { Plus, Send, Scan, Calculator } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StickyActionBarProps {
  onAddExpense?: () => void;
  onSendMoney?: () => void;
  onScanQR?: () => void;
  onCalculate?: () => void;
  mode?: 'group' | 'personal';
}

const StickyActionBar = ({
  onAddExpense,
  onSendMoney,
  onScanQR,
  onCalculate,
  mode = 'group'
}: StickyActionBarProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null; // Only show on mobile
  }

  const actions = [
    {
      icon: Plus,
      label: mode === 'group' ? 'Add Expense' : 'Add Transaction',
      onClick: onAddExpense,
      variant: 'default' as const,
      className: 'flex-1'
    },
    {
      icon: Send,
      label: 'Send Money',
      onClick: onSendMoney,
      variant: 'success' as const,
      className: 'flex-1'
    },
    {
      icon: Scan,
      label: 'Scan QR',
      onClick: onScanQR,
      variant: 'outline' as const,
      className: 'aspect-square'
    },
    {
      icon: Calculator,
      label: 'Calculate',
      onClick: onCalculate,
      variant: 'outline' as const,
      className: 'aspect-square'
    }
  ];

  return (
    <div className="mobile-sticky-actions">
      <div className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-large">
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                size="default"
                className={`
                  ${action.className}
                  touch-target
                  transition-all duration-300
                  hover-scale
                  flex-col gap-1
                  text-xs
                  h-auto
                  py-3
                  ${index < 2 ? 'px-4' : 'px-3'}
                `}
                onClick={action.onClick}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;