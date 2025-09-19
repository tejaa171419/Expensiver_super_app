import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ExpenseCard from '../ExpenseCard';
import { mockExpense, mockExpenseIncome, mockGroupExpense } from '@/test/test-utils';

describe('ExpenseCard', () => {
  it('renders expense card with basic information', () => {
    render(<ExpenseCard {...mockExpense} />);
    
    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('Test expense description')).toBeInTheDocument();
    expect(screen.getByText('-₹100')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('renders income card with positive styling', () => {
    render(<ExpenseCard {...mockExpenseIncome} />);
    
    expect(screen.getByText('Test Income')).toBeInTheDocument();
    expect(screen.getByText('+₹500')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('displays paid by information for group expenses', () => {
    render(<ExpenseCard {...mockGroupExpense} />);
    
    expect(screen.getByText('Paid by John Doe')).toBeInTheDocument();
  });

  it('displays split between information when provided', () => {
    render(<ExpenseCard {...mockGroupExpense} />);
    
    expect(screen.getByText('Split between: John Doe, Jane Smith, Bob Johnson')).toBeInTheDocument();
  });

  it('applies correct CSS classes for expense type', () => {
    const { rerender } = render(<ExpenseCard {...mockExpense} />);
    
    // Check for expense styling
    expect(screen.getByText('Test Expense').closest('.glass-card')).toHaveClass('expense-negative');
    
    rerender(<ExpenseCard {...mockExpenseIncome} />);
    
    // Check for income styling
    expect(screen.getByText('Test Income').closest('.glass-card')).toHaveClass('expense-positive');
  });

  it('displays correct icons for income and expense', () => {
    const { rerender } = render(<ExpenseCard {...mockExpense} />);
    
    // Check for expense icon (ArrowDownRight) - SVGs don't have img role by default
    expect(screen.getByText('Test Expense').closest('.glass-card')).toContainHTML('lucide-arrow-down-right');
    
    rerender(<ExpenseCard {...mockExpenseIncome} />);
    
    // Check for income icon (ArrowUpRight)
    expect(screen.getByText('Test Income').closest('.glass-card')).toContainHTML('lucide-arrow-up-right');
  });

  it('renders without optional fields', () => {
    const minimalExpense = {
      id: '3',
      title: 'Minimal Expense',
      amount: 50,
      type: 'expense' as const,
      category: 'Misc',
      date: '2024-01-02',
    };

    render(<ExpenseCard {...minimalExpense} />);
    
    expect(screen.getByText('Minimal Expense')).toBeInTheDocument();
    expect(screen.getByText('-₹50')).toBeInTheDocument();
    expect(screen.queryByText('Paid by')).not.toBeInTheDocument();
    expect(screen.queryByText('Split between')).not.toBeInTheDocument();
  });

  it('formats amount with proper locale string', () => {
    const highAmountExpense = {
      ...mockExpense,
      amount: 1234567,
    };

    render(<ExpenseCard {...highAmountExpense} />);
    
    // The actual implementation uses Indian locale formatting (12,34,567)
    // Use a more specific selector to target just the amount paragraph
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'P' && 
             (element?.textContent?.includes('-₹12,34,567') ?? false);
    })).toBeInTheDocument();
  });
});
