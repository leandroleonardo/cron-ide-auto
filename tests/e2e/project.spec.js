const { InitialNavegate } = require('../pages/InitialNavegate');
const { WebMobile } = require('../pages/createLowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, iframe, webMobile, newPage;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(360000);
  await page.setViewportSize({ width: 1300, height: 600 });
  newPage = undefined;

  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.getVersion();
});

test.afterEach(async ({ page, context }, testInfo) => {
  await expect(iframe.getByText(' Started')).toBeVisible();
  await expect(iframe.locator('//div[@title="0 Erros"]').nth(1)).toBeVisible();

  const image = await newPage.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test.only('Criar projeto WebMobile', async ({ page, context }, testInfo) => {
  test.setTimeout(360000);

  await webMobile.createProjectMobileWeb('config_default');
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.accessRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test.only('Criar projeto WebMobile apenas front-end', async ({ page, context }, testInfo) => {
  test.setTimeout(360000);

  await webMobile.createProjectMobileWeb('config_front');
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 10000 });
});

test.only('Criar projeto WebMobile apenas back-end', async ({ page, context }, testInfo) => {
  test.setTimeout(360000);
  await webMobile.createProjectMobileWeb('config_back');

  await webMobile.runProject();

  await expect(iframe.getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')).toBeVisible({
    timeout: 60000,
  });

  newPage = page;
});

test.only('Abrir o projeto WebMobile para teste', async ({ page, context }, testInfo) => {
  test.setTimeout(1000000);
  await initialNavegate.openProject('cron-auto');

  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.accessRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});
