import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavigationProvider } from '@/contexts/NavigationContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockExpense = {
  id: '1',
  title: 'Test Expense',
  amount: 100,
  type: 'expense' as const,
  category: 'Food',
  date: '2024-01-01',
  description: 'Test expense description',
};

export const mockExpenseIncome = {
  id: '2',
  title: 'Test Income',
  amount: 500,
  type: 'income' as const,
  category: 'Salary',
  date: '2024-01-01',
  description: 'Test income description',
};

export const mockGroupExpense = {
  ...mockExpense,
  paidBy: 'John Doe',
  splitBetween: ['John Doe', 'Jane Smith', 'Bob Johnson'],
};

// Mock user data
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

// Mock group data
export const mockGroup = {
  id: '1',
  name: 'Test Group',
  description: 'Test group description',
  members: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ],
  expenses: [mockGroupExpense],
  totalExpenses: 100,
  createdAt: '2024-01-01T00:00:00Z',
};

// Helper functions for testing
export const createMockQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Mock implementations for common hooks
export const mockNavigate = vi.fn();
export const mockToast = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the mobile hook
export const mockIsMobile = vi.fn(() => false);
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: mockIsMobile,
}));
