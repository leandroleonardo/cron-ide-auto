import { InitialNavegate } from './pages/InitialNavegate';
import { WebMobile } from './pages/project/lowCode/WebMobile';
const { chromium } = require('playwright');
const { projectName } = require('../tests/config/project.json');

// global-setup.js

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const context = await browser.newContext();

  const initialNavegate = new InitialNavegate(page, context);
  const webMobile = new WebMobile(page, context);

  console.log(`\nCriando o projeto ${projectName}...\n`);

  await initialNavegate.visit();
  await initialNavegate.login();

  await webMobile.createProjectMobileWeb(projectName);
  await webMobile.runProject();

  await initialNavegate.IDELogout();
};
