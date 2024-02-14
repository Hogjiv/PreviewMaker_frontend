const pie = require("puppeteer-in-electron");

const puppeteer = require("puppeteer");
const jimp = require("jimp");

const fs = require("fs");
const { readdir } = require("fs/promises");
const axios = require("axios");

async function ScanFiles(modelPath, excluded = []) {
  let files = [];
  try {
    files = await readdir(modelPath);
    //console.log(files, "step 01");

    // Use a Set to keep track of unique file names
    const uniqueFiles = [];

    const replacedFiles = files
    .map((file) => file.replace(/[-(].*|\s+$/gi, "").replace(/\.(rar|zip|jpeg|png|jpg)$/i, "").trim())
      .filter((file) => {
        if (excluded.includes(file)) {
          return false;
        }
        //console.log(excluded, "excluded content")
        if (uniqueFiles.includes(file)) {
          return false;
        }
        uniqueFiles.push(file);
        return true;
      })
    //console.log(replacedFiles, "clean zip/rar");
    const modelCounter = replacedFiles.length;
    //console.log(modelCounter);

    console.log(replacedFiles, "SCRIPTINPROGRESS total read" + modelCounter);

    return replacedFiles;
  } catch (err) {
    throw err;
  }
}
// https://3ddd.ru/3dmodels?query=2438678.5cd5de4309d4f&order=relevance

async function bigImage(modelName, imagePath, titleText, smallPreview,  socket) {
  const result = []

  const browser = await pie.connect(app, puppeteer);
  /*const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./tmp",
  });*/
  console.log(modelName, "SCRIPTINPROGRESS model names");
  const page = await browser.newPage();

  for (const model of modelName) {
    await page.goto(`https://3ddd.ru/3dmodels?query=${encodeURIComponent(model)}&order=relevance`, { waitUntil: "load", timeout: 10000 });
    const pageUrl = page.url();

    console.log("SCRIPTINPROGRESS Current page URL:", pageUrl);

    try {
      await page.waitForSelector(".model-image ", { timeout: 30000 });
    } catch (err) {
      continue;
    }
    await page.waitForTimeout(5000);

    const linkHref = await page.evaluate(() => {
      const linkElement = document.querySelector(".model-image  a");
      if (linkElement) {
        return linkElement.href;
      } else {
        return;
      }
    });
    // waiting load page
    await page.waitForTimeout(3000);

    // go to page with image
    if (linkHref) {
      try {
        await page.goto(linkHref, { waitUntil: "load", timeout: 0 });
        //console.log("step4, page opened");
      } catch (error) {
        console.error("Error occurred during page navigation:", error);
        continue;
      }
    }
    await page.waitForTimeout(3000);
    // !!!???
    // Переходим на страницу с полученной ссылкой

    // открываем большую картинку
    const imageElement = await page.$(".big-view img");
    if (imageElement) {
      const imageUrl = await page.$eval(".big-view img", (img) => img.src);

      // other info ...
      //Search title name
      const titleElement = await page.waitForSelector(".title");
      const titleText = await page.evaluate(element => element.textContent, titleElement);


      // make rule for create new image name
      const rxName = /\/(\d+\.[a-zA-Z0-9]+)/;

      const imageNames = imageUrl.match(rxName)[1];
      const imageName = imageNames;
      const newImagePath = `${imagePath}/${imageName}.jpeg`;

      try {
        const response = await axios.get(imageUrl,  {
          responseType: "arraybuffer",
          timeout: 30000,
        });
        const imageBinaryData = response.data
           //make small img
        const compressedImage = await jimp.read(imageBinaryData)
        if (smallPreview) {
          compressedImage.scale(0.5, jimp.RESIZE_BEZIER);
        }
        await compressedImage.writeAsync(newImagePath)
        const img64 = await compressedImage.getBase64Async(jimp.MIME_PNG)


        socket.emit('modelImage', {
          modelName: model,
          title: titleText,
          image: img64
        })


        result.push({
          model,
          title: titleText,
          path: newImagePath
        })
      } catch (error) {
        console.error("Error saving image:", error);
      }
    } else {
    }
    socket.emit("modelSaved", model);
  }
  await browser.close();

  console.log("SCRIPTINPROGRESS Big previews done! open2");
  return result
}

module.exports = { ScanFiles,    bigImage };
