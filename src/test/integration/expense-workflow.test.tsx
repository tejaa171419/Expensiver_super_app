import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import App from '@/App';

// Mock the navigation context and other providers
const mockNavigationContext = {
  isOpen: false,
  setIsOpen: vi.fn(),
  activeSection: 'dashboard',
  setActiveSection: vi.fn(),
};

vi.mock('@/contexts/NavigationContext', () => ({
  NavigationProvider: ({ children }: any) => children,
  useNavigation: () => mockNavigationContext,
}));

// Mock localStorage to control user state
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock API calls
const mockApiCall = vi.fn();
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe('Expense Management Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome screen
  });

  it('completes full expense creation workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for app to load
    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Navigate to add expense
    const addExpenseButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addExpenseButton);

    // Fill expense form
    const titleInput = screen.getByLabelText(/expense title/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    await user.type(titleInput, 'Team Lunch');
    await user.type(amountInput, '500');

    // Select category
    const categorySelect = screen.getByRole('combobox');
    await user.click(categorySelect);
    await user.click(screen.getByText('Food & Dining'));

    // Add description
    const notesInput = screen.getByPlaceholderText(/add notes/i);
    await user.type(notesInput, 'Lunch with the development team');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/expense added successfully/i)).toBeInTheDocument();
    });

    // Verify expense appears in list
    await waitFor(() => {
      expect(screen.getByText('Team Lunch')).toBeInTheDocument();
      expect(screen.getByText('₹500')).toBeInTheDocument();
    });
  });

  it('completes group creation and expense splitting workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Navigate to create group
    const createGroupButton = screen.getByRole('button', { name: /create group/i });
    await user.click(createGroupButton);

    // Fill group form
    const groupNameInput = screen.getByLabelText(/group name/i);
    const groupDescInput = screen.getByLabelText(/description/i);

    await user.type(groupNameInput, 'Development Team');
    await user.type(groupDescInput, 'Expense sharing for our dev team');

    // Add members
    const addMemberButton = screen.getByRole('button', { name: /add member/i });
    await user.click(addMemberButton);

    const memberEmailInput = screen.getByLabelText(/email/i);
    await user.type(memberEmailInput, 'john@example.com');

    const inviteButton = screen.getByRole('button', { name: /invite/i });
    await user.click(inviteButton);

    // Create group
    const createButton = screen.getByRole('button', { name: /create group/i });
    await user.click(createButton);

    // Verify group creation success
    await waitFor(() => {
      expect(screen.getByText(/group created successfully/i)).toBeInTheDocument();
    });

    // Now add a group expense
    const addGroupExpenseButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addGroupExpenseButton);

    // Fill group expense form
    await user.type(screen.getByLabelText(/expense title/i), 'Team Dinner');
    await user.type(screen.getByLabelText(/amount/i), '1200');

    // Select who paid
    const payerSelect = screen.getByLabelText(/who paid/i);
    await user.click(payerSelect);
    await user.click(screen.getByText('You'));

    // Configure split
    const splitTypeRadio = screen.getByRole('radio', { name: /split equally/i });
    await user.click(splitTypeRadio);

    // Submit group expense
    const submitGroupExpenseButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitGroupExpenseButton);

    // Verify group expense creation
    await waitFor(() => {
      expect(screen.getByText('Team Dinner')).toBeInTheDocument();
      expect(screen.getByText('₹1,200')).toBeInTheDocument();
      expect(screen.getByText(/split between/i)).toBeInTheDocument();
    });
  });

  it('completes expense filtering and search workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Navigate to expenses history
    const historyButton = screen.getByRole('button', { name: /history/i });
    await user.click(historyButton);

    // Use search functionality
    const searchInput = screen.getByPlaceholderText(/search expenses/i);
    await user.type(searchInput, 'lunch');

    // Verify filtered results
    await waitFor(() => {
      expect(screen.getByText(/filtered results/i)).toBeInTheDocument();
    });

    // Apply category filter
    const categoryFilterButton = screen.getByRole('button', { name: /filter by category/i });
    await user.click(categoryFilterButton);
    await user.click(screen.getByText('Food & Dining'));

    // Apply date range filter
    const dateRangeButton = screen.getByRole('button', { name: /date range/i });
    await user.click(dateRangeButton);
    
    // Select this month
    const thisMonthOption = screen.getByText('This Month');
    await user.click(thisMonthOption);

    // Verify filters applied
    await waitFor(() => {
      expect(screen.getByText(/showing filtered results/i)).toBeInTheDocument();
    });

    // Clear filters
    const clearFiltersButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearFiltersButton);

    // Verify all expenses shown again
    await waitFor(() => {
      expect(screen.queryByText(/filtered results/i)).not.toBeInTheDocument();
    });
  });

  it('completes expense editing workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Find an existing expense
    const expenseCard = screen.getByTestId('expense-card-1');
    expect(expenseCard).toBeInTheDocument();

    // Click edit button on expense
    const editButton = screen.getByRole('button', { name: /edit expense/i });
    await user.click(editButton);

    // Modify expense details
    const titleInput = screen.getByDisplayValue('Team Lunch');
    await user.clear(titleInput);
    await user.type(titleInput, 'Team Lunch - Updated');

    const amountInput = screen.getByDisplayValue('500');
    await user.clear(amountInput);
    await user.type(amountInput, '600');

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    // Verify changes saved
    await waitFor(() => {
      expect(screen.getByText('Team Lunch - Updated')).toBeInTheDocument();
      expect(screen.getByText('₹600')).toBeInTheDocument();
      expect(screen.getByText(/expense updated successfully/i)).toBeInTheDocument();
    });
  });

  it('completes expense deletion workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Find expense to delete
    const expenseCard = screen.getByTestId('expense-card-2');
    expect(expenseCard).toBeInTheDocument();

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete expense/i });
    await user.click(deleteButton);

    // Confirm deletion in modal
    const confirmDeleteButton = screen.getByRole('button', { name: /confirm delete/i });
    await user.click(confirmDeleteButton);

    // Verify expense removed
    await waitFor(() => {
      expect(screen.getByText(/expense deleted successfully/i)).toBeInTheDocument();
      expect(screen.queryByTestId('expense-card-2')).not.toBeInTheDocument();
    });
  });

  it('completes settlement workflow for group expenses', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Navigate to group page
    const groupsButton = screen.getByRole('button', { name: /groups/i });
    await user.click(groupsButton);

    // Select a group with outstanding balances
    const groupCard = screen.getByTestId('group-card-1');
    await user.click(groupCard);

    // View settlements
    const settlementsTab = screen.getByRole('tab', { name: /settlements/i });
    await user.click(settlementsTab);

    // Settle a balance
    const settleButton = screen.getByRole('button', { name: /settle up/i });
    await user.click(settleButton);

    // Choose payment method
    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    await user.click(paymentMethodSelect);
    await user.click(screen.getByText('UPI'));

    // Add payment reference
    const referenceInput = screen.getByLabelText(/payment reference/i);
    await user.type(referenceInput, 'TXN123456789');

    // Mark as settled
    const markSettledButton = screen.getByRole('button', { name: /mark as settled/i });
    await user.click(markSettledButton);

    // Verify settlement recorded
    await waitFor(() => {
      expect(screen.getByText(/settlement recorded successfully/i)).toBeInTheDocument();
      expect(screen.getByText('Settled')).toBeInTheDocument();
    });
  });

  it('completes mobile responsive workflow', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Verify mobile navigation is present
    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();

    // Use mobile action bar
    const mobileAddExpenseButton = screen.getByTestId('mobile-add-expense');
    await user.click(mobileAddExpenseButton);

    // Verify mobile modal opens
    expect(screen.getByTestId('mobile-expense-modal')).toBeInTheDocument();

    // Use swipe gestures (simulated)
    const expenseCard = screen.getByTestId('expense-card-1');
    
    // Simulate swipe left for actions
    fireEvent.touchStart(expenseCard, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    
    fireEvent.touchMove(expenseCard, {
      touches: [{ clientX: 50, clientY: 100 }],
    });
    
    fireEvent.touchEnd(expenseCard);

    // Verify swipe actions appear
    await waitFor(() => {
      expect(screen.getByTestId('swipe-actions')).toBeInTheDocument();
    });
  });

  it('handles offline functionality', async () => {
    const user = userEvent.setup();
    
    // Mock offline state
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/expensiver/i)).toBeInTheDocument();
    });

    // Verify offline indicator
    expect(screen.getByText(/offline mode/i)).toBeInTheDocument();

    // Try to add expense while offline
    const addExpenseButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addExpenseButton);

    // Fill form
    await user.type(screen.getByLabelText(/expense title/i), 'Offline Expense');
    await user.type(screen.getByLabelText(/amount/i), '100');

    // Submit (should queue for later sync)
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    // Verify queued message
    await waitFor(() => {
      expect(screen.getByText(/expense queued for sync/i)).toBeInTheDocument();
    });

    // Go back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Trigger online event
    fireEvent(window, new Event('online'));

    // Verify sync happens
    await waitFor(() => {
      expect(screen.getByText(/syncing data/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/data synced successfully/i)).toBeInTheDocument();
    });
  });
});
