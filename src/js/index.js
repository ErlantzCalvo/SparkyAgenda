const { app, BrowserWindow } = require('electron')
function createWindow () {
  const window = new BrowserWindow({ width: 800, height: 600, title: 'SparkyAgenda', backgroundColor: '#E9EBED', resizable: false, webPreferences: { nodeIntegration: true } })
  window.loadFile('./src/view/container/container.html')
  window.on('ready-to-show', () => {
    window.show()
  })
}

app.on('ready', () => {
  createWindow()
})
