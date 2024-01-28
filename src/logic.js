//const jimp = require("jimp");
//const fs = require("fs");
const {readdir} = require("fs/promises");
const axios = require("axios").default;
const jimp = require("jimp");

async function ScanFiles(modelPath, excluded = []) {
    let files = [];
    try {
        files = await readdir(modelPath);
        const uniqueFiles = [];
        const replacedFiles = files
            .map((file) => file.replace(/[-(].*|\s+$/gi, "").replace(/\.(rar|zip|jpeg|png|jpg)$/i, "").trim())
            .filter((file) => {
                if (excluded.includes(file)) {
                    return false;
                }
                if (uniqueFiles.includes(file)) {
                    return false;
                }
                uniqueFiles.push(file);
                return true;
            })
        // console.log("excluded files", excluded)
        //   const modelCounter = replacedFiles.length;
        /*     console.log("replaced names of scanned models", replacedFiles)*/
        /*console.log(" total read" + modelCounter, "step 2");*/
        return replacedFiles;
    } catch (err) {
        console.log("scan files error", err)
        throw err;
    }
}


// Define bigImage function
async function bigImage(modelsList, imagePath, titleText, smallPreview, socket) {
    // Loop through modelsList and call postData for each model
    for (const modelName of modelsList) {
        // Use a flag to track if at least one image is found
        let imageFound = false;
        await postData(modelName);

        // If imageFound is true, proceed to the next model
        if (imageFound) {
            continue;
        }

        // Define postData function
        async function postData(modelName) {
            try {
                // Make an API request to get model data
                const response = await axios.post("https://3ddd.ru/api/models", {
                    query: modelName
                });

                // Define possible backend URLs
                const backends3dd = [
                    "https://b5.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
                    "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
                    "https://b7.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/"
                ];

                // Extract model data and the first image
                const modelData = response.data.data.models[0];
                const firstImage = modelData.images[0];
                const slug = modelData.slug;
                console.log(`Slug: ${slug}`);

                // Check if the first image exists and the response is successful
                if (firstImage && response.status >= 200 && response.status < 300) {
                    // Iterate over backend URLs and construct full image URLs
                    for (const backend of backends3dd) {
                        const fullImageUrl = `${backend}${firstImage.web_path}`;
                        console.log(fullImageUrl);

                        // Set imageFound to true and break the loop
                        imageFound = true;
                        break;
                    }
                } else {
                    console.log(`No image found for model: ${modelName}`);
                }
            } catch (error) {
                // Handle errors, check if response status is 404
                if (error.response && error.response.status === 404) {
                    console.log(`No image found for model: ${modelName}`);
                } else {
                    console.error(error);
                }
            }
        }
    }
}


module.exports = {ScanFiles, bigImage};