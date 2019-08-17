/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const $ = require('jquery')
const remote = require('electron').remote
$(document).ready(function () {
  loadScreen('../calendar/calendar.html')
})

function closeApp () {
  remote.getCurrentWindow().close()
}

function minimizeApp () {
  remote.getCurrentWindow().minimize()
}

function loadScreen (fileName) {
  $('#screen').empty()
  $('#screen').load(fileName, function () {
    switch (fileName) {
      case '../calendar/calendar.html':
        createMonth()
        break
    }
  })
}
function openNav () {
  document.getElementById('mySidebar').style.width = '250px'
  document.getElementById('main').style.marginLeft = '250px'
}

function closeNav () {
  document.getElementById('mySidebar').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
}
