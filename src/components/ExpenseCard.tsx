import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Calendar, Tag, User } from "lucide-react";
interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  paidBy?: string;
  splitBetween?: string[];
}
const ExpenseCard = ({
  title,
  amount,
  type,
  category,
  date,
  description,
  paidBy,
  splitBetween
}: ExpenseCardProps) => {
  const isPositive = type === 'income';
  return <Card className={`glass-card hover-scale ${isPositive ? 'expense-positive' : 'expense-negative'} transition-all duration-300`}>
      <div className="p-4 bg-gradient-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isPositive ? 'bg-success/20' : 'bg-destructive/20'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4 text-success" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : '-'}₹{Math.abs(amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
          </div>
          
          {paidBy && <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Paid by {paidBy}</span>
            </div>}
        </div>

        {splitBetween && splitBetween.length > 0 && <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Split between: {splitBetween.join(', ')}
            </p>
          </div>}
      </div>
    </Card>;
};
export default ExpenseCard;