<script>
//import progressWindow from "@/components/progressWindow.vue";
import progressBar from "@/components/progressBar";
import checkBox from "@/components/checkBox";
import faqPage from "@/components/faqPage";

export default {
  data() {
    return {
      showProgress: false,
      modelPath: "",
      imagePath: "",
      preview: true,
      showMore: false,
      state2: true,
      softScan: false,
      hardScan: true,
      faqOpen: false,
      showMessage: false
    };
  },
  created() {
    this.$store.dispatch('ioConnect');
  },
  components: {
    //progressWindow,
    faqPage,
    progressBar,
    checkBox,
  },
  watch: {
   '$store.state.scriptRunning'(newVal) {
    // console.log(`Свойство 'scriptRunning' изменилось: ${oldVal} -> ${newVal}`);
    if(newVal === false) {
      this.showMessage = true
    }
  }
},
    methods: {
      theOneButtonClicked() {
        if (this.$store.state.scriptRunning) {
          this.showProgress = !this.showProgress
        } else {
          this.makePreview()
        }
      },
      makePreview() {
        this.$store.dispatch("makePreview", {
          modelPath: this.modelPath,
          imagePath: this.imagePath,
          // smallPreview: this.smallPreview
          softScan: this.softScan,
          hardScan: this.hardScan
        });
      }
  },
};
</script>

<template>
  <div class="header d-flex justify-content-center align-items-center">
    <h2 class="bold-text font-color-dark text-uppercase"> Preview maker</h2>
  </div>

  <div class="fluid-container d-flex flex-row">
    <div class="container-lg d-flex flex-column justify-content-center align-items-center">

      <div class="container-lg d-flex flex-row justify-content-center align-items-center menu">
        <div class="row col-12 ">
          <div class="d-flex scan flex-column col-sm-2 col-md-2 justify-content-center align-items-center col-12">
            <div class="d-flex flex-row">
              <checkBox v-model="softScan" />
              <p class="font-size-16"> Soft scan </p>
            </div>
            <div class="d-flex flex-row">
              <checkBox v-model="hardScan" />
              <p class="font-size-16"> Hard scan </p>
            </div>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center col-sm-8 col-md-8 col-12">
            <input type="text" v-model="modelPath" class="input-form" @input="saveDataModel"
              placeholder="Path for load models C:/AppData/User/" />
            <input type="text" v-model="imagePath" class="input-form mt-4" @input="saveDataImage"
              placeholder="Path for save image C:/AppData/User/" />
          </div>
          <div class="d-flex justify-content-center align-items-center faq  col-sm-2 col-md-2  j col-12 ">
            <button class="btn btn-faq" @click="faqOpen = !faqOpen"> FAQ </button>
            <div v-if="faqOpen">
              <faqPage class="mt-4"> </faqPage>
            </div>
          </div>
        </div>
      </div>

      <div class="containter d-flex flex-column justify-content-center align-items-center">
        <div class="btn-block">
          <div>
            <button class="btn big-btn" :disabled="$store.state.scriptRunning" @click="theOneButtonClicked">
              <p class="bold-text font-size-22 font-color-dark text-center">
                <span v-if="$store.state.scriptRunning">Running!</span>
                <span v-else>Run Script</span>
              </p>
            </button>
          </div>
          <!-- <div class=""> -->
          <button class="btn big-btn mt-3" @click="showProgress = !showProgress">
            <p class="bold-text font-size-22  font-color-dark text-center">
              <span v-if="showProgress">Show less</span>
              <span v-else>Show Progress</span>
            </p>
          </button>
          <!-- </div> -->
        </div>


        <!-- open preview searcher when button pushed -->
        <div v-if="showProgress">
          <div v-if="$store.state.scriptRunning">
            <progressBar class="my-4 d-flex justify-content-center align-items-center"> </progressBar>
          </div>
          <!-- <h2 v-if="$store.state.showMessage !== ''"
            class="justify-content-center align-items-center text-center my-4 font-color-pink"> Finish! </h2> -->
            <h2 v-if="showMessage"
            class="justify-content-center align-items-center text-center my-4 font-color-pink"> 
              Finish! 
            </h2>
             
          <!-- preview searcher -->
          <div class="container w-100 preview-window">
            <div class="row justify-content-center align-items-center">
              <div class="card  col-sm-6 col-md-4 col-lg-3 d-flex align-items-center mt-4 mx-3"
                v-for="model in $store.state.modelsList" :key="model.name">
                <img class="model-image my-3" v-if="model.image" :src="model.image" />
                <p class="font-size-14 font-color-dark   medium-text text-center">
                  {{ model.name }}
                </p>
                <p class="font-size-16 font-color-pink  text-center  medium-text">
                  {{ model.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.preview-window {
  background-color: #F1F1F1;
  margin-top: 10px;
  padding-top: 10px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-radius: 25px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
}

.faq {
  right: 300px;
}

.btn-faq {
  width: 80px;
  height: 80px;
}

containter {
  padding: 0px 0px 0px 0px;
}

.v {
  background-color: #b560a7;
}

.x {
  background-color: #60b58b;
}

.t {
  background-color: #a5b560;
}

.xx {
  background-color: #8cad98;
  height: 100px;
}

p {
  margin: 0px !important;
  margin-bottom: 0px !important
}

.model-image {
  width: 300px;
  height: 300px;
}

.card {
  width: 360px;
  height: 420px;
}

.menu {
  height: auto;
  padding: 20px 0px 20px 0px;
}

.header {
  background-color: #F1F1F1;
  height: 70px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
}

.container-div {
  background-color: #576aa2;
  width: 1200px;
}

.previewer {
  background-color: #8cad98;
  height: 1000px;
}

.progress-menu {
  background-color: #e4c64c;
}

.buttons {
  height: 100px;
}

.content {
  background-color: #ca7b7b;
}

.checkbox-div {
  background-color: #e6caca;
}

.big-btn {
  outline: none;
  border: none;
  width: 210px !important;
  height: 75px !important;
  border-radius: 25px;
  background-color: #BCBCBC;
  padding-top: 13px;
}

.input-block {
  align-items: end !important;
}

.progress-window {
  background-color: rgb(138, 90, 31);
}

.input-form {
  width: 430px;
  height: 50px;
  background-color: #F0EEF0;
  border-radius: 25px;
  border-style: none;
  outline: none;
}

.main-form {
  height: 100%;
  width: 100%;
  background-color: #a5b560;
}

.btn:hover {
  background-color: #C97191;
  color: #e6caca;
}

.btn:hover p {
  color: #ffffff;
}</style>
