const { InitialNavegate } = require('../../pages/InitialNavegate');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, webMobile, newPage, iframe;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(250000);
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
  if (newPage) {
    await newPage.close();
    newPage = null;
  }
  await initialNavegate.IDELogout();
});

const projectName = 'auto-create-webMobile';

/* Valida criação de projeto Full-stack */

test('Valida a criação de um projeto WebMobile', async ({ page, context }) => {
  test.setTimeout(1320000);
  await webMobile.createProjectMobileWeb(projectName);
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test('Valida a abertura de um projeto WebMobile', async ({ page, context }) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectName);
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test('Valida a exclusão de um projeto WebMobile', async ({ page, context }) => {
  test.setTimeout(60000);
  await initialNavegate.searchProject(projectName);
  await initialNavegate.deleteProject();
  await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
});

const projectFrontName = 'auto-create-front';

/* Valida criação de projeto Front-end */

test('Valida a criação de um projeto WebMobile - Front-end', async ({ page, context }) => {
  test.setTimeout(1320000);

  await webMobile.createProjectMobileWeb(projectFrontName, 'config_front');
  await webMobile.runProject('web');

  newPage = await context.waitForEvent('page');
  await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
});

test('Valida a abertura de um projeto WebMobile - Front-end', async ({ page, context }) => {
  test.setTimeout(180000);
  await initialNavegate.openProject(projectFrontName);
  await webMobile.runProject('web');
  newPage = await context.waitForEvent('page');
  await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
});

test('Valida a exclusão de um projeto WebMobile - Frone-end', async ({ page, context }) => {
  await initialNavegate.searchProject(projectFrontName);
  await initialNavegate.deleteProject();
  await expect(iframe.getByText(projectFrontName).nth(1)).toBeHidden();
});
