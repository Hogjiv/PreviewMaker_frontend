'use strict';

import {app, protocol, BrowserWindow, ipcMain} from 'electron';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer';
import fs from "fs";
import { bigImage } from "./logic.js";
const jimp = require("jimp");
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');
const {ScanFiles} = require("./logic.js");


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
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

    /*const win = new BrowserWindow({ width: 800, height: 1500 })
    win.loadURL('https://3ddd.ru/3dmodels?subcat=biliard&cat=drugie')
*/

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        console.log("!!!!!@@@@@@")
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
        console.log("!!!!!??????")
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

        await startScript(data);
        console.log("ask  startScript from BACKGROUND")

        async function startScript(data) {
            try {
                event.sender.send('scriptRunningEvent', true);
                // define all main consts
                const {modelPath, imagePath, smallPreview, titleText, softScan = false, hardScan = true} = data
                console.log("SERVER Received modelPath: step1", modelPath);
                console.log("SERVER Received imagePath: step1", imagePath);

                //create cash and check if it exist. If yes, an attempt is made to read the JSON.
                const cachePath = imagePath + '/scan.json';
                console.log('STEP 3 , cachePath is ', cachePath)
                let cache = null;

                if (fs.existsSync(cachePath)) {
                    try {
                        cache = JSON.parse(fs.readFileSync(cachePath).toString())
                    } catch (err) {
                        console.log('SERVER reading cache error!', cachePath, err)
                        cache = null
                    }
                }

                const recached = []
                if (cache) {
                    for (let i = 0; i < cache.length; i++) {
                        // const img = await jimp.read(cache[i].path);
                        // const img64 = await img.getBase64Async(jimp.MIME_PNG);
                        // Заменяем jimp на console.log
                        const img64 = `base64_image_${i}`;
                        const img = `image_${i}`;

                        recached.push({
                            ...cache[i],
                            ready: true,
                            image: img64
                        });

                        /*console.log("JIMP here", img64, img);
                        console.log("dskjfhdksjfhkds!!@@#");*/
                    }
                }
             /*   if (cache) {
                    for (let i = 0; i < cache.length; i++) {
                        const img = await jimp.read(cache[i].path)
                        const img64 = await img.getBase64Async(jimp.MIME_PNG)
                        recached.push({
                            ...cache[i],
                            ready: true,
                            image: img64
                        })
                        console.log("JIMP here", img64, img)
                        console.log("dskjfhdksjfhkds!!@@#")
                    }
                }*/
                if (!softScan && !hardScan && cache) {
                    event.sender.send('scriptRunningEvent', true);
                    console.log('2 step, scriptRunningEvent');
                    event.sender.send('modelsListEvent', true);
                    console.log('3 step, modelsListEvent');
                    return
                }


                // check for excluded files
                const excluded = [...(softScan && cache ? cache.map(el => el.model) : []), 'scan.json'];
               /* console.log(excluded, "reading JSON");*/

                const modelsList = await ScanFiles(modelPath, excluded)
                console.log(modelsList, "SERVER models recieved, SCANFILE func going...")

                event.sender.send('modelsListEvent', [...recached, ...modelsList]);
                console.log('SERVER here is emit cached in Script')

                const completeList = await bigImage(modelsList, imagePath, smallPreview, titleText, event);

                console.log(completeList, " ")
                // JSON writing
                let old = null
                try {
                    old = JSON.parse(fs.readFileSync(cachePath).toString())
                    console.log(old, completeList, "!!!!!????!!!!!")
                } catch (e) {
                    old = null
                }

                old = [...(old || []), ...completeList]
                fs.writeFileSync(cachePath, JSON.stringify(old))
                console.log('SERVER ..wwait writing to json..')
                event.sender.send('scriptRunningEvent', false);
                //sock.emit('scriptRunning', false)
            } catch (err) {
                console.error(err);
                //res.status(500).send("Can't make preview");
            }
        }
        return data;
    });
    console.log('2 step, between');
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
