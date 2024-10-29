import { test, expect } from '@playwright/test';
import { WebMobile } from '../../pages/project/lowCode/WebMobile';
import { Mobile } from '../../pages/ide/Mobile';

let webMobile, mobile;
const APKProject = 'GeracaoAPK';

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);

  webMobile = new WebMobile(page, context);
  mobile = new Mobile(page, context);

  await mobile.visit();
  await mobile.IDElogin();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const imagem = await page.screenshot();

  await testInfo.attach('screenshot', {
    body: imagem,
    contentType: 'image/png',
  });

  await mobile.closeSuccessInstallationPopup();
  await mobile.IDELogout();
});

test('Valida mensagem de URL inválida', async ({ page }) => {
  test.setTimeout(600000);

  await webMobile.createProjectMobileWeb(APKProject);
  await mobile.UrlErrorValidation();

  await expect(page.frameLocator('#main').getByText('URL do Servidor (produção)')).toBeVisible();
});

test('Valida geração de APK', async ({ page }) => {
  test.setTimeout(480000);

  await mobile.IDEopenProject(APKProject);
  await mobile.generateAndroidApk();

  await expect(page.frameLocator('#main').locator(`//*[text()="Sua aplicação foi gerada com sucesso!"]`)).toBeVisible();
});

test('Valida geração de Bundle Android', async ({ page }) => {
  test.setTimeout(480000);

  await mobile.IDEopenProject(APKProject);
  await mobile.generateAndroidBundle();

  await expect(page.frameLocator('#main').locator(`//*[text()="Sua aplicação foi gerada com sucesso!"]`)).toBeVisible();
});
