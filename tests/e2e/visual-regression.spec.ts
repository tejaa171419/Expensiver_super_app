import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Skip welcome screen for consistent screenshots
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    // Wait for animations to complete
    await page.waitForTimeout(1000);
  });

  test('should match dashboard screenshot', async ({ page }) => {
    // Ensure we're on the main dashboard
    await page.click('button:has-text("Dashboard")');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match expense form modal screenshot', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    await page.waitForSelector('[data-testid="add-expense-modal"]');
    
    // Fill form with sample data for consistent screenshot
    await page.fill('[placeholder*="expense"]', 'Sample Expense');
    await page.fill('input[type="number"]', '100');
    
    await expect(page.locator('[data-testid="add-expense-modal"]')).toHaveScreenshot('expense-form-modal.png', {
      animations: 'disabled',
    });
  });

  test('should match groups page screenshot', async ({ page }) => {
    await page.click('button:has-text("Groups")');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('groups-page-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match mobile dashboard screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.reload();
    
    // Skip welcome screen again after reload
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet dashboard screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.reload();
    
    // Skip welcome screen again after reload
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match expense card component', async ({ page }) => {
    await page.waitForSelector('[data-testid="expense-card"]');
    
    const expenseCard = page.locator('[data-testid="expense-card"]').first();
    await expect(expenseCard).toHaveScreenshot('expense-card.png', {
      animations: 'disabled',
    });
  });

  test('should match light theme dashboard', async ({ page }) => {
    // Switch to light theme if toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }
    
    await expect(page).toHaveScreenshot('dashboard-light-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match dark theme dashboard', async ({ page }) => {
    // Ensure dark theme is active (default)
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      // Click twice to ensure dark theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
    
    await expect(page).toHaveScreenshot('dashboard-dark-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match navigation menu screenshot', async ({ page }) => {
    const navigationMenu = page.locator('[data-testid="navigation-menu"]');
    if (await navigationMenu.isVisible()) {
      await expect(navigationMenu).toHaveScreenshot('navigation-menu.png', {
        animations: 'disabled',
      });
    }
    
    // Test mobile navigation menu
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      
      const mobileMenu = page.locator('[data-testid="mobile-navigation"]');
      await expect(mobileMenu).toHaveScreenshot('mobile-navigation-menu.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match empty states', async ({ page }) => {
    // Test empty expense list
    await page.click('button:has-text("Personal")');
    await page.click('button:has-text("History")');
    
    const emptyState = page.locator('[data-testid="empty-expenses"]');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toHaveScreenshot('empty-expenses.png', {
        animations: 'disabled',
      });
    }
    
    // Test empty groups state
    await page.click('button:has-text("Groups")');
    
    const emptyGroupsState = page.locator('[data-testid="empty-groups"]');
    if (await emptyGroupsState.isVisible()) {
      await expect(emptyGroupsState).toHaveScreenshot('empty-groups.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match loading states', async ({ page }) => {
    // Simulate slow network to catch loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.reload();
    
    // Try to catch loading spinner
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    if (await loadingSpinner.isVisible({ timeout: 1000 })) {
      await expect(loadingSpinner).toHaveScreenshot('loading-spinner.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match error states', async ({ page }) => {
    // Simulate network error to trigger error states
    await page.route('**/api/**', route => route.abort());
    
    // Try an action that would trigger an API call
    await page.click('button:has-text("Add Expense")');
    await page.fill('[placeholder*="expense"]', 'Test Expense');
    await page.fill('input[type="number"]', '100');
    await page.click('button:has-text("Add Expense")');
    
    // Check for error message
    const errorMessage = page.locator('[role="alert"], .error-message');
    if (await errorMessage.isVisible({ timeout: 5000 })) {
      await expect(errorMessage).toHaveScreenshot('error-message.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match form validation states', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    
    // Submit empty form to trigger validation
    await page.click('button:has-text("Add Expense")');
    
    // Wait for validation errors
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="add-expense-modal"]')).toHaveScreenshot('form-validation-errors.png', {
      animations: 'disabled',
    });
  });

  test('should match different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 667, name: 'mobile-medium' },
      { width: 414, height: 896, name: 'mobile-large' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1440, height: 900, name: 'desktop-large' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      
      // Skip welcome screen
      const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
      if (await welcomeScreen.isVisible()) {
        await page.click('button:has-text("Dismiss")');
      }
      
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });

  test('should match hover states', async ({ page }) => {
    // Test button hover states
    const addExpenseButton = page.locator('button:has-text("Add Expense")');
    await addExpenseButton.hover();
    
    await expect(addExpenseButton).toHaveScreenshot('button-hover.png', {
      animations: 'disabled',
    });
    
    // Test card hover states
    const expenseCard = page.locator('[data-testid="expense-card"]').first();
    if (await expenseCard.isVisible()) {
      await expenseCard.hover();
      
      await expect(expenseCard).toHaveScreenshot('expense-card-hover.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match focus states', async ({ page }) => {
    // Test button focus states
    const addExpenseButton = page.locator('button:has-text("Add Expense")');
    await addExpenseButton.focus();
    
    await expect(addExpenseButton).toHaveScreenshot('button-focus.png', {
      animations: 'disabled',
    });
    
    // Test input focus states
    await page.click('button:has-text("Add Expense")');
    const titleInput = page.locator('[placeholder*="expense"]');
    await titleInput.focus();
    
    await expect(titleInput).toHaveScreenshot('input-focus.png', {
      animations: 'disabled',
    });
  });
});
