const { InitialNavegate } = require('../../pages/InitialNavegate');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, iframe, webMobile, newPage;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(360000);
  newPage = null;

  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.getVersion();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = await newPage.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test.describe('Execução 1 - Fullstack', () => {
  test.describe.configure({ mode: 'serial' });

  test('Criar projeto WebMobile Fullstack', async ({ page, context }) => {
    test.setTimeout(360000);
    await webMobile.createProjectMobileWeb('cron-auto', 'config_default');
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await webMobile.loginRunningWebmobile(newPage);
    await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
  });

  test('Abrir o projeto WebMobile Fullstack', async ({ page, context }) => {
    test.setTimeout(360000);
    await initialNavegate.openProject('cron-auto');
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await webMobile.loginRunningWebmobile(newPage);
    await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
  });
});

test.describe('Execução 2 - Front-end', () => {
  test.describe.configure({ mode: 'serial' });

  test('Cria projeto WebMobile Front-end', async ({ page, context }) => {
    test.setTimeout(360000);

    await webMobile.createProjectMobileWeb('cron-auto-front', 'config_front');
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
    await webMobile.closeProject();
  });

  test('Deleta projeto WebMobile Front-end', async ({ page, context }) => {
    test.setTimeout(360000);

    await initialNavegate.openProject('cron-auto-front');
    await webMobile.runProject('web');

    newPage = await context.waitForEvent('page');
    await expect(newPage.locator('#main-view')).toBeVisible({ timeout: 50000 });
  });
});

test.describe('Execução 3 - Back-end', () => {
  test.describe.configure({ mode: 'serial' });

  test('Cria projeto WebMobile Back-end', async ({ page, context }) => {
    test.setTimeout(360000);
    await webMobile.createProjectMobileWeb('cron-auto-back', 'config_back');
    await webMobile.runProject();

    await expect(iframe.getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')).toBeVisible({
      timeout: 60000,
    });

    newPage = page;
  });

  test('Abrir o projeto WebMobile Back-end', async ({ page, context }) => {
    test.setTimeout(360000);

    await initialNavegate.openProject('cron-auto-back');
    await webMobile.runProject();

    await expect(iframe.getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')).toBeVisible({
      timeout: 60000,
    });

    newPage = page;
  });
});
