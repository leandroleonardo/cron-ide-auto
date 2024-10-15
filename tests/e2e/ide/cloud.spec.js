const { InitialNavegate } = require('../../pages/InitialNavegate');
const { Cloud } = require('../../pages/ide/Cloud');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');
const { projectName } = require('../../config/project.json');

let initialNavegate, webMobile, cloud, newPage, iframe;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);

  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);
  cloud = new Cloud(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = newPage == null ? await page.screenshot() : await newPage.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
  newPage = null;
});

test('Valida a criação de serviço no Cloud', async ({ page, context }, testInfo) => {
  test.setTimeout(900000);

  await initialNavegate.openProject(projectName);
  await cloud.accessWindow();
  await cloud.addService(projectName);
  await cloud.accessService(projectName);

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test('Valida a execução de projeto no Cloud', async ({ page, context }) => {
  test.setTimeout(70000);

  await cloud.accessWindow();
  await cloud.searchService(projectName, 'initialNavegate');
  await cloud.accessService(projectName);

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test('Valida a remoção de serviço do Cloud', async ({ page, context }, testInfo) => {
  test.setTimeout(70000);

  await cloud.accessWindow();
  await cloud.searchService(projectName, 'initialNavegate');
  await cloud.deleteService(projectName);

  await expect(iframe.locator(`//*[text()="${projectName.replace(/-/g, '')}.cloud.cronapp.io"]`)).toBeHidden();
});
