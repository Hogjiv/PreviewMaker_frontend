<script>
// import progressWindow from "@/components/progressWindow.vue";
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
      showMessage: false,
      showPopUp: false,
      disabled: false,
      btnActive: false,
      btnDisabled: false,
    };
  },

  created() {
    this.$store.dispatch("electronConnect");
  },

  components: {
    //progressWindow,
    faqPage,
    progressBar,
    checkBox,
  },
  watch: {
    "$store.state.scriptRunning"(newVal) {
      if (newVal === false) {
        console.log("WATCH")
        this.showMessage = true;
      }
    },
  },
  methods: {
    btnClosed() {
      console.log('BTNCLOSED from other comp')
      this.faqOpen = false
    },


    btnClicked() {
      // checking if fields are correct
      if (!this.isButtonDisabled()) {
        console.log("fields are correct");
        this.btnActive = true;
        this.btnDisabled = false;
        // Set showPopUp to false when fields are correct
        this.showPopUp = false;
      } else {
        this.showPopUp = false;
        setTimeout(() => {
          this.showPopUp = true;
          this.btnDisabled = true;
          this.btnActive = false;
        }, 1);
        console.log("ERROR");
      }

      // check if showProgress is active
      if (this.btnActive === true) {
        this.makePreview();
        console.log("btnActive = true");
        this.showProgress = !this.showProgress;
      } else {
        console.log("ELSE");
      }
    },
    isButtonDisabled() {
      const modelPathValid =
        this.modelPath.trim() && /^[A-Z]\W+.*$/gm.test(this.modelPath);
      const imagePathValid =
        this.imagePath.trim() && /^[A-Z]\W+.*$/gm.test(this.imagePath);
      return !modelPathValid || !imagePathValid;
    },
    makePreview() {
      this.$store.dispatch("makePreview", {
        modelPath: this.modelPath,
        imagePath: this.imagePath,
        softScan: this.softScan,
        hardScan: this.hardScan,
      });
      console.log(
        "modelpath = ", this.modelPath,
        "imgPath = ", this.imagePath,
        "softscan = ", this.softScan,
        "hardscan = ", this.hardScan)
    },
  },
};
</script>

<template>
  <div class="header d-flex justify-content-center align-items-center">
    <h2 class="bold-text font-color-dark text-uppercase">
      Preview maker
    </h2>
  </div>

  <div v-if="faqOpen">
    <div class="modal d-flex" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <faqPage @btnClosed='btnClosed'>
        sdf
      </faqPage>
    </div>
  </div>

  <div class="fluid-container d-flex flex-row">
    <div class="container-lg d-flex flex-column justify-content-center align-items-center">
      <div class="container-lg d-flex flex-row justify-content-center align-items-center menu">
        <div class="row col-12 d-flex justify-content-center ">
          <div
            class="d-flex flex-column col-lg-2 col-md-12 col-sm-12 col-12 justify-content-center align-items-center mt-3 mb-3 order-lg-1 order-sm-2 order-2 mt-4 mt-md-4 mt-lg-0   ">
            <div class="d-flex mb-3 mb-md-3 mb-lg-3">
              <checkBox v-model="softScan" />
              <p class="font-size-16 mx-2">Soft scan</p>
            </div>
            <div class="d-flex  ">
              <checkBox v-model="hardScan" />
              <p class="font-size-16 mx-1">Hard scan</p>
            </div>
          </div>

          <div
            class="d-flex flex-column justify-content-center align-items-center col-lg-8 col-md-12 col-sm-12 col-12 order-lg-2 order-sm-1 order-1">
            <input type="text" v-model="modelPath" class="input-form" @input="saveDataModel"
              placeholder="Path for load models" />
            <input type="text" v-model="imagePath" class="input-form mt-3" @input="saveDataImage"
              placeholder="Path for save image" />
             
          </div>
        

          <div
            class="d-flex faq flex-column col-md col-lg-2 col-sm-6 align-items-center align-self-center justify-content-center  order-lg-3 order-sm-3 order-3">
            <button class="btn btn-faq bold-text font-size-32" @click="faqOpen = !faqOpen">
              FAQ
            </button>
          </div>
        </div>
      </div>

      <div class="containter d-flex flex-column justify-content-center align-items-center ">
        <div class="btn-block d-flex flex-column">
         
            <div class="d-flex justify-content-center align-items-center">
              <button class="big-btn mt-3 col-12 align-items-center " 
              :class="{btnActive: btnActive && $store.state.scriptRunning,btnDisabled: !$store.state.scriptRunning,}" @click="btnClicked">
                <p class="bold-text font-size-22 text-white text-center btnDisables">
                  {{
                    btnActive && $store.state.scriptRunning
                      ? "Running!"
                      : "Make previews!"
                  }}
                </p>      
              </button>
              <div class="popUp" v-if="showPopUp">
                  Copy path from PC which looks like 'D/: ....'
                </div>
              </div> 
 

          <div v-if="btnActive">
            <div class="d-flex col-12 justify-content-center align-items-center">
              <button class="big-btn mt-3" @click="showProgress = !showProgress">
                <p class="bold-text font-size-22 font-color-dark text-center">
                  <span v-if="showProgress" class="text-white">
                    Show Progress
                  </span>
                  <span v-else class="text-white">
                    Show less
                  </span>
                </p>
              </button>
            </div>

            <div v-if="!showProgress" class="preview-window mt-5">
              <div v-if="$store.state.scriptRunning">
                <progressBar class="my-4 d-flex justify-content-center align-items-center">
                </progressBar>
              </div>
              <h2 v-if="!$store.state.scriptRunning"
                class="justify-content-center align-items-center text-center my-4 bold-text font-size-24 font-color-pink text-uppercase">
                Finish!
              </h2>
              <div class="container w-100">
                <div class="row justify-content-center align-items-center">
                  <div class="card col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-center mt-4 mx-3"
                    v-for="model in $store.state.modelsList" :key="model.name">
                    <img class="model-image my-3" v-if="model.image" :src="model.image" />
                    <p class="font-size-14 font-color-dark medium-text text-center">
                      {{ model.name }}
                    </p>
                    <p class="font-size-14 font-color-pink text-center medium-text">
                      {{ model.title }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.popUp {
  background-color: #7e7e7ec7;
  max-width: 200px;
  max-height: 100px;
  position: absolute;  
  margin-top: 160px;  
  border-radius: 10px;
  padding: 6px;
  animation-name: fadeOut;
  animation-duration: 5s;
  animation-fill-mode: forwards;
  z-index: 2;
}

.modal {
  position: absolute;
  display: flex;
  right: 0;
  left: auto;
  max-width: 450px;
}

 

@keyframes slideIn {
  from {
    transform: translateX(-20%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.btn-faq {
  width: 80px;
  height: 80px;
  background-color: white;
}


.btn-faq:hover,
btn-faq:active {
  background-color: #c97191;
}


input {
  text-align: center;
}

.preview-window {
  background-color: #f1f1f1;
  margin-top: 10px;
  padding-top: 10px;
  margin-bottom: 40px;
  padding-bottom: 60px;
  border-radius: 25px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
}

containter {
  padding: 0px 0px 0px 0px;
}

p {
  margin: 0px !important;
  margin-bottom: 0px !important;
}

.model-image {
  width: 300px;
  height: 300px;
}

.card {
  width: 360px;
  height: 420px;
}

.header {
  background-color: #f1f1f1;
  height: 70px;
  border-bottom: #b3b3b3 2px solid;
  border-top: #b3b3b3 2px solid;
  box-shadow: 0px 4px 7px 0px rgba(145, 145, 145, 0.25);
}

.menu {
  padding: 30px 0px 30px 0px;
}

.btn:disabled {
  background-color: #ffffffda;
  border: 1mm solid #484848;
}

.input-form {
  width: 430px;
  height: 50px;
  background-color: #f0eef0;
  border-radius: 20px;
  border-style: none;
  outline: none;
}

.btn:hover p {
  color: #ffffff;
}

.big-btn {
  outline: none;
  border: none;
  width: 210px !important;
  height: 75px !important;
  border-radius: 20px;
  background-color: #bcbcbc;
}

.btnActive {
  background-color: #c97191;
  background-size: 200% 100%;
  background-image: linear-gradient(to right,
      #de93af 0%,
      #a97ec2 25%,
      #de93af 50%,
      #a97ec2 75%,
      #de93af 100%);
  transition: background-position 1s linear;
  animation: gradientAnimation 6s linear infinite;
}

.btnDisabled {
  background-color: #ffffffda;
  color: #484848 !important;
  background-color: #c8c8c8 !important;
  position: relative;
  transition: all 0.02s ease;
}

.btnDisabled:hover {
  background-color: #ffffffda;
  color: #1c1c1c !important;
  background-color: #c97191 !important;
}

.btnDisabled:active {
  background-color: #a0a0a0 !important;
  animation: error-blink 0.24s linear;
}

@keyframes gradientAnimation {
  0% {
    background-position: 100% 0%;
  }

  100% {
    background-position: -100% 0%;
  }
}

@keyframes error-blink {

  0%,
  20%,
  40%,
  60%,
  80% {
    transform: translateX(-5px);
  }

  0%,
  10%,
  30%,
  50%,
  70% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes btnDisabled1 {
  0% {
    left: 0;
  }

  50% {
    left: 194px;
  }

  100% {
    left: 0;
  }
}



@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    display: none;
  }
}
</style>
