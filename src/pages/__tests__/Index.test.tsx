import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Index from '../Index';
import { mockIsMobile, mockNavigate, mockToast } from '@/test/test-utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock child components
vi.mock('@/components/Layout', () => ({
  default: ({ children, activeMode, onModeChange, activeSubNav, onSubNavChange }: any) => (
    <div data-testid="layout">
      <div data-testid="mode-controls">
        <button onClick={() => onModeChange('personal')}>Personal</button>
        <button onClick={() => onModeChange('group')}>Group</button>
      </div>
      <div data-testid="nav-controls">
        <button onClick={() => onSubNavChange('home')}>Home</button>
        <button onClick={() => onSubNavChange('expenses')}>Expenses</button>
        <button onClick={() => onSubNavChange('wallet')}>Wallet</button>
        <button onClick={() => onSubNavChange('analytics')}>Analytics</button>
        <button onClick={() => onSubNavChange('profile')}>Profile</button>
      </div>
      <div data-testid="active-mode">{activeMode}</div>
      <div data-testid="active-subnav">{activeSubNav}</div>
      {children}
    </div>
  ),
}));

vi.mock('@/components/WelcomeHero', () => ({
  default: ({ onDismiss, onCreateGroup, onStartPersonalTracking }: any) => (
    <div data-testid="welcome-hero">
      <button onClick={onDismiss}>Dismiss</button>
      <button onClick={onCreateGroup}>Create Group</button>
      <button onClick={onStartPersonalTracking}>Start Personal Tracking</button>
    </div>
  ),
}));

vi.mock('@/components/StickyActionBar', () => ({
  default: ({ onAddExpense, onSendMoney, onScanQR, onCalculate }: any) => (
    <div data-testid="sticky-action-bar">
      <button onClick={onAddExpense}>Add Expense</button>
      <button onClick={onSendMoney}>Send Money</button>
      <button onClick={onScanQR}>Scan QR</button>
      <button onClick={onCalculate}>Calculate</button>
    </div>
  ),
}));

vi.mock('@/components/FloatingActionButton', () => ({
  default: ({ onAddExpense, onSendMoney, onScanQR, onCalculate }: any) => (
    <div data-testid="floating-action-button">
      <button onClick={onAddExpense}>Add Expense</button>
      <button onClick={onSendMoney}>Send Money</button>
      <button onClick={onScanQR}>Scan QR</button>
      <button onClick={onCalculate}>Calculate</button>
    </div>
  ),
}));

vi.mock('@/pages/Groups', () => ({
  default: () => <div data-testid="groups-page">Groups Page</div>,
}));

vi.mock('@/pages/Dashboard', () => ({
  default: ({ mode }: any) => <div data-testid="dashboard-page">Dashboard - {mode}</div>,
}));

vi.mock('@/pages/PersonalExpenses', () => ({
  default: () => <div data-testid="personal-expenses-page">Personal Expenses Page</div>,
}));

vi.mock('@/components/AddExpenseModal', () => ({
  default: ({ isOpen, onClose, mode }: any) =>
    isOpen ? (
      <div data-testid="add-expense-modal">
        Add Expense Modal - {mode}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('@/components/QRScannerModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="qr-scanner-modal">
        QR Scanner Modal
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('@/components/CalculatorModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="calculator-modal">
        Calculator Modal
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the layout correctly', () => {
    render(<Index />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('active-mode')).toHaveTextContent('group');
    expect(screen.getByTestId('active-subnav')).toHaveTextContent('home');
  });

  it('shows welcome hero for new users', () => {
    mockLocalStorage.getItem.mockReturnValue(null); // No hasVisited flag
    render(<Index />);
    
    expect(screen.getByTestId('welcome-hero')).toBeInTheDocument();
  });

  it('hides welcome hero for returning users', () => {
    mockLocalStorage.getItem.mockReturnValue('true'); // hasVisited flag exists
    render(<Index />);
    
    expect(screen.queryByTestId('welcome-hero')).not.toBeInTheDocument();
    expect(screen.getByTestId('groups-page')).toBeInTheDocument();
  });

  it('dismisses welcome hero and sets localStorage', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<Index />);
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismissButton);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('hasVisited', 'true');
    expect(screen.queryByTestId('welcome-hero')).not.toBeInTheDocument();
  });

  it('handles mode switching between group and personal', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    // Initially in group mode
    expect(screen.getByTestId('active-mode')).toHaveTextContent('group');
    
    // Switch to personal mode
    const personalButton = screen.getByRole('button', { name: 'Personal' });
    await user.click(personalButton);
    
    expect(screen.getByTestId('active-mode')).toHaveTextContent('personal');
  });

  it('handles navigation between different sections', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    // Navigate to expenses
    const expensesButton = screen.getByRole('button', { name: 'Expenses' });
    await user.click(expensesButton);
    
    expect(screen.getByTestId('active-subnav')).toHaveTextContent('expenses');
    expect(screen.getByTestId('personal-expenses-page')).toBeInTheDocument();
  });

  it('handles profile navigation correctly', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    const profileButton = screen.getByRole('button', { name: 'Profile' });
    await user.click(profileButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('shows floating action button on desktop', () => {
    mockIsMobile.mockReturnValue(false);
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    expect(screen.getByTestId('floating-action-button')).toBeInTheDocument();
    expect(screen.queryByTestId('sticky-action-bar')).not.toBeInTheDocument();
  });

  it('shows sticky action bar on mobile', () => {
    mockIsMobile.mockReturnValue(true);
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    expect(screen.getByTestId('sticky-action-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('floating-action-button')).not.toBeInTheDocument();
  });

  it('opens add expense modal when action is triggered', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    const addExpenseButton = screen.getByRole('button', { name: 'Add Expense' });
    await user.click(addExpenseButton);
    
    expect(screen.getByTestId('add-expense-modal')).toBeInTheDocument();
  });

  it('opens QR scanner modal when action is triggered', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    const scanQRButton = screen.getByRole('button', { name: 'Scan QR' });
    await user.click(scanQRButton);
    
    expect(screen.getByTestId('qr-scanner-modal')).toBeInTheDocument();
  });

  it('opens calculator modal when action is triggered', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    const calculateButton = screen.getByRole('button', { name: 'Calculate' });
    await user.click(calculateButton);
    
    expect(screen.getByTestId('calculator-modal')).toBeInTheDocument();
  });

  it('closes modals when close button is clicked', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    // Open add expense modal
    const addExpenseButton = screen.getByRole('button', { name: 'Add Expense' });
    await user.click(addExpenseButton);
    
    expect(screen.getByTestId('add-expense-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    
    expect(screen.queryByTestId('add-expense-modal')).not.toBeInTheDocument();
  });

  it('handles send money action with navigation and toast', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    const sendMoneyButton = screen.getByRole('button', { name: 'Send Money' });
    await user.click(sendMoneyButton);
    
    expect(screen.getByTestId('active-subnav')).toHaveTextContent('wallet');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Send Money',
      description: 'Navigating to wallet...',
    });
  });

  it('shows correct content based on active mode and navigation', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true'); // Skip welcome
    
    render(<Index />);
    
    // Initially shows Groups page in group mode
    expect(screen.getByTestId('groups-page')).toBeInTheDocument();
    
    // Switch to personal mode
    const personalButton = screen.getByRole('button', { name: 'Personal' });
    await user.click(personalButton);
    
    // Should show Dashboard in personal mode
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByText('Dashboard - personal')).toBeInTheDocument();
  });

  it('handles welcome hero create group action', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null); // Show welcome
    
    render(<Index />);
    
    const createGroupButton = screen.getByRole('button', { name: 'Create Group' });
    await user.click(createGroupButton);
    
    expect(screen.getByTestId('active-subnav')).toHaveTextContent('create-group');
  });

  it('handles welcome hero start personal tracking action', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null); // Show welcome
    
    render(<Index />);
    
    const startPersonalButton = screen.getByRole('button', { name: 'Start Personal Tracking' });
    await user.click(startPersonalButton);
    
    expect(screen.getByTestId('active-mode')).toHaveTextContent('personal');
    expect(screen.getByTestId('active-subnav')).toHaveTextContent('expenses');
  });
});
