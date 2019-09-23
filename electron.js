const path = require('path')
const { app, BrowserWindow } = require('electron')

let win

let url
if (process.env.NODE_ENV === 'DEV') {
  url = 'http://localhost:8080/'
} else {
  url = `file://${path.join(__dirname, '/dist-electron/index.html')}`
}

function createWindow () {
  win = new BrowserWindow({ width: 1000, height: 800 })
  
  win.loadURL(url)
  
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
