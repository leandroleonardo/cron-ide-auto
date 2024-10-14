const { InitialNavegate } = require('../../pages/InitialNavegate');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, webMobile, newPage, iframe;

test.beforeEach(async ({ page, context }) => {
  newPage = null;
  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = newPage == null ? await page.screenshot() : await newPage.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

const projectName = 'auto-web';

test('Criar projeto Web', async ({ page, context }) => {
  test.setTimeout(1320000);
  await webMobile.createProjectWeb(projectName);
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test('Abre projeto Web', async ({ page, context }) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectName);
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test.only('Deleta projeto Web', async ({ page, context }) => {
  test.setTimeout(60000);
  await initialNavegate.searchProject(projectName);
  await initialNavegate.deleteProject();
  newPage = page;
  await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
});