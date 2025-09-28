import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://example.com/login');
  await page.locator('body').click();
});