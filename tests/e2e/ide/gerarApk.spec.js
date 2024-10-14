const { InitialNavegate } = require('../../pages/InitialNavegate');
const { test, expect } = require('@playwright/test');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { MobileDevices } = require('../../pages/ide/Mobile');

let initialNavegate, iframe, newPage, webMobile, mobileDevices;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(1000000);
  const projetoApk = 'GeracaoAPK';
  newPage = null;
  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);
  mobileDevices = new MobileDevices(page, context);
  await initialNavegate.visit();
  await initialNavegate.login();
  await webMobile.createProjectMobileWeb(projetoApk);
});

test.only('Mensagem valida URL mobile', async ({ page }) => {
  test.setTimeout(600000);
  await mobileDevices.UrlErrorValidation();
});

test('Gerar APK', async ({ page }) => {
  test.setTimeout(1000000);
  await mobileDevices.generateApkAndroid();
});
