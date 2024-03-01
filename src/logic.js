const fs = require("fs");
const { readdir } = require("fs/promises");
const axios = require("axios").default;
const jimp = require("jimp").default;

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

    return replacedFiles;
  } catch (err) {
    console.log("scan files error", err);
    throw err;
  }
}

/*
async function bigImage(modelsList, imagePath, titleText, eventSender) {
  const result = [];
  for (const model of modelsList) {
    let imageFound = false;
    await postData(model);

    if (imageFound) {
      continue;
    }


    const rxName = /\/([^\/]+)$/;
    const imageNameMatch = fullImageUrl.match(rxName);
    const imageName = imageNameMatch && imageNameMatch[1];

    if (!imageName) {
      console.error(
        "Failed to extract image name from URL:",
        fullImageUrl
      );
      continue;
    }

    const newImagePath = `${imagePath}/${imageName}`;
    console.log(titleEn);
    console.log(slug);



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

        const modelData = response.data.data.models[0];
        if (!modelData) {
          console.log(`No model data found for model: ${model}`);

          const defaultImageUrl =
          "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/model_images/0000/0000/6256/6256719.65dfd6cd18ea1.jpeg";
         
        try {
          const response = await axios.get(defaultImageUrl, {
            responseType: "arraybuffer",
          });
          const imgBase64 = Buffer.from(response.data, "binary").toString("base64");
     
          eventSender.send("modelImageEvent", {
            modelName: model,
            title: "Model not found",
            image: imgBase64,
          });


          result.push({
            model,
            title: "NO TITLE",
            path: newImagePath,
          });




        } catch (error) {
          console.error("Error fetching default image:", error);
        }
        }

        const firstImage = modelData.images[0];
        // const titleRus = modelData.category.title;
        const titleEn = modelData.title_en;
        const slug = modelData.slug;

        if (firstImage && response.status >= 200 && response.status < 300) {
          for (const backend of backends3dd) {
            const fullImageUrl = `${backend}${firstImage.web_path}`;
            imageFound = true;
            console.log(fullImageUrl, "fullImageUrl!!!!!!");

            // const rxName = /\/([^\/]+)$/;
            // const imageNameMatch = fullImageUrl.match(rxName);
            // const imageName = imageNameMatch && imageNameMatch[1];

            // if (!imageName) {
            //   console.error(
            //     "Failed to extract image name from URL:",
            //     fullImageUrl
            //   );
            //   continue;
            // }

            // const newImagePath = `${imagePath}/${imageName}`;
            // console.log(titleEn);
            // console.log(slug);

            const imageResponse = await axios.get(fullImageUrl, {
              responseType: "arraybuffer",
              timeout: 30000,
            });

            const imageBinaryData = imageResponse.data;

            const compressedImage = await jimp.read(imageBinaryData);
            await compressedImage.writeAsync(newImagePath);
            const img64 = await compressedImage.getBase64Async(jimp.MIME_PNG);

            eventSender.send("modelImageEvent", {
              modelName: model,
              title: titleEn,
              image: img64,
            });
            // Преобразование изображения в строку base64
            //  const imgPath = "./assets/noImageFound.jpg";
            //  const noImage = await jimp.read(imgPath);
            //const noImage64 = await noImage.getBase64Async(jimp.MIME_JPEG);
            // eventSender.send("modelImageEvent", {
            //   modelName: model,
            //   title: !modelData ? "Model not found" : titleEn,
            //   image: !modelData ? "Model not found" : img64,
            // });

            result.push({
              model,
              title: titleEn,
              path: newImagePath,
            });

            eventSender.send("modelSavedEvent", model);

            break;
          }
        } else {
          console.log(`No image found for model: ${model}`);
          console.error(error);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No image found for model: ${model}`);
        } else {
          // HERE MODEL NOT FOUND
          console.log("NOT FOUND ", model);
        }
      }
    }
  }
  return result;
}
*/async function bigImage(modelsList, imagePath, titleText, eventSender) {
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

        const modelData = response.data.data.models[0];
        if (!modelData) {
          console.log(`No model data found for model: ${model}`);

          // const defaultImageUrl =
          //   "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/model_images/0000/0000/6256/6256719.65dfd6cd18ea1.jpeg";
          // try {
          //   const response = await axios.get(defaultImageUrl, {
          //     responseType: "arraybuffer",
          //   });
          //   const imgBase64 = Buffer.from(response.data, "binary").toString("base64");
            
          const   defaultImageUrl = fs.readFileSync('./src/assets/noImageFound.jpg')
            const imgBase64 = Buffer.from(defaultImageUrl, "binary").toString("base64");


            eventSender.send("modelImageEvent", {
              modelName: model,
              title: "Model not found",
              image:"data:image/png;base64," + imgBase64,
            });

            const imageName = "noImageFound.jpg"; // Change this to the actual image name
            const newImagePath = `${imagePath}/${imageName}`; // Define newImagePath here

            result.push({
              model,
              title: "NO TITLE",
              path: newImagePath,
            });

          // } catch (error) {
          //   console.error("Error fetching default image:", error);
          // }
          return;
        }

        const firstImage = modelData.images[0];
        const titleEn = modelData.title_en;
        const slug = modelData.slug;

        if (firstImage && response.status >= 200 && response.status < 300) {
          for (const backend of backends3dd) {
            const fullImageUrl = `${backend}${firstImage.web_path}`;
            imageFound = true;
            console.log(fullImageUrl, "fullImageUrl!!!!!!");

            const rxName = /\/([^\/]+)$/;
            const imageNameMatch = fullImageUrl.match(rxName);
            const imageName = imageNameMatch && imageNameMatch[1];

            if (!imageName) {
              console.error(
                "Failed to extract image name from URL:",
                fullImageUrl
              );
              continue;
            }

            const newImagePath = `${imagePath}/${imageName}`;
            console.log(titleEn);
            console.log(slug);

            const imageResponse = await axios.get(fullImageUrl, {
              responseType: "arraybuffer",
              timeout: 30000,
            });

            const imageBinaryData = imageResponse.data;

            const compressedImage = await jimp.read(imageBinaryData);
            await compressedImage.writeAsync(newImagePath);
            const img64 = await compressedImage.getBase64Async(jimp.MIME_PNG);

            eventSender.send("modelImageEvent", {
              modelName: model,
              title: titleEn,
              image: img64,
            });

            result.push({
              model,
              title: titleEn,
              path: newImagePath,
            });

            eventSender.send("modelSavedEvent", model);

            break;
          }
        } else {
          console.log(`No image found for model: ${model}`);
          console.error(error);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No image found for model: ${model}`);
        } else {
          // HERE MODEL NOT FOUND
          console.log("NOT FOUND ", model);
        }

        // const   defaultImageUrl = fs.readFileSync('./src/assets/noImageFound.jpg')
        // const imgBase64 = Buffer.from(defaultImageUrl, "binary").toString("base64");


        // eventSender.send("modelImageEvent", {
        //   modelName: model,
        //   title: "Model not found",
        //   image:"data:image/png;base64," + imgBase64,
        // });

        // const imageName = "noImageFound.jpg"; // Change this to the actual image name
        // const newImagePath = `${imagePath}/${imageName}`; // Define newImagePath here

        // result.push({
        //   model,
        //   title: "NO TITLE",
        //   path: newImagePath,
        // });


      }
    }
  }
  return result;
}


module.exports = { ScanFiles, bigImage };
