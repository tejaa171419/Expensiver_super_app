import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Upload, Download, Scan, Send, Calculator } from "lucide-react";
interface QuickActionsProps {
  mode: 'group' | 'personal';
  onAddExpense?: () => void;
  onSendMoney?: () => void;
  onScanQR?: () => void;
  onCalculate?: () => void;
}
const QuickActions = ({
  mode,
  onAddExpense,
  onSendMoney,
  onScanQR,
  onCalculate
}: QuickActionsProps) => {
  const groupActions = [{
    id: 'add-expense',
    label: 'Add Expense',
    icon: Plus,
    color: 'primary'
  }, {
    id: 'settle-up',
    label: 'Settle Up',
    icon: Send,
    color: 'success'
  }, {
    id: 'scan-receipt',
    label: 'Scan Receipt',
    icon: Scan,
    color: 'warning'
  }, {
    id: 'split-bill',
    label: 'Split Bill',
    icon: Calculator,
    color: 'primary'
  }];
  const personalActions = [{
    id: 'add-income',
    label: 'Add Income',
    icon: Upload,
    color: 'success'
  }, {
    id: 'add-expense',
    label: 'Add Expense',
    icon: Download,
    color: 'destructive'
  }, {
    id: 'scan-receipt',
    label: 'Scan Receipt',
    icon: Scan,
    color: 'warning'
  }, {
    id: 'calculate',
    label: 'Calculator',
    icon: Calculator,
    color: 'primary'
  }];
  const actions = mode === 'group' ? groupActions : personalActions;
  
  const getButtonVariant = (color: string) => {
    switch (color) {
      case 'success':
        return 'default';
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'add-expense':
      case 'add-income':
        onAddExpense?.();
        break;
      case 'settle-up':
      case 'send-money':
        onSendMoney?.();
        break;
      case 'scan-receipt':
        onScanQR?.();
        break;
      case 'split-bill':
      case 'calculate':
        onCalculate?.();
        break;
    }
  };
  return <Card className="glass-card animate-slide-up">
      <div className="p-6 bg-gradient-card">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => {
          const Icon = action.icon;
          return <Button 
            key={action.id} 
            variant={getButtonVariant(action.color)} 
            className="h-16 flex flex-col items-center justify-center space-y-1 hover-scale bg-gradient-to-br from-secondary to-accent text-secondary-foreground hover:from-accent hover:to-secondary backdrop-blur-sm border border-primary/20"
            onClick={() => handleActionClick(action.id)}
          >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{action.label}</span>
              </Button>;
        })}
        </div>
      </div>
    </Card>;
};
export default QuickActions;