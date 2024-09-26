const { InitialNavegate } = require('../../pages/InitialNavegate');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, image, webMobile;

test.beforeEach(async ({ page, context }) => {
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);
});

test.afterEach(async ({ page, context }, testInfo) => {
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test('Valida login via SSO', async ({ page, context }, testInfo) => {
  test.setTimeout(120000);
  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.openProject('cron-auth-sso');
  await webMobile.runProject('web');
  const newPage = await context.waitForEvent('page');
  await webMobile.loginWithSSO(newPage);
  await expect(newPage.getByText('Home')).toBeVisible();
  image = await newPage.screenshot();
});
