//const jimp = require("jimp");
//const fs = require("fs");
const { readdir } = require("fs/promises");
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
        //const modelCounter = replacedFiles.length;
        console.log(replacedFiles)
        //console.log(replacedFiles, " total read" + modelCounter, "step 2");
        return replacedFiles;
    } catch (err) {
        console.log("scan files error", err)
        throw err;
    }
}

module.exports = { ScanFiles };