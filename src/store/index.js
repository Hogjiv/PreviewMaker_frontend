import { createStore } from "vuex";
// import axios from "axios";
import io from "socket.io-client";
//import {  ipcRenderer  } from 'electron'

const BASE_URL = "http://localhost:3000";

const store = createStore({
  state() {
    return {
      modelPath: "",
      imagePath: "",
      socket: null,
      modelsList: [],
      title: "",
      smallImage: null,
      bigImage: null,
      scriptRunning: false,
      // showResult: false,
    };
  },
  mutations: {
    clickedEvent(state) {
      console.log("received", state);
    },
   /* pathSaveModel(state, modelPath) {
      console.log("model path", state);
      state.pathModel = modelPath;
    },*/
    pathSaveImage(state, imagePath) {
      console.log("!!! image path", state);
      state.imagePath = imagePath;
    },
    setSocket(state, next) {
      state.socket = next;
    },
    setScriptRunning(state, next) {
      console.log("setScriptRunning mutation")
      state.scriptRunning = next;
    },
    // setShowResult(state, value) {
    //   state.showResult = value;
    // },
//    ioSend(state, bigPreview) {
//      console.log("bigPreview");
//      state.bigPreview = bigPreview;
//    },
    updateModelsList(state, data) {
      state.modelsList = data.map(el => {
        console.log('mutation setModel list')
        if (typeof el === 'object') return el
        return {
          name: el,
          ready: false,
          title: "",
          image: null
        }

      });
    },
    modelImage(state, data) {
      state.modelsList = state.modelsList.map(el => {
        if (el.name !== data.modelName) return el;
        el.title = data.title
        el.image = data.image
        return el
      })
    },
    modelReady(state, modelName) {
      state.modelsList = state.modelsList.map(el => {
        if (el.name !== modelName) return el
        el.ready = true
        return el
      })
    }
  },
  actions: {
//    pathSaveModel({ commit }) {
//      commit("pathSaveModel");
//    },
    async makePreview({ commit }, data) {
      window.API.startScript(data)
      //state.socket.emit("startScript", data);
      //commit("pathSaveModel", data.modelPath);
      commit("pathSaveImage", data.imagePath);
    },
    async modelsList(store) {
      try {
        const list = await window.API.modelsList();
        store.commit("updateModelsList", list);
        console.log("API model list call");
      } catch (error) {
        console.error("Error fetching modelsList:", error);
      }
    },
     async scriptRunning(store) {
      try {
        const isRunning = await window.API.scriptRunning();
        store.commit("setScriptRunning", isRunning);
      } catch (error) {
        console.error("Error in running script:", error);
      }
    },
    electronConnect(store) {
      const socket = io(BASE_URL);

      window.API.onScriptRunning( next => {
        console.log('onScriptRunning RUN!!!!!!!!!!', next)
      })


//      socket.on("connect", () => {
//        console.log("IO CONNECTED!");
//      });
/*
      socket.on('scriptRunning', isRunning => {
        console.log("@@@run")
        store.commit("setScriptRunning", isRunning)
      })*/

//      socket.on("modelsList", list => {
//        store.commit("setModeslList", list)
//        console.log(list, "modelsList")
//      })
      socket.on('modelImage', data => {
        store.commit('modelImage', data)
      })
      socket.on("modelSaved", modelName => {
        store.commit("modelReady", modelName)
        console.log("modelSaved", modelName)
      })
      store.commit("setSocket", socket);
    }, 
    async previewStatus() {},
  },
  getters: {
    getModelNames(state) {
      return state.modelNameData;
    }}
});

export default store;
