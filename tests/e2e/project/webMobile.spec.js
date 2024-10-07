const { InitialNavegate } = require('../../pages/InitialNavegate');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, iframe, webMobile, newPage;

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

test.describe.only('Execução 1', () => {
  test.describe.configure({ mode: 'serial' });

  const projectName = 'cron-auto';

  test.only('Criar projeto WebMobile Fullstack', async ({ page, context }) => {
    test.setTimeout(1320000);
    await webMobile.createProjectMobileWeb(projectName);
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await webMobile.loginRunningWebmobile(newPage);
    await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
  });

  test('Abre projeto WebMobile Fullstack', async ({ page, context }) => {
    test.setTimeout(180000);
    await initialNavegate.openProject(projectName);
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await webMobile.loginRunningWebmobile(newPage);
    await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
  });

  test('Deleta projeto WebMobile Front-End', async ({ page, context }) => {
    await initialNavegate.searchProject(projectName);
    await initialNavegate.deleteProject();
    newPage = page;
    await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
  });
});

test.describe.only('Execução 2', () => {
  test.describe.configure({ mode: 'serial' });

  const projectName = 'cron-auto-front';

  test.only('Criar projeto WebMobile Front-End', async ({ page, context }) => {
    test.setTimeout(1320000);
    await webMobile.createProjectMobileWeb(projectName, 'config_front');
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
  });

  test('Abre projeto WebMobile Front-End', async ({ page, context }) => {
    test.setTimeout(180000);
    await initialNavegate.openProject(projectName);
    await webMobile.runProject('web');
    newPage = await context.waitForEvent('page');
    await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
  });

  test('Deleta projeto WebMobile Front-End', async ({ page, context }) => {
    await initialNavegate.searchProject(projectName);
    await initialNavegate.deleteProject();
    newPage = page;
    await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
  });
});
