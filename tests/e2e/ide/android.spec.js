const { InitialNavegate } = require('../../pages/InitialNavegate');
const { test, expect } = require('@playwright/test');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { MobileDevices } = require('../../pages/ide/Mobile');

let initialNavegate, webMobile, mobileDevices, image;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(10000000);
  const projetoApk = 'GeracaoAPK';
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);
  mobileDevices = new MobileDevices(page, context);
  await initialNavegate.visit();
  await initialNavegate.login();
  await webMobile.createProjectMobileWeb(projetoApk);
});

test.afterEach(async ({ page, context }, testInfo) => {
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test('Valida a mensagem de URL inválida', async ({ page }) => {
  test.setTimeout(600000);
  await mobileDevices.UrlErrorValidation();
  await expect(this.iframe.getByText('URL do Servidor (produção)')).toBeVisible();
});

test('Valida a geração de APK', async ({ page }) => {
  test.setTimeout(1000000);
  await mobileDevices.generateAndroidApk();
});

test('Valida a geração de Bundle Android', async ({ page }) => {
  test.setTimeout(1000000);
  await mobileDevices.generateAndroidBundle();
});
