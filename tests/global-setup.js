import { WebMobile } from './pages/project/lowCode/WebMobile';
import { chromium } from 'playwright';
import { projectName } from '../tests/config/project.json';
import { InitialNavegate } from './pages/InitialNavegate';
const readline = require('readline');

// global-setup.js

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question() {
  return new Promise(resolve => {
    rl.question('\nDeseja criar o projeto inicial para spec IDE? (s/n): ', answer => {
      resolve(answer.toLowerCase());
    });
  });
}

async function menu() {
  const answer = await question();

  if (answer === 's') {
    await createProject();
  } else if (answer === 'n') {
    console.log('Criação de projeto inicial cancelado.');
  } else {
    console.log('Resposta inválida. Por favor, digite "s" ou "n".');
    return menu();
  }

  rl.close();
}

async function createProject() {
  const browser = await chromium.launch({ headless: false });
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
}

module.exports = menu;
