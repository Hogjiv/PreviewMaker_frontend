const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('API', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    
    test: (data) => {
        ipcRenderer.invoke('ping', data)
    },
    startScript: (data) => {
        console.log('Handle scriptRunning invoked_1')
        ipcRenderer.invoke('startScriptEvent', data)
        //console.log("Image and Model user paths from preload.js", data)
    },
    modelsList: (data) => {
        console.log('Handle scriptRunning invoked_2')
        ipcRenderer.invoke('modelsList', data)
    },
    scriptRunning: (data) => {
        console.log('Handle scriptRunning invoked_3')
        ipcRenderer.invoke('scriptRunningEvent', data)
    },

    onScriptRunning: (callback) => ipcRenderer.on('scriptRunningEvent', (_event, value) => callback(value)),
    onModelList: (callback) => ipcRenderer.on('modelsListEvent', (_event, value) => callback(value))
})