const { InitialNavegate } = require('../../pages/InitialNavegate');
const { test, expect } = require('@playwright/test');

let initialNavegate, image;

test.beforeEach(async ({ page, context }) => {
  await page.setViewportSize({ width: 1300, height: 600 });
  initialNavegate = new InitialNavegate(page, context);
});

test.afterEach(async ({ page, context }, testInfo) => {
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test('Valida link Webinars', async ({ page, context }, testInfo) => {
  test.setTimeout(30000);
  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.navegateToLink('Webinars');
  const newPage = await context.waitForEvent('page');
  await expect(
    newPage.getByText('Nossos webinars abordam temas como inovação, mercado de tecnologia e desenvolvimento')
  ).toBeVisible();
  image = await newPage.screenshot();
});

test('Valida link Boas Práticas', async ({ page, context }, testInfo) => {
  test.setTimeout(30000);
  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.navegateToLink('Boas Práticas');
  const newPage = await context.waitForEvent('page');
  await expect(newPage.locator('#title-text')).toBeVisible();
  image = await newPage.screenshot();
});
