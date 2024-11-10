
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  saveStateDialog: (state) => ipcRenderer.invoke('saveStateDialog', state),
  loadStateDialog: () => ipcRenderer.invoke('loadStateDialog'),
  onMessage: (callback) => ipcRenderer.on('message', (event, message) => callback(message))
})
