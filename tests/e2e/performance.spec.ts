import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics collection
    await page.goto('/');
  });

  test('should load initial page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('body');
    
    const loadTime = Date.now() - startTime;
    
    // Assert page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should have acceptable Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};
        
        // Measure FCP (First Contentful Paint)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Measure LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Measure CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Measure FID (First Input Delay) simulation
        vitals.fid = 0; // Simulated as we can't measure real FID in automated tests
        
        setTimeout(() => resolve(vitals), 2000);
      });
    });
    
    console.log('Core Web Vitals:', vitals);
    
    // Assert Core Web Vitals thresholds
    // FCP should be under 1.8s (good threshold)
    if (vitals.fcp) {
      expect(vitals.fcp).toBeLessThan(1800);
    }
    
    // LCP should be under 2.5s (good threshold)
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }
    
    // CLS should be under 0.1 (good threshold)
    if (vitals.cls !== undefined) {
      expect(vitals.cls).toBeLessThan(0.1);
    }
  });

  test('should render expense list efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    // Navigate to expenses list
    await page.click('button:has-text("History")');
    
    const startTime = Date.now();
    
    // Wait for expense list to render
    await page.waitForSelector('[data-testid="expense-list"]', { timeout: 5000 });
    
    const renderTime = Date.now() - startTime;
    
    // Assert list renders within 1 second
    expect(renderTime).toBeLessThan(1000);
    
    console.log(`Expense list render time: ${renderTime}ms`);
  });

  test('should handle form interactions smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    const startTime = Date.now();
    
    // Open expense form
    await page.click('button:has-text("Add Expense")');
    
    // Wait for modal to be visible
    await page.waitForSelector('[data-testid="add-expense-modal"]');
    
    const modalOpenTime = Date.now() - startTime;
    
    // Assert modal opens within 500ms
    expect(modalOpenTime).toBeLessThan(500);
    
    console.log(`Modal open time: ${modalOpenTime}ms`);
    
    // Test form input responsiveness
    const inputStartTime = Date.now();
    
    await page.fill('[placeholder*="expense"]', 'Performance Test Expense');
    await page.fill('input[type="number"]', '100');
    
    const inputTime = Date.now() - inputStartTime;
    
    // Assert form inputs respond within 200ms
    expect(inputTime).toBeLessThan(200);
    
    console.log(`Form input time: ${inputTime}ms`);
  });

  test('should handle navigation smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    const navigationTimes: number[] = [];
    const sections = ['Dashboard', 'Groups', 'Wallet', 'Analytics', 'History'];
    
    for (const section of sections) {
      const startTime = Date.now();
      
      await page.click(`button:has-text("${section}")`);
      
      // Wait for section to load
      await page.waitForSelector(`[data-testid="${section.toLowerCase()}-page"], .animate-fade-in`, { timeout: 3000 });
      
      const navigationTime = Date.now() - startTime;
      navigationTimes.push(navigationTime);
      
      console.log(`${section} navigation time: ${navigationTime}ms`);
    }
    
    // Assert all navigations complete within 1 second
    for (const time of navigationTimes) {
      expect(time).toBeLessThan(1000);
    }
    
    // Assert average navigation time is under 500ms
    const averageTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    expect(averageTime).toBeLessThan(500);
    
    console.log(`Average navigation time: ${averageTime}ms`);
  });

  test('should handle mobile performance', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Throttle network to simulate mobile conditions
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // 150ms latency
      downloadThroughput: 1.6 * 1024 * 1024, // 1.6 Mbps
      uploadThroughput: 0.75 * 1024 * 1024, // 0.75 Mbps
    });
    
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const mobileLoadTime = Date.now() - startTime;
    
    // Assert mobile load time is under 5 seconds
    expect(mobileLoadTime).toBeLessThan(5000);
    
    console.log(`Mobile load time: ${mobileLoadTime}ms`);
    
    // Test mobile interactions
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    // Test mobile action bar performance
    const actionBarStartTime = Date.now();
    
    await page.click('[data-testid="mobile-add-expense"]');
    await page.waitForSelector('[data-testid="mobile-expense-modal"]');
    
    const actionBarTime = Date.now() - actionBarStartTime;
    
    // Assert mobile action responds within 800ms
    expect(actionBarTime).toBeLessThan(800);
    
    console.log(`Mobile action bar time: ${actionBarTime}ms`);
  });

  test('should have efficient memory usage', async ({ page, context }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMetrics = await page.evaluate(() => {
      const memory = (performance as any).memory;
      return memory ? {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
      } : null;
    });
    
    if (initialMetrics) {
      console.log('Initial memory usage:', initialMetrics);
      
      // Perform various actions to test memory usage
      const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
      if (await welcomeScreen.isVisible()) {
        await page.click('button:has-text("Dismiss")');
      }
      
      // Navigate through different sections
      const sections = ['Groups', 'Wallet', 'Analytics', 'History', 'Dashboard'];
      for (const section of sections) {
        await page.click(`button:has-text("${section}")`);
        await page.waitForTimeout(500);
      }
      
      // Add and remove expenses
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Add Expense")');
        await page.fill('[placeholder*="expense"]', `Test Expense ${i}`);
        await page.fill('input[type="number"]', '100');
        await page.click('button:has-text("Add Expense")');
        await page.waitForTimeout(200);
      }
      
      // Get final memory usage
      const finalMetrics = await page.evaluate(() => {
        const memory = (performance as any).memory;
        return memory ? {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
        } : null;
      });
      
      if (finalMetrics) {
        console.log('Final memory usage:', finalMetrics);
        
        // Calculate memory increase
        const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
        const memoryIncreasePercentage = (memoryIncrease / initialMetrics.usedJSHeapSize) * 100;
        
        console.log(`Memory increase: ${memoryIncrease} bytes (${memoryIncreasePercentage.toFixed(2)}%)`);
        
        // Assert memory increase is reasonable (under 50% increase)
        expect(memoryIncreasePercentage).toBeLessThan(50);
      }
    }
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    // Simulate adding multiple expenses quickly
    const startTime = Date.now();
    
    for (let i = 0; i < 20; i++) {
      await page.click('button:has-text("Add Expense")');
      await page.fill('[placeholder*="expense"]', `Bulk Expense ${i}`);
      await page.fill('input[type="number"]', String(Math.floor(Math.random() * 1000)));
      await page.click('button:has-text("Add Expense")');
      
      // Brief wait to prevent overwhelming the UI
      if (i % 5 === 0) {
        await page.waitForTimeout(100);
      }
    }
    
    const bulkOperationTime = Date.now() - startTime;
    
    console.log(`Bulk operation time: ${bulkOperationTime}ms`);
    
    // Assert bulk operations complete within reasonable time (20 seconds)
    expect(bulkOperationTime).toBeLessThan(20000);
    
    // Test list rendering with many items
    await page.click('button:has-text("History")');
    
    const listStartTime = Date.now();
    
    await page.waitForSelector('[data-testid="expense-list"]');
    
    const listRenderTime = Date.now() - listStartTime;
    
    console.log(`Large list render time: ${listRenderTime}ms`);
    
    // Assert large list renders within 2 seconds
    expect(listRenderTime).toBeLessThan(2000);
  });

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    // Test modal animations
    const animationStartTime = Date.now();
    
    await page.click('button:has-text("Add Expense")');
    await page.waitForSelector('[data-testid="add-expense-modal"]', { state: 'visible' });
    
    // Close modal
    await page.press('[data-testid="add-expense-modal"]', 'Escape');
    await page.waitForSelector('[data-testid="add-expense-modal"]', { state: 'hidden' });
    
    const animationTime = Date.now() - animationStartTime;
    
    console.log(`Modal animation time: ${animationTime}ms`);
    
    // Assert animations complete within 1 second
    expect(animationTime).toBeLessThan(1000);
    
    // Test page transition animations
    const sections = ['Groups', 'Dashboard'];
    
    for (const section of sections) {
      const transitionStartTime = Date.now();
      
      await page.click(`button:has-text("${section}")`);
      await page.waitForSelector('.animate-fade-in', { state: 'visible' });
      
      const transitionTime = Date.now() - transitionStartTime;
      
      console.log(`${section} transition time: ${transitionTime}ms`);
      
      // Assert page transitions complete within 600ms
      expect(transitionTime).toBeLessThan(600);
    }
  });

  test('should maintain 60fps during interactions', async ({ page }) => {
    await page.goto('/');
    
    // Skip welcome screen
    const welcomeScreen = page.locator('[data-testid="welcome-hero"]');
    if (await welcomeScreen.isVisible()) {
      await page.click('button:has-text("Dismiss")');
    }
    
    // Enable frame rate monitoring
    await page.evaluate(() => {
      let frameCount = 0;
      let startTime = performance.now();
      
      function countFrames() {
        frameCount++;
        requestAnimationFrame(countFrames);
      }
      
      requestAnimationFrame(countFrames);
      
      // Store frame monitoring in global scope
      (window as any).getFrameRate = () => {
        const elapsed = performance.now() - startTime;
        const fps = (frameCount / elapsed) * 1000;
        return Math.round(fps);
      };
    });
    
    // Perform interaction that might cause frame drops
    await page.hover('[data-testid="expense-card"]');
    await page.click('button:has-text("Add Expense")');
    await page.fill('[placeholder*="expense"]', 'Frame Rate Test');
    await page.fill('input[type="number"]', '100');
    
    // Wait a bit for frames to be counted
    await page.waitForTimeout(1000);
    
    const frameRate = await page.evaluate(() => (window as any).getFrameRate?.() || 0);
    
    console.log(`Frame rate during interactions: ${frameRate}fps`);
    
    // Assert frame rate is acceptable (above 45fps, ideally 60fps)
    if (frameRate > 0) {
      expect(frameRate).toBeGreaterThan(45);
    }
  });
});
