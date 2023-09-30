<script>
//import progressWindow from "@/components/progressWindow.vue";
import progressBar from "@/components/progressBar";
import checkBox from "@/components/checkBox";

export default {
  data() {
    return {
      showProgress: false,
      modelPath: "",
      imagePath: "",
      preview: true,
      showMore: false,
      state2:true,
      smallPreview: false
    };
  },   
  created() {
  this.$store.dispatch('ioConnect');
},
  components: {
    // progressWindow,
    progressBar,
    checkBox,
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
        smallPreview: this.smallPreview
      });
    },
  },
};
</script>

<template>

  <div class="d-flex flex-column w-100 align-items-center">
    <div
      class="d-flex font-size-40 bold-text text-center justify-content-center align-items-center preview w-100"
    >
      Preview maker
    </div>
    <div
      class="d-flex text-center align-items-center flex-column main-form h-auto p-3 my-5"
    >
      <div class="d-flex flex-column align-items-center">
        <div class="d-flex align-items-center flex-column input-block">
          <input
            type="text"
            v-model="modelPath"
            class="input-form my-4"
            @input="saveDataModel"
            placeholder="Path for load models C:/AppData/User/"
          />
          <input
            type="text"
            v-model="imagePath"
            class="input-form"
            @input="saveDataImage"
            placeholder="Path for save image C:/AppData/User/"
          />
        </div> 


       



        <div class="d-flex flex-column my-4">
          <checkBox
            v-model="smallPreview" />
            <p>smallPreview</p>
        </div>

        <div>
          <button
            class="btn big-btn"
            :disabled="$store.state.scriptRunning"
            @click="theOneButtonClicked">
            <p class="bold-text font-size-32 font-color-dark text-center align-items-start">
              <span v-if="$store.state.scriptRunning">Running!</span>
              <span v-else>Run Script</span>
            </p>
          </button>
          <button
            class="btn big-btn"
            @click="showProgress = !showProgress">
            <p class="bold-text font-size-32 font-color-dark text-center align-items-start">
              <span v-if="showProgress">Show less</span>
              <span v-else>Show Progress</span>
            </p>
          </button>
        </div>

        <div v-if="showProgress">
          <div v-if="$store.state.scriptRunning">
            <progressBar class="my-4">  </progressBar>
          </div>    
          <div>            
            <div class="my-4 uu">
              <div v-for="model in $store.state.modelsList" :key="model.name">
                {{ model.name }}
                <input type="checkbox" readonly :checked="model.ready" />
                <p>{{ model.title }}</p>
                <img v-if="model.image" :src="model.image" />
              </div>
                <!-- <progressWindow>  </progressWindow>   -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<style>
.bb {
  background-color: #909f4e;
  margin-top: 40px;
  margin-bottom: 100px;
}
.uu {
  background-color: #9f4e4e;
  height: 200px;
}
.pp { 
  margin-top: -83px;
} 
.big-btn {
  outline: none;
  border: none;
  width: 292px !important;
  height: 84px !important;
  border-radius: 30px;
  background-color: #f0eef0;
  padding-top: 13px;
}
.preview {
  background-color: #fafafa;
  height: 100px;
}
.input-block {
  align-items: end !important;
}
.progress-window {
  background-color: rgb(138, 90, 31);
}
.input-form {
  width: 600px;
  height: 50px;
  background-color: #f0eef0;
  border-radius: 25px;
  border-style: none;
  outline: none;
}
.main-form {
  width: 650px;
  height: auto;
  border-radius: 15px;
  border: none;
  background-color: #fafafa;
}

.btn:hover {
  background-color: #9f4e4e;
  color: #e6caca;
}
.btn:hover p {
  color: #ffffff; /* Change text color to white on hover */
}
</style>
