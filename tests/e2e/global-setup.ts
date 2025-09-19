import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Launch browser and setup global state if needed
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the app to ensure it's running
  try {
    await page.goto(baseURL!);
    await page.waitForSelector('body', { timeout: 10000 });
    console.log('✅ Application is running and accessible');
  } catch (error) {
    console.error('❌ Failed to access application:', error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }
  
  // Setup any global test data or state here
  console.log('🚀 Global setup completed');
}

export default globalSetup;
