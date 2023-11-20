<script>
export default {
  data() {
    return {};
  },
};
</script>

<template> 
    
    <div class="faqContent ">
          <h1 class=" text-center"> How to use a script </h1>
          <div class="texts"> 
        <p class="font-color-pink font-color-pink"> This script was created for myself for everyday usage. It's now surpraised, that every archive, downloaded from any resource, could be plased spmwhere in you PC and it's totally legal to use it every time when you need a model. Problem is, not every archieve has a preview. With previews you folders looks more organaize and simple to use. Without previews it's not possible to understand what is inside, and naming of every folder take too much time and not everytime clear to understand what's inside. 
            This script will organize you files and help to work a little bit simpler and faster
         </p> 
        <p> 1. Choose a directory where you models are <br>
            2. Choose a directory where you want to put previews  <br>
            3. If you trying to make preview for first time it's highly recommended to check up Hard scan function. It will scan all files in choosen directory and save special data for take it again in any moment. For example, you will have acsess to preview even when you Internet connection doesn't work, as this file @remember@ page in current state * <br>
            4. Choose Soft Scan if you alredy scaned files before. Choose this option, if you added new models to folder or did some other changes (deleted files, added new). This option will rewrite you special file and you will have acsess to  your refreshed previews <br>
            5. After Soft Scan or Hard scan hase been choosed, push Run Script button! Try to push "Show progress" now  <br>
            6. Now you can see a table with all models,  wich was scanned. You can see models name as it's called in archive name and name of models.  It can take time to scan your files and find in on website. You can see progress in progress bar, located upper of the table ** <br>
            // 7. If you already scaned a directory and have magic Json file in you directory, you can search anything with keyword in Search bar. Just write name of model, production or other and you can find if you have nesessary model. Very fast and useful!<br>

            * It's now important if you have zip/rar or unarchived files.  My script will do everything with any state of you files.  <br>
            ** Sometimes it can take a lot of time to scan files and find all previews on website. Sometimes 3dd doesn't respond correctly and you need to reload page and start again, unfortunately. 
         </p>
        </div>    
   </div>
 
</template>

<style>
.vv {background-color: azure;
  position: absolute;

}

.faqContent {  
  width: 550px;
  max-width: 450px;
  min-height: 500px;
  height: 100%;
  background-color: rgb(72, 72, 72);
  color: white; 
  overflow-y: auto;
  /* display: flex;
  flex-direction: column;
  align-items: center;  */
 
}
.texts {
  padding: 10px 30px 10px 30px; /* Добавьте отступы сюда в формате: верх право низ лево */
}
.block-animated {
    /* animation: slideIn 1s ease-in-out;      */
  
}
 
</style>
