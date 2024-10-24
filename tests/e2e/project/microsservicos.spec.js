import { Microsservico } from '../../pages/project/lowCode/Microsservico';
import { test, expect } from '@playwright/test';

let microsservico, newPage, iframe;
const projectDado = 'Auto-Serviço-Dados';
const projectNegocio = 'Auto-Serviço-Negocio';

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(250000);
  newPage = null;
  microsservico = new Microsservico(page, context);

  await microsservico.visit();
  await microsservico.IDElogin();
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
  await microsservico.IDELogout();
});

/* Testes criação para projeto de microsserviços de dados */

test('Valida criação Microsserviços de dados', async ({ page, context }) => {
  test.setTimeout(1320000);

  await microsservico.createMicrosservicesProject(projectDado, 'data');
  await microsservico.runProject();
  await microsservico.openProject('Doc');

  newPage = await context.waitForEvent('page');
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida abertura projeto Microsserviços de dados', async ({ page, context }) => {
  test.setTimeout(250000);

  await microsservico.IDEopenProject(projectDado);
  await microsservico.runProject();
  await microsservico.openProject('Doc');

  newPage = await context.waitForEvent('page');
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida exclusão projeto Microsserviços de dados', async ({ page, context }) => {
  test.setTimeout(60000);

  await microsservico.searchProject(projectDado);
  await microsservico.deleteProject();

  await expect(page.frameLocator('#main').getByText(projectDado).nth(1)).toBeHidden();
});

/* Testes criação para projeto de microsserviços de negócio */

test('Valida criação projeto Microsserviços de Negócio', async ({ page, context }) => {
  test.setTimeout(1320000);

  await microsservico.createMicrosservicesProject(projectNegocio, 'business');
  await microsservico.runProject();
  await microsservico.openProject('Doc');

  newPage = await context.waitForEvent('page');
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida abertura projeto Microsserviços de Negócio', async ({ page, context }) => {
  test.setTimeout(250000);

  await microsservico.IDEopenProject(projectNegocio);
  await microsservico.runProject();
  await microsservico.openProject('Doc');

  newPage = await context.waitForEvent('page');
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida exclusão projeto Microsserviços de Negócio', async ({ page, context }) => {
  test.setTimeout(60000);

  await microsservico.searchProject(projectNegocio);
  await microsservico.deleteProject();

  await expect(page.frameLocator('#main').getByText(projectNegocio).nth(1)).toBeHidden();
});
