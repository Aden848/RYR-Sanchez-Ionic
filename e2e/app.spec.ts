import { expect, test } from '@playwright/test';

test('muestra la pantalla de inicio de sesión', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('app-home')).toContainText('R Y R SÁNCHEZ');
});
