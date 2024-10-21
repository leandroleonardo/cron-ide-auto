const { InitialNavegate } = require('../../pages/InitialNavegate');
const { MicroServico } = require('../../pages/project/lowCode/MicroServico');
const { test, expect } = require('@playwright/test');

let initialNavegate, microServico, newPage, iframe;

test.beforeEach(async ({ page, context }) => {
  newPage = null;
  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  microServico = new MicroServico(page, context);

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

const projectDado = 'Auto-Serviço-Dados';
const projectNegocio = 'Auto-Serviço-Negocio';

//Testes criação para projeto de micro serviço de dados
test.only('Valida criação Micro Serviço de dados', async ({ page, context }) => {
  test.setTimeout(1320000);
  await microServico.createProjectMicroServico(projectDado);
  await microServico.runProject('Swagger');

  newPage = await context.waitForEvent('page');
  await microServico.acessPage(newPage);
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida abertura projeto Micro Serviço de dados', async ({ page, context }) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectDado);
  await microServico.runProject('Swagger');

  newPage = await context.waitForEvent('page');
  await microServico.acessPage(newPage);
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida exclusão projeto Micro Serviço de dados', async ({ page, context }) => {
  test.setTimeout(60000);
  await initialNavegate.searchProject(projectDado);
  await initialNavegate.deleteProject();
  newPage = page;
  await expect(iframe.getByText(projectDado).nth(1)).toBeHidden();
});
/*Testes criação para projeto de micro serviço de negócio*/
test.only('Valida criação projeto Micro Serviço de Negócio', async ({ page, context }) => {
  test.setTimeout(1320000);
  await microServico.createProjectMicroServico(projectNegocio);
  await microServico.runProject('Swagger');
  newPage = await context.waitForEvent('page');
  await microServico.acessPage(newPage);
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida abertura projeto Micro Serviço de Negócio', async ({ page, context }) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectNegocio);
  await microServico.runProject('Swagger');
  newPage = await context.waitForEvent('page');
  await microServico.acessPage(newPage);
  await expect(newPage.getByText('blockly.HelloWorld')).toBeVisible();
});

test('Valida exclusão projeto Micro Serviço de Negócio', async ({ page, context }) => {
  test.setTimeout(60000);
  await initialNavegate.searchProject(projectNegocio);
  await initialNavegate.deleteProject();
  newPage = page;
  await expect(iframe.getByText(projectNegocio).nth(1)).toBeHidden();
});