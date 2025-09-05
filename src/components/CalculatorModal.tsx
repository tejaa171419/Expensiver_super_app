import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calculator, Divide, Minus, Plus, X, Equal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorModal = ({ isOpen, onClose }: CalculatorModalProps) => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const { toast } = useToast();

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay("0");
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(display);
    toast({
      title: "Copied! 📋",
      description: `${display} copied to clipboard`,
    });
  };

  const buttons = [
    { label: "AC", action: clear, type: "clear", span: "col-span-2" },
    { label: "CE", action: clearEntry, type: "clear" },
    { label: "÷", action: () => inputOperation("÷"), type: "operation" },
    
    { label: "7", action: () => inputNumber("7"), type: "number" },
    { label: "8", action: () => inputNumber("8"), type: "number" },
    { label: "9", action: () => inputNumber("9"), type: "number" },
    { label: "×", action: () => inputOperation("×"), type: "operation" },
    
    { label: "4", action: () => inputNumber("4"), type: "number" },
    { label: "5", action: () => inputNumber("5"), type: "number" },
    { label: "6", action: () => inputNumber("6"), type: "number" },
    { label: "-", action: () => inputOperation("-"), type: "operation" },
    
    { label: "1", action: () => inputNumber("1"), type: "number" },
    { label: "2", action: () => inputNumber("2"), type: "number" },
    { label: "3", action: () => inputNumber("3"), type: "number" },
    { label: "+", action: () => inputOperation("+"), type: "operation" },
    
    { label: "0", action: () => inputNumber("0"), type: "number", span: "col-span-2" },
    { label: ".", action: inputDecimal, type: "decimal" },
    { label: "=", action: performCalculation, type: "equals" },
  ];

  const getButtonClassName = (type: string, span?: string) => {
    const baseClass = "h-14 text-lg font-medium rounded-xl transition-all duration-200 active:scale-95";
    const spanClass = span || "";
    
    switch (type) {
      case "clear":
        return cn(baseClass, spanClass, "bg-destructive hover:bg-destructive/90 text-destructive-foreground");
      case "operation":
        return cn(baseClass, spanClass, "bg-primary hover:bg-primary/90 text-primary-foreground");
      case "equals":
        return cn(baseClass, spanClass, "bg-success hover:bg-success/90 text-success-foreground");
      case "decimal":
        return cn(baseClass, spanClass, "bg-warning hover:bg-warning/90 text-warning-foreground");
      default:
        return cn(baseClass, spanClass, "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient-cyber">
            <Calculator className="w-5 h-5" />
            Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Display */}
          <div className="relative">
            <div className="w-full p-4 text-right text-2xl font-mono bg-background/50 border border-border rounded-xl min-h-[60px] flex items-center justify-end">
              <span className="truncate">{display}</span>
            </div>
            
            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={copyResult}
              className="absolute top-2 left-2 text-xs"
            >
              Copy
            </Button>
          </div>

          {/* Operation indicator */}
          {operation && (
            <div className="text-center text-sm text-muted-foreground">
              {previousValue} {operation} {waitingForNewValue ? "" : display}
            </div>
          )}

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.action}
                className={getButtonClassName(button.type, button.span)}
                variant="ghost"
              >
                {button.label}
              </Button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDisplay(String(Math.PI.toFixed(6)))}
              className="flex-1"
            >
              π
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDisplay(String(Math.E.toFixed(6)))}
              className="flex-1"
            >
              e
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))}
              className="flex-1"
            >
              √
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;