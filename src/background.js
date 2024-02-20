"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import fs from "fs";
import { bigImage } from "./logic.js";

const jimp = require("jimp");
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const { ScanFiles } = require("./logic.js");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../src/preload.js"), 
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    console.log("!!!!!??????");
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  ipcMain.handle("startScriptEvent", async (event, data) => {
    console.log(" 1 step, startScript");

    await startScript(data);
    async function startScript(data) {
      try {
        event.sender.send("scriptRunningEvent", true);
        const {
          modelPath,
          imagePath,
          smallPreview,
          titleText,
          softScan = false,
          hardScan = true,
        } = data; 

        //create cash and check if it exist. If yes, an attempt is made to read the JSON.
        const cachePath = imagePath + "/scan.json";
        console.log("STEP 3 , cachePath is ", cachePath);
        let cache = null;

        if (fs.existsSync(cachePath)) {
          try {
            cache = JSON.parse(fs.readFileSync(cachePath).toString());
            console.log("HERE")
          } catch (err) {
            console.log("SERVER reading cache error!", cachePath, err);
            cache = null;
          }
        }

        const recached = [];
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
              image: img64,
            });
          }
        }
        if (!softScan && !hardScan && cache) {
          event.sender.send("modelsListEvent", recached);
          event.sender.send("scriptRunningEvent", false);
          // event.sender.send('modelsListEvent', true);
          return;
        }

        // check for excluded files
        const excluded = [
          ...(softScan && cache ? cache.map((el) => el.model) : []),
          "scan.json",
        ];

        const modelsList = await ScanFiles(modelPath, excluded);
        event.sender.send("modelsListEvent", [...recached, ...modelsList]);
        console.log(modelsList, "this is modelsList ????");

        const completeList = await bigImage(
          modelsList,
          imagePath,
          titleText,
          event.sender
        );
        

        console.log(completeList, "this is complete list !!!");
        // JSON writing
        let old = null;
        try {
          old = JSON.parse(fs.readFileSync(cachePath).toString());
        } catch (e) {
          old = null;
        }

        console.log(old, "this is OLD CASHE ????");
        old = [...(old || []), ...completeList];
        fs.writeFileSync(cachePath, JSON.stringify(old));

        event.sender.send("scriptRunningEvent", false);
      } catch (err) {
        console.error(err);
        //res.status(500).send("Can't make preview");
      }
    }
    console.log("THE END");
    return data;
  });
});
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
