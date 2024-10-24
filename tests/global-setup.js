import { WebMobile } from './pages/project/lowCode/WebMobile';
import { chromium } from 'playwright';
import { projectName } from '../tests/config/project.json';
import { InitialNavegate } from './pages/InitialNavegate';

// global-setup.js

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const context = await browser.newContext();
  const initialNavegate = new InitialNavegate(page, context);

  const webMobile = new WebMobile(page, context);

  console.log(`\nCriando o projeto ${projectName}...\n`);

  await webMobile.visit();
  await webMobile.IDElogin();
  await initialNavegate.verifyInitialInputs();

  await webMobile.createProjectMobileWeb(projectName);
  await webMobile.runProject();

  await webMobile.closeDeviceSelectionScreen();
  await webMobile.IDELogout();
};
