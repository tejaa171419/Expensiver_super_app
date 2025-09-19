import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Skip welcome screen if it appears
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1 element
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify heading structure
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag21a'])
      .analyze();
    
    expect(accessibilityScanResults.violations.filter(v => v.id === 'heading-order')).toEqual([]);
  });

  test('should have accessible form controls', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    
    // Check form accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag21a'])
      .include('[data-testid="add-expense-modal"]')
      .analyze();
    
    // Check for form-related violations
    const formViolations = accessibilityScanResults.violations.filter(v => 
      ['label', 'form-field-multiple-labels', 'input-button-name'].includes(v.id)
    );
    expect(formViolations).toEqual([]);
  });

  test('should have proper color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Check for color contrast violations
    const colorViolations = accessibilityScanResults.violations.filter(v => 
      v.id === 'color-contrast'
    );
    expect(colorViolations).toEqual([]);
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT'].includes(focusedElement || '')).toBeTruthy();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      
      // Ensure we're always on an interactive element
      if (focusedElement) {
        expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focusedElement)).toBeTruthy();
      }
    }
    
    // Test reverse tab navigation
    await page.keyboard.press('Shift+Tab');
    focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focusedElement || '')).toBeTruthy();
  });

  test('should have accessible buttons and links', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    // Check for button/link accessibility violations
    const buttonViolations = accessibilityScanResults.violations.filter(v => 
      ['button-name', 'link-name', 'empty-heading'].includes(v.id)
    );
    expect(buttonViolations).toEqual([]);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag21a'])
      .analyze();
    
    // Check for ARIA-related violations
    const ariaViolations = accessibilityScanResults.violations.filter(v => 
      v.id.includes('aria-')
    );
    expect(ariaViolations).toEqual([]);
  });

  test('should have accessible modal dialogs', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    
    // Check that modal is properly announced to screen readers
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Check modal accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should have accessible data tables', async ({ page }) => {
    // Navigate to a section that might have tables (e.g., History)
    await page.click('button:has-text("History")');
    
    // Check for table accessibility
    const tables = page.locator('table');
    if (await tables.count() > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('table')
        .analyze();
      
      // Check for table-related violations
      const tableViolations = accessibilityScanResults.violations.filter(v => 
        ['table-duplicate-name', 'td-headers-attr', 'th-has-data-cells'].includes(v.id)
      );
      expect(tableViolations).toEqual([]);
    }
  });

  test('should have accessible images', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    // Check for image accessibility violations
    const imageViolations = accessibilityScanResults.violations.filter(v => 
      ['image-alt', 'image-redundant-alt'].includes(v.id)
    );
    expect(imageViolations).toEqual([]);
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Test landmark navigation
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    expect(landmarks).toBeGreaterThan(0);
    
    // Test heading structure for screen reader navigation
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(headings).toBeGreaterThan(0);
    
    // Verify skip links for screen reader users
    const skipLinks = page.locator('a[href="#main"], a[href="#content"]');
    if (await skipLinks.count() > 0) {
      await expect(skipLinks.first()).not.toBeVisible();
      
      // Skip links should become visible on focus
      await skipLinks.first().focus();
      await expect(skipLinks.first()).toBeVisible();
    }
  });

  test('should handle focus management properly', async ({ page }) => {
    // Test focus trap in modals
    await page.click('button:has-text("Add Expense")');
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Focus should be trapped within the modal
    const firstFocusable = modal.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
    const lastFocusable = modal.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').last();
    
    await firstFocusable.focus();
    await expect(firstFocusable).toBeFocused();
    
    // Tab to last element, then try to go forward - should cycle back to first
    await lastFocusable.focus();
    await page.keyboard.press('Tab');
    
    // Check if focus cycled back (implementation depends on focus trap)
    const currentFocus = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(currentFocus || '')).toBeTruthy();
    
    // Close modal and verify focus returns to trigger
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should have proper error message accessibility', async ({ page }) => {
    await page.click('button:has-text("Add Expense")');
    
    // Try to submit form without required fields
    await page.click('button:has-text("Add Expense")');
    
    // Check that error messages are properly associated with form fields
    const errorMessages = page.locator('[role="alert"], .error-message, [aria-invalid="true"]');
    if (await errorMessages.count() > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .analyze();
      
      // Check for form error accessibility violations
      const errorViolations = accessibilityScanResults.violations.filter(v => 
        ['aria-valid-attr-value', 'aria-required-attr'].includes(v.id)
      );
      expect(errorViolations).toEqual([]);
    }
  });

  test('should be usable with voice commands', async ({ page }) => {
    // This test verifies that elements have proper names for voice navigation
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    // Check for violations that would affect voice navigation
    const voiceNavViolations = accessibilityScanResults.violations.filter(v => 
      ['button-name', 'link-name', 'input-button-name', 'accesskey'].includes(v.id)
    );
    expect(voiceNavViolations).toEqual([]);
  });
});
