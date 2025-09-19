import { test, expect } from '@playwright/test';

test.describe('Expense Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Skip welcome screen if it appears
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
  });

  test('should create a new personal expense', async ({ page }) => {
    // Navigate to personal mode
    await page.click('button:has-text("Personal")');
    
    // Open add expense modal
    await page.click('button:has-text("Add Expense")');
    
    // Fill expense form
    await page.fill('[placeholder*="expense"]', 'Coffee Meeting');
    await page.fill('input[type="number"]', '150');
    
    // Select category
    await page.click('[role="combobox"]');
    await page.click('text=Food & Dining');
    
    // Add notes
    await page.fill('textarea', 'Coffee with client discussion');
    
    // Submit form
    await page.click('button:has-text("Add Expense")');
    
    // Verify success message
    await expect(page.locator('text=Expense added successfully')).toBeVisible();
    
    // Verify expense appears in list
    await expect(page.locator('text=Coffee Meeting')).toBeVisible();
    await expect(page.locator('text=₹150')).toBeVisible();
  });

  test('should create and manage a group', async ({ page }) => {
    // Navigate to create group
    await page.click('button:has-text("Create Group")');
    
    // Fill group details
    await page.fill('input[placeholder*="group name"]', 'Weekend Trip');
    await page.fill('textarea[placeholder*="description"]', 'Trip expenses for the weekend getaway');
    
    // Add a member
    await page.click('button:has-text("Add Member")');
    await page.fill('input[type="email"]', 'friend@example.com');
    await page.click('button:has-text("Invite")');
    
    // Create group
    await page.click('button:has-text("Create Group")');
    
    // Verify group creation
    await expect(page.locator('text=Group created successfully')).toBeVisible();
    await expect(page.locator('text=Weekend Trip')).toBeVisible();
    
    // Add group expense
    await page.click('button:has-text("Add Expense")');
    await page.fill('[placeholder*="expense"]', 'Hotel Booking');
    await page.fill('input[type="number"]', '2400');
    
    // Configure split
    await page.click('text=Split Equally');
    
    // Submit group expense
    await page.click('button:has-text("Add Expense")');
    
    // Verify group expense
    await expect(page.locator('text=Hotel Booking')).toBeVisible();
    await expect(page.locator('text=₹2,400')).toBeVisible();
  });

  test('should search and filter expenses', async ({ page }) => {
    // Ensure we have some expenses first
    await test.step('Add test expenses', async () => {
      await page.click('button:has-text("Add Expense")');
      await page.fill('[placeholder*="expense"]', 'Grocery Shopping');
      await page.fill('input[type="number"]', '500');
      await page.click('[role="combobox"]');
      await page.click('text=Groceries');
      await page.click('button:has-text("Add Expense")');
      await expect(page.locator('text=Expense added successfully')).toBeVisible();
    });

    // Navigate to history/search
    await page.click('button:has-text("History")');
    
    // Test search functionality
    await page.fill('input[placeholder*="search"]', 'grocery');
    await expect(page.locator('text=Grocery Shopping')).toBeVisible();
    
    // Test category filter
    await page.click('button:has-text("Filter")');
    await page.click('text=Groceries');
    await expect(page.locator('text=Showing filtered results')).toBeVisible();
    
    // Clear filters
    await page.click('button:has-text("Clear Filters")');
    await expect(page.locator('text=Showing filtered results')).not.toBeVisible();
  });

  test('should handle mobile responsiveness', async ({ page, isMobile }) => {
    if (isMobile) {
      // Test mobile navigation
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
      
      // Test mobile action bar
      await expect(page.locator('[data-testid="sticky-action-bar"]')).toBeVisible();
      
      // Test mobile expense creation
      await page.click('[data-testid="mobile-add-expense"]');
      await expect(page.locator('[data-testid="mobile-expense-modal"]')).toBeVisible();
      
      // Test swipe gestures on expense cards
      const expenseCard = page.locator('[data-testid="expense-card"]').first();
      if (await expenseCard.isVisible()) {
        await expenseCard.dispatchEvent('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
        await expenseCard.dispatchEvent('touchmove', { touches: [{ clientX: 50, clientY: 100 }] });
        await expenseCard.dispatchEvent('touchend');
        
        // Verify swipe actions appear
        await expect(page.locator('[data-testid="swipe-actions"]')).toBeVisible();
      }
    }
  });

  test('should validate form inputs', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    
    // Try to submit empty form
    await page.click('button:has-text("Add Expense")');
    
    // Check validation errors
    await expect(page.locator('text=Expense title is required')).toBeVisible();
    await expect(page.locator('text=Please enter a valid amount')).toBeVisible();
    
    // Test invalid amount
    await page.fill('[placeholder*="expense"]', 'Test Expense');
    await page.fill('input[type="number"]', '-100');
    await page.click('button:has-text("Add Expense")');
    
    await expect(page.locator('text=Please enter a valid amount')).toBeVisible();
    
    // Fix and submit
    await page.fill('input[type="number"]', '100');
    await page.click('button:has-text("Add Expense")');
    
    await expect(page.locator('text=Expense added successfully')).toBeVisible();
  });

  test('should handle QR code functionality', async ({ page }) => {
    // Open QR scanner
    await page.click('button:has-text("Scan QR")');
    
    // Check if QR scanner modal opens
    await expect(page.locator('[data-testid="qr-scanner-modal"]')).toBeVisible();
    
    // Test QR code generation for payments
    await page.click('button:has-text("Generate QR")');
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Close")');
    await expect(page.locator('[data-testid="qr-scanner-modal"]')).not.toBeVisible();
  });

  test('should handle calculator functionality', async ({ page }) => {
    await page.click('button:has-text("Calculate")');
    
    // Check calculator modal
    await expect(page.locator('[data-testid="calculator-modal"]')).toBeVisible();
    
    // Test basic calculation
    await page.click('button:has-text("7")');
    await page.click('button:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button:has-text("=")');
    
    // Verify result
    await expect(page.locator('text=10')).toBeVisible();
    
    // Use result in expense
    await page.click('button:has-text("Use in Expense")');
    
    // Verify amount is populated
    await expect(page.locator('input[type="number"]')).toHaveValue('10');
  });

  test('should handle data persistence', async ({ page }) => {
    // Add an expense
    await page.click('button:has-text("Add Expense")');
    await page.fill('[placeholder*="expense"]', 'Persistent Test Expense');
    await page.fill('input[type="number"]', '789');
    await page.click('button:has-text("Add Expense")');
    
    await expect(page.locator('text=Expense added successfully')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Verify expense persists
    await expect(page.locator('text=Persistent Test Expense')).toBeVisible();
    await expect(page.locator('text=₹789')).toBeVisible();
  });

  test('should handle different themes', async ({ page }) => {
    // Test dark theme (default)
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Switch to light theme if toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await expect(page.locator('html')).not.toHaveClass(/dark/);
      
      // Switch back to dark
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });

  test('should handle navigation between sections', async ({ page }) => {
    const sections = ['Dashboard', 'Groups', 'Wallet', 'Analytics', 'History'];
    
    for (const section of sections) {
      await page.click(`button:has-text("${section}")`);
      
      // Verify we're in the correct section
      await expect(page.locator(`[data-testid="${section.toLowerCase()}-page"]`)).toBeVisible();
      
      // Check URL if using router
      if (section === 'Profile') {
        await expect(page).toHaveURL(/\/profile/);
      }
    }
    
    // Test browser back/forward
    await page.goBack();
    await page.goForward();
  });
});
