import { InitialNavegate } from '../../pages/InitialNavegate';
import { test, expect } from '@playwright/test';

let initialNavegate, image, newPage;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);
  await page.setViewportSize({ width: 1300, height: 600 });
  initialNavegate = new InitialNavegate(page, context);
});

test.afterEach(async ({ page, context }, testInfo) => {
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
  await newPage.close();
  await initialNavegate.IDELogout();
});

test('Valida link Webinars', async ({ page, context }, testInfo) => {
  test.setTimeout(65000);

  await initialNavegate.visit();
  await initialNavegate.IDElogin();
  await initialNavegate.navegateToLink('Webinars');
  newPage = await context.waitForEvent('page');
  await expect(
    newPage.getByText('Nossos webinars abordam temas como inovação, mercado de tecnologia e desenvolvimento')
  ).toBeVisible();
  image = await newPage.screenshot();
});

test('Valida link Boas Práticas', async ({ page, context }, testInfo) => {
  test.setTimeout(65000);

  await initialNavegate.visit();
  await initialNavegate.IDElogin();
  await initialNavegate.navegateToLink('Boas Práticas');
  newPage = await context.waitForEvent('page');
  await expect(newPage.locator('#title-text')).toBeVisible();
  image = await newPage.screenshot();
});
