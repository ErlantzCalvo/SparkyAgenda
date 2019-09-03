const { app, BrowserWindow } = require('electron')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

function createWindow () {
  var winWidth = (db.has('window.width').value()) ? db.get('window.width').value() : 800
  var winHeight = (db.has('window.height').value()) ? db.get('window.height').value() : 600
  const window = new BrowserWindow({ width: winWidth, height: winHeight, title: 'SparkyAgenda', backgroundColor: '#E9EBED', resizable: true, webPreferences: { nodeIntegration: true } })
  window.loadFile('./src/view/container/container.html')
  window.on('ready-to-show', () => window.show())

  window.on('resize', () => {
    db.set('window.width', window.getBounds().width).write()
    db.set('window.height', window.getBounds().height).write()
  })
}

function checkDB () {
  db.defaults({ calendar: { events: [], birthdays: [] }, schedule: {}, window: {} }).write()
}

app.on('ready', () => {
  checkDB()
  createWindow()
})
