# Testing Guide for Expensiver

This document outlines the comprehensive testing strategy and guidelines for the Expensiver application.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Coverage Requirements](#coverage-requirements)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Testing Philosophy

Our testing approach follows the testing pyramid:

1. **Unit Tests (70%)** - Fast, isolated tests for individual components and functions
2. **Integration Tests (20%)** - Tests for component interactions and user workflows
3. **End-to-End Tests (10%)** - Full application tests simulating real user behavior

## Test Types

### 1. Unit Tests

**Location**: `src/components/__tests__/`, `src/pages/__tests__/`
**Framework**: Vitest + React Testing Library
**Purpose**: Test individual components in isolation

```bash
# Run unit tests
npm run test

# Run with watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### 2. Integration Tests

**Location**: `src/test/integration/`
**Framework**: Vitest + React Testing Library
**Purpose**: Test component interactions and complete user workflows

### 3. End-to-End Tests

**Location**: `tests/e2e/`
**Framework**: Playwright
**Purpose**: Test complete user journeys across browsers

```bash
# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui
```

### 4. Accessibility Tests

**Location**: `tests/e2e/accessibility.spec.ts`
**Framework**: Playwright + axe-core
**Purpose**: Ensure WCAG compliance and screen reader compatibility

```bash
npm run test:accessibility
```

### 5. Visual Regression Tests

**Location**: `tests/e2e/visual-regression.spec.ts`
**Framework**: Playwright
**Purpose**: Prevent unintended UI changes

```bash
npm run test:visual
```

### 6. Performance Tests

**Location**: `tests/e2e/performance.spec.ts`
**Framework**: Playwright
**Purpose**: Ensure acceptable loading times and Core Web Vitals

```bash
npm run test:performance
```

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Dependencies installed: `npm install`
3. Playwright browsers: `npx playwright install`

### Environment Setup

The test environment is automatically configured through:
- `vitest.config.ts` for unit/integration tests
- `playwright.config.ts` for E2E tests
- `src/test/setup.ts` for test utilities and mocks

## Running Tests

### Local Development

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with UI (Vitest UI)
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test -- ExpenseCard.test.tsx

# Run specific E2E test
npm run test:e2e -- --grep "should create expense"
```

### Test Reports

- **Unit Test Coverage**: `coverage/index.html`
- **E2E Test Report**: `playwright-report/index.html`
- **Performance Metrics**: Console output during performance tests

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ExpenseCard from '../ExpenseCard';
import { mockExpense } from '@/test/test-utils';

describe('ExpenseCard', () => {
  it('renders expense information correctly', () => {
    render(<ExpenseCard {...mockExpense} />);
    
    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('-₹100')).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import App from '@/App';

describe('Expense Creation Workflow', () => {
  it('allows user to create an expense', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate and fill form
    await user.click(screen.getByText('Add Expense'));
    await user.type(screen.getByLabelText(/title/i), 'Coffee');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.click(screen.getByRole('button', { name: /add expense/i }));
    
    // Verify result
    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument();
    });
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Expense Management', () => {
  test('should create new expense', async ({ page }) => {
    await page.goto('/');
    
    await page.click('button:has-text("Add Expense")');
    await page.fill('[placeholder*="expense"]', 'Coffee');
    await page.fill('input[type="number"]', '50');
    await page.click('button:has-text("Add Expense")');
    
    await expect(page.locator('text=Coffee')).toBeVisible();
  });
});
```

### Accessibility Test Example

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Best Practices

### General Testing

1. **Write descriptive test names** that explain what is being tested
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Test behavior, not implementation** details
4. **Use data-testid** for reliable element selection
5. **Mock external dependencies** appropriately
6. **Keep tests independent** - no shared state between tests

### Unit Testing

1. **Test component props** and their effects
2. **Test user interactions** (clicks, form inputs, etc.)
3. **Test conditional rendering**
4. **Mock child components** when necessary
5. **Test error states** and edge cases

```typescript
// Good: Testing behavior
it('shows error message when form is invalid', async () => {
  const user = userEvent.setup();
  render(<ExpenseForm />);
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/required field/i)).toBeInTheDocument();
});

// Avoid: Testing implementation
it('calls setState when button is clicked', () => {
  // This tests implementation, not behavior
});
```

### E2E Testing

1. **Test critical user journeys** end-to-end
2. **Use page objects** for complex interactions
3. **Wait for elements** properly - avoid arbitrary timeouts
4. **Test across different browsers** and screen sizes
5. **Keep tests stable** - use reliable selectors

```typescript
// Good: Waiting for elements
await expect(page.locator('text=Success')).toBeVisible();

// Avoid: Arbitrary timeouts
await page.waitForTimeout(3000);
```

### Mock Strategy

1. **Mock at the boundary** - HTTP requests, localStorage, etc.
2. **Don't mock what you're testing**
3. **Reset mocks** between tests
4. **Use realistic mock data**

## Coverage Requirements

### Unit Test Coverage Thresholds

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### What to Prioritize

1. **Critical business logic** (expense calculations, splits, etc.)
2. **User-facing components** (forms, modals, etc.)
3. **Error handling** and edge cases
4. **Utility functions** and helpers

### Coverage Exclusions

- Test files
- Configuration files
- Third-party dependencies
- Development-only code

## CI/CD Integration

### GitHub Actions Workflow

The project uses GitHub Actions for continuous testing:

- **Unit Tests**: Run on every push/PR
- **E2E Tests**: Run on every push/PR
- **Accessibility Tests**: Run on every push/PR
- **Performance Tests**: Run on schedule
- **Visual Regression**: Run on UI changes

### Quality Gates

1. All tests must pass
2. Coverage thresholds must be met
3. No accessibility violations
4. No performance regressions

## Test Data Management

### Mock Data

Use the centralized mock data in `src/test/test-utils.tsx`:

```typescript
import { mockExpense, mockUser, mockGroup } from '@/test/test-utils';
```

### Test User Data

- Use consistent test data across tests
- Create realistic scenarios
- Include edge cases (empty states, large numbers, etc.)

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test -- ExpenseCard.test.tsx

# Run in debug mode
npm run test:debug

# Use Vitest UI for visual debugging
npm run test:ui
```

### E2E Tests

```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (opens dev tools)
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# Run specific test
npm run test:e2e -- --grep "expense creation"
```

### Common Issues

1. **Flaky tests**: Usually caused by timing issues
   - Use proper waits instead of timeouts
   - Ensure test isolation
   
2. **Mock issues**: Components not behaving as expected
   - Check mock implementations
   - Verify mock reset between tests

3. **Element not found**: Selectors not working
   - Use data-testid attributes
   - Check element visibility timing

## Performance Testing

### Metrics Monitored

- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.8 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5 seconds

### Performance Budget

- **Bundle Size**: < 1MB total
- **JavaScript**: < 500KB
- **CSS**: < 100KB
- **Images**: Optimized and compressed

## Accessibility Testing

### WCAG Guidelines

Tests ensure compliance with:
- **WCAG 2.1 Level AA** standards
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** requirements
- **Form accessibility**

### Common Issues Tested

- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Improper heading hierarchy
- Keyboard trap issues
- Missing ARIA attributes

## Continuous Improvement

### Test Maintenance

1. **Regular review** of test coverage
2. **Update tests** when features change
3. **Remove obsolete tests**
4. **Add tests** for bug fixes
5. **Monitor test performance** and stability

### Metrics Tracking

- Test execution time
- Flaky test identification
- Coverage trends
- Performance regression detection

## Contributing to Tests

When adding new features:

1. **Write tests first** (TDD approach recommended)
2. **Include unit tests** for new components
3. **Add integration tests** for new user flows
4. **Update E2E tests** for critical paths
5. **Ensure accessibility** compliance
6. **Document test scenarios**

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Axe Accessibility Testing](https://www.deque.com/axe/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

For questions or issues with testing, please refer to this documentation or reach out to the development team.
