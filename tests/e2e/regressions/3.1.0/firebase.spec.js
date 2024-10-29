import { PLugin } from '../../../pages/ide/Plugin';
import { test, expect } from '@playwright/test';
import { Mobile } from '../../../pages/ide/Mobile';

let plugin,
  mobile,
  projectName = 'project-reg-3.1.0';

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(250000);

  plugin = new PLugin(page, context);
  mobile = new Mobile(page, context);

  await plugin.visit();
  await plugin.IDElogin();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = await page.screenshot();

  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });

  await mobile.closeSuccessInstallationPopup();
  await plugin.IDELogout();
});

test('Valida Instação do plugin FireBase', async ({ page, context }) => {
  test.setTimeout(250000);

  await plugin.IDEopenProject(projectName);
  await plugin.installPlugin('Google Firebase - Push Notification');
  await plugin.accessPackageJson();

  await expect(
    page.frameLocator('#main').locator(`(//*[contains(text(), "cordova-plugin-firebasex")])[1]`)
  ).toBeVisible();
  await expect(page.frameLocator('#main').locator(`//*[text()='"17.0.0-cli"']`)).toBeVisible();
});

test('Valida geração de APK do plugin FireBase', async ({ page, context }) => {
  test.setTimeout(480000);

  await mobile.IDEopenProject(projectName);
  await mobile.generateAndroidApk();
  await expect(page.frameLocator('#main').locator(`//*[text()="Sua aplicação foi gerada com sucesso!"]`)).toBeVisible();
});
