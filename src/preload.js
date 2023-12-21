const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('API', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    
    test: (data) => {
        ipcRenderer.invoke('ping', data) 
        console.log("test function")
    },
    startScan: (data) => {
        ipcRenderer.invoke('start-scan', data)
        console.log("we trying")
    }
})