import { test, expect } from '@playwright/test';
import { WebMobile } from '../../pages/project/lowCode/WebMobile';
import { MobileDevices } from '../../pages/ide/Mobile';

let webMobile, mobileDevices;
const projetoApk = 'GeracaoAPK';

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);

  webMobile = new WebMobile(page, context);
  mobileDevices = new MobileDevices(page, context);
  await mobileDevices.visit();
  await mobileDevices.IDElogin();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const imagem = await page.screenshot();
  await testInfo.attach('screenshot', {
    body: imagem,
    contentType: 'image/png',
  });
  await mobileDevices.IDELogout();
});

test.skip('Valida a mensagem de URL inválida', async ({ page }) => {
  test.setTimeout(600000);

  await webMobile.createProjectMobileWeb(projetoApk);
  await mobileDevices.UrlErrorValidation();

  await expect(page.frameLocator('#main').getByText('URL do Servidor (produção)')).toBeVisible();
});

test.skip('Valida a geração de APK', async ({ page }) => {
  test.setTimeout(1000000);

  await mobileDevices.IDEopenProject(projetoApk);
  await mobileDevices.generateAndroidApk();
});

test.skip('Valida a geração de Bundle Android', async ({ page }) => {
  test.setTimeout(1000000);

  await mobileDevices.IDEopenProject(projetoApk);
  await mobileDevices.generateAndroidBundle();
});
