import {createStore} from "vuex";

// import axios from "axios";
// import io from "socket.io-client";
//import {  ipcRenderer  } from 'electron'

// const BASE_URL = "http://localhost:3000";

const store = createStore({
    state() {
        return {
            modelPath: "",
            imagePath: "",
            // socket: null,
            modelsList: [],
            title: "",
            smallImage: null,
            bigImage: null,
            scriptRunning: false,
            // showResult: false,
        };
    },
    mutations: {
        /* clickedEvent(state) {
             console.log("received", state);
         },*/
        pathSaveModel(state, modelPath) {
            console.log("model path STORE", state);
            state.pathModel = modelPath;
        },
        /* pathSaveModel(state, modelPath) {
           console.log("model path", state);
           state.pathModel = modelPath;
         },*/
        pathSaveImage(state, imagePath) {
            console.log("ask image path from STORE", state);
            state.imagePath = imagePath;
        },
        setSocket(state, next) {
            state.socket = next;
        },
           setScriptRunning(state, next) {
            console.log("setScriptRunning mutation")
            state.scriptRunning = next;
        },
        setModeslList(state, data) {
            state.modelsList = data.map(el => {
                if (typeof el === 'object') return el
                return {
                    name: el,
                    ready: false,
                    title: "",
                    image: null
                }
            });
        },
        // setShowResult(state, value) {
        //   state.showResult = value;
        // },

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
            console.log("modelImage, 22222")
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
        async makePreview({commit}, data) {
            //state.socket.emit("startScript", data);
            window.API.startScript(data)
            console.log('makePreview from store/ELECTRON')

            //commit("pathSaveModel", data.modelPath);
            commit("pathSaveModel", data.modelPath);
            console.log('commmit Model store/ELECTRON')

            commit("pathSaveImage", data.imagePath);
            console.log('commmit Image store/ELECTRON')
        },

        /* async modelsList(store) {
             try {
                 const list = await window.API.modelsList();
                 store.commit("updateModelsList", list);
                 console.log("API model list call");
             } catch (error) {
                 console.error("Error fetching modelsList:", error);
             }
         },*/


        /*  async scriptRunning(store) {
              try {
                  const isRunning = await window.API.scriptRunning();
                  store.commit("setScriptRunning", isRunning);
              } catch (error) {
                  console.error("Error in running script:", error);
              }
          },*/

        electronConnect() {
            // const socket = io(BASE_URL);
            // socket.on('scriptRunning', isRunning => {
            //     store.commit("setScriptRunning", isRunning)
            //   })

           
            // window.API.onScriptRunning(next => {
            //     console.log('onScriptRunning from store/ELECTRON CONNECT', next)

            // })
            window.API.onScriptRunning(isRunning => {
                console.log('onScriptRunning STORE', isRunning)
                store.commit("setScriptRunning", isRunning)
            })
            window.API.onModelList(list => { 
                store.commit("setModeslList", list) 
            })
            window.API.onModelImage(data => { 
                store.commit('modelImage', data)
                console.log("onModelImage, 3333")
            })
            window.API.onSetlList(list => { 
                store.commit("setModeslList", list)
            })
              /*  ipcMain.on('modelImage', (event, data) => {
                    console.log('Received modelImage data:', data);
                    store.commit('modelImage', data)
                });*/

            /*
                
//      socket.on("modelsList", list => {
//        store.commit("setModeslList", list)
//        console.log(list, "modelsList")
//      })
            /*socket.on('modelImage', data => {
              store.commit('modelImage', data)
            })*/
            /*  socket.on("modelSaved", modelName => {
                store.commit("modelReady", modelName)
                console.log("modelSaved", modelName)
              })*/
            // store.commit("setSocket", socket);
        },
        async previewStatus() {
        },
    },
    getters: {
        getModelNames(state) {
            return state.modelNameData;
        }
    }
});

export default store;
