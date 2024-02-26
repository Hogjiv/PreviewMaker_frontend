const fs = require("fs");
const { readdir } = require("fs/promises");
const axios = require("axios").default;
const jimp = require("jimp").default;
// const { ipcRenderer } = require('electron');
// const {ipcMain} = require ('electron');

async function ScanFiles(modelPath, excluded = []) {
  let files = [];
  try {
    files = await readdir(modelPath);
    const uniqueFiles = [];
    const replacedFiles = files
      .map((file) =>
        file
          .replace(/[-(].*|\s+$/gi, "")
          .replace(/\.(rar|zip|jpeg|png|jpg)$/i, "")
          .trim()
      )
      .filter((file) => {
        if (excluded.includes(file)) {
          return false;
        }
        if (uniqueFiles.includes(file)) {
          return false;
        }
        uniqueFiles.push(file);
        return true;
      });
    // console.log("excluded files", excluded)
    //   const modelCounter = replacedFiles.length;
    /*     console.log("replaced names of scanned models", replacedFiles)*/
    /*console.log(" total read" + modelCounter, "step 2");*/
    return replacedFiles;
  } catch (err) {
    console.log("scan files error", err);
    throw err;
  }
}

async function bigImage(modelsList, imagePath, titleText,  eventSender) {
  console.log("88888image path", imagePath);
  console.log("888888titleText", titleText);
  console.log("8888modelsList", modelsList);
  const result = [];
  for (const model of modelsList) {
    let imageFound = false;
    await postData(model);

    if (imageFound) {
      continue;
    }

    // Define postData function
    async function postData(model) {
      try {
        // Make an API request to get model data
        const response = await axios.post("https://3ddd.ru/api/models", {
          query: model,
        });

        // Define possible backend URLs
        const backends3dd = [
          "https://b5.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b7.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
        ];

        // Extract model data and the first image
        const modelData = response.data.data.models[0];
        const firstImage = modelData.images[0];
        const titleRus = modelData.category.title;
        const titleEn = modelData.title_en;
        const slug = modelData.slug;

        console.log(`${slug}`, "SLUG");
        console.log(`${titleRus}`, "titleRus");
        console.log(titleEn, "TITLE");

        if (firstImage && response.status >= 200 && response.status < 300) {
          for (const backend of backends3dd) {
            const fullImageUrl = `${backend}${firstImage.web_path}`;
            imageFound = true;
            console.log(fullImageUrl, "fullImageUrl!!!!!!");

            const rxName = /\/([^\/]+)$/;
            const imageNameMatch = fullImageUrl.match(rxName);
            const imageName = imageNameMatch && imageNameMatch[1]; // Получаем имя изображения из URL

            if (!imageName) {
              console.error('Failed to extract image name from URL:', fullImageUrl);
              continue; // Пропускаем текущую итерацию цикла
          }
          const newImagePath = `${imagePath}/${imageName}`;   
          
          
            try {
              const imageResponse = await axios.get(fullImageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000,
              });

             // const newImagePath = `${imagePath}/${imageName}.jpeg`;
              //const imagePath = `${imagePath}/${imageName}.jpeg`;

              // const writer = fs.createWriteStream(newImagePath);
              // writer.on("finish", () => {
              //   console.log("Image saved successfully:", newImagePath);
              //   // Далее вы можете отправить событие socket и добавить результат в массив
              //   socket.send("modelImageEvent", {
              //     modelName: model,
              //     title: titleEn,
              //     image: fullImageUrl,
              //   });

              //   result.push({
              //     model,
              //     title: titleEn,
              //     path: newImagePath,
              //   });
              // });

              //imageResponse.data.pipe(writer);
                const imageBinaryData = imageResponse.data;
                // console.log(jimp)
                const compressedImage = await jimp.read(imageBinaryData);
                 await compressedImage.writeAsync(newImagePath);
                 const img64 = await compressedImage.getBase64Async(jimp.MIME_PNG);


                 eventSender.send("modelImageEvent", {
                  modelName: model,
                  title: titleEn,
                  image: img64
                 });


              result.push({
                model,
                title: titleEn,
                path: newImagePath,
              });
            } catch (error) {
              console.error("Error fetching image:", error);
              // const ImageNotFound = "No image found";

              // socket.send("modelImageEvent", {
              //   modelName: model,
              //   title: titleEn,
              //   image: ImageNotFound,
              // });
              // result.push({
              //   model,
              //   title: titleEn,
              //   path: "",
              // });
            }
            break;
          }
        } else {
          console.log(`No image found for model: ${model}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No image found for model: ${model}`);
        } else {
          console.error(error);
        }
      }
    }
  }
  return result;
}

module.exports = { ScanFiles, bigImage };
