import { Cloud } from '../../pages/ide/Cloud';
import { WebMobile } from '../../pages/project/lowCode/WebMobile';
import { test, expect } from '@playwright/test';
import { projectName } from '../../config/project.json';

let webMobile, cloud, newPage;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);

  webMobile = new WebMobile(page, context);
  cloud = new Cloud(page, context);

  await cloud.visit();
  await cloud.IDElogin();
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
  await cloud.closeInitialNavegatPopUp();
  await cloud.IDELogout();
});

test.skip('Valida criação de serviço no Cloud', async ({ page, context }, testInfo) => {
  test.setTimeout(900000);

  await cloud.IDEopenProject(projectName);
  await cloud.accessWindow();
  await cloud.addService(projectName);
  await cloud.accessService(projectName);

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test.skip('Valida execução de projeto no Cloud', async ({ page, context }) => {
  test.setTimeout(70000);

  await cloud.accessWindow();
  await cloud.searchService(projectName, 'initialNavegate');
  await cloud.accessService(projectName);

  newPage = await context.waitForEvent('page');
  await webMobile.loginRunningWebmobile(newPage);
  await expect(newPage.getByText('admin@cronapp.io')).toBeVisible();
});

test.skip('Valida remoção de serviço do Cloud', async ({ page, context }, testInfo) => {
  test.setTimeout(70000);

  await cloud.accessWindow();
  await cloud.searchService(projectName, 'initialNavegate');
  await cloud.deleteService(projectName);

  await expect(
    page.frameLocator('#main').locator(`//*[text()="${projectName.replace(/-/g, '')}.cloud.cronapp.io"]`)
  ).toBeHidden();
});
