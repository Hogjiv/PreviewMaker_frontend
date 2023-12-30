'use strict';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');
const { ScanFiles } = require("./logic.js");



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../src/preload.js'),
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  ipcMain.handle('startScriptEvent', async (event, data) => {
    console.log(' 1 step, startScript');
    event.sender.send('scriptRunningEvent', true);
    //sock.emit('scriptRunning', true)
      await startScript(data);
      //await cacheCreate( );
      return data;
  });

  console.log('2 step, between');

  /*ipcMain.handle('scriptRunningEvent', async (event, data) => {
    console.log('Handle scriptRunning invoked')
    console.log('3 step');
    try {

      event.sender.send('scriptRunningEvent', true);
      event.sender.send('modelsList', [...recached, ...modelsList]);
      event.sender.send('scriptRunning', false);

      console.log('4 step');
    } catch (err) {
      console.error(err);
    }
    return;
  });*/


  async function startScript( data) {
    const { modelPath, imagePath, smallPreview, titleText, softScan = false, hardScan = true } = data
  //const excluded = [...(softScan && cache ? cache.map(el => el.model) : []), 'scan.json'];
 /*   async function modelsList([...recached, ...modelsList]) {
      console.log("???")
    }*/
  const modelsList =  await ScanFiles (modelPath)
    console.log('5 step, startScript');
 
  }

});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
