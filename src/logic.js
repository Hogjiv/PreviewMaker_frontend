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

//async function bigImage(modelName, imagePath, titleText, smallPreview, socket) {
async function bigImage(modelName, imagePath, titleText, smallPreview, socket) {
    /*    console.log(modelName, imagePath, titleText, smallPreview,  socket)*/

    const modelData = {
        title: "Your Model Title",
        number: "507887.56f3be83803f0",
    };

    async function postData() {
        try {
            const response = await axios.post("https://3ddd.ru/api/models",{
                query: modelData.number
            });
        /*    console.log(response.data.data.models);*/
            const slug = response.data.data.models[0].slug
            console.log(slug, "66666666");

            const images = response.data.data.models[0].images
            console.log(images, "111111111")
        } catch (error) {
            console.error(error);
        }
    }
    await postData( );
}
module.exports = {ScanFiles, bigImage};
