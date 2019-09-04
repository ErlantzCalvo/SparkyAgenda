/* eslint-disable no-unused-vars */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')

const adapter = new FileSync('db.json')
const db = low(adapter)

var date = new Date()
date.setDate(1)

document.onkeydown = function (evt) {
  evt = evt || window.event
  switch (evt.keyCode) {
    case 37:
      previousMonth()
      break
    case 39:
      nextMonth()
      break
  }
}

// Converts day ids to the relevant string
function dayOfWeekAsString (dayIndex) {
  return ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'][dayIndex]
}
// Converts month ids to the relevant string
function monthsAsString (monthIndex) {
  return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][monthIndex]
}

// Creates a day element
function createCalendarDay (num, day, mon, year) {
  var currentCalendar = document.getElementById('calendar')

  var newDay = document.createElement('div')
  var dayNumber = document.createElement('p')
  dayNumber.className = 'noselect'
  var dayElement = document.createElement('p')
  dayElement.className = 'noselect'

  dayNumber.innerHTML = num
  dayElement.innerHTML = day

  if (day === 'Sab' || day === 'Dom') newDay.className = 'calendar-day weekend'
  else newDay.className = 'calendar-day '

  newDay.setAttribute('data-modal-trigger', 'trigger-1')

  // Set ID of element as date formatted "8-January" etc
  newDay.id = num + '-' + mon + '-' + year

  newDay.appendChild(dayNumber)
  newDay.appendChild(dayElement)
  currentCalendar.appendChild(newDay)
}

// Clears all days from the calendar
function clearCalendar () {
  var currentCalendar = document.getElementById('calendar')

  currentCalendar.innerHTML = ''
}

// Clears the calendar and shows the next month
function nextMonth () {
  clearCalendar()

  date.setMonth(date.getMonth() + 1)

  createMonth(date.getMonth())
}

// Clears the calendar and shows the previous month
function previousMonth () {
  clearCalendar()
  date.setMonth(date.getMonth() - 1)
  createMonth(date.getMonth())
}

// Creates and populates all of the days to make up the month
function createMonth () {
  var dateObject = new Date()
  dateObject.setDate(date.getDate())
  dateObject.setMonth(date.getMonth())
  dateObject.setYear(date.getFullYear())

  createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()), monthsAsString(dateObject.getMonth()), dateObject.getFullYear())

  dateObject.setDate(dateObject.getDate() + 1)

  while (dateObject.getDate() !== 1) {
    createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()), monthsAsString(dateObject.getMonth()), dateObject.getFullYear())
    dateObject.setDate(dateObject.getDate() + 1)
  }

  // Set the text to the correct month
  var currentMonthText = document.getElementById('current-month')
  currentMonthText.innerHTML = monthsAsString(date.getMonth()) + ' ' + date.getFullYear()
  getCurrentDay()
  const buttons = document.querySelectorAll(`div[data-modal-trigger]`)

  for (const button of buttons) {
    modalEvent(button)
  }
}

function getCurrentDay () {
  // Create a new date that will set as default time
  var todaysDate = new Date()
  var currentMonth = todaysDate.getMonth()
  var currentYear = todaysDate.getFullYear()
  if (currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
    var today = todaysDate.getDate()
    var thisMonth = monthsAsString(currentMonth)
    // Find element with the ID for today
    var currentDay = document.getElementById(today + '-' + thisMonth + '-' + currentYear)
    var dayOfWeek = dayOfWeekAsString(todaysDate.getDay())
    if (dayOfWeek === 'Sab' || dayOfWeek === 'Dom') currentDay.className = 'calendar-day weekend today'
    else currentDay.className = 'calendar-day today'
  }
}

function modalEvent (button) {
  button.addEventListener('click', () => {
    const modal = document.querySelector(`[data-modal=trigger-1]`)
    document.getElementById('modalTitle').innerHTML = button.id.replace(/-/g, ' ')
    modal.id = button.id
    modal.classList.toggle('open')
    loadDayTasks(button.id)
  })
}

function addTask () {
  const content = document.getElementById('modalContent')
  const tr = document.createElement('TR')
  const tdTaskText = document.createElement('TD')
  const textInput = document.createElement('INPUT')
  const tdTaskType = document.createElement('TD')
  const taskType = document.createElement('SELECT')
  const eventOption = document.createElement('OPTION')
  const birthdateOption = document.createElement('OPTION')
  textInput.setAttribute('type', 'text')
  tdTaskText.appendChild(textInput)
  eventOption.setAttribute('value', 'event')
  eventOption.innerHTML = 'Evento'
  birthdateOption.setAttribute('value', 'birthdate')
  birthdateOption.innerHTML = 'Cumpleaños'
  taskType.appendChild(eventOption)
  taskType.appendChild(birthdateOption)
  tdTaskType.appendChild(taskType)
  tr.appendChild(tdTaskText)
  tr.appendChild(tdTaskType)
  content.appendChild(tr)
}

function saveDayChanges (modal) {
  var newTasksText = document.getElementById('modalContent').getElementsByTagName('input')
  var newTasksType = document.getElementById('modalContent').getElementsByTagName('select')

  for (let i = 0; i < newTasksText.length; i++) {
    if (!newTasksText[i].value || newTasksText[i].value.length === 0) continue
    if (newTasksType[i].selectedIndex === 0) {
      db.get('calendar').get('events').push({ id: shortid.generate(), date: modal.parentNode.parentNode.parentNode.id, task: newTasksText[i].value }).write()
    } else if (newTasksType[i].selectedIndex === 1) {
      db.get('calendar').get('birthdays').push({ id: shortid.generate(), date: modal.parentNode.parentNode.parentNode.id, task: newTasksText[i].value }).write()
    }
  }
  cancelModal() // Clean the modal before closing it.
}

function cancelModal () {
  const modal = document.querySelector(`[data-modal=trigger-1]`)
  const table = document.getElementById('modalContent')
  table.innerHTML = ''
  modal.classList.remove('open')
}
function loadDayTasks (taskDate) {
  const dayEvents = db.get('calendar.events').filter({ date: taskDate }).value()
  const dayBirths = db.get('calendar.birthdays').filter({ date: taskDate }).value()
  if (dayEvents.length === 0 && dayBirths.length === 0) {
    const tr = document.createElement('TR')
    const thEmpty = document.createElement('TH')
    thEmpty.innerHTML = 'No hay ningún evento para este día.'
    thEmpty.setAttribute('rowspan', '2')
    tr.appendChild(thEmpty)
    document.getElementById('modalContent').appendChild(tr)
    return
  }
  for (const ev of dayEvents) {
    const tr = document.createElement('TR')
    const tdText = document.createElement('TD')
    const tdDelete = document.createElement('TD')
    const deleteButton = document.createElement('i')
    deleteButton.classList.add('fa')
    deleteButton.classList.add('fa-trash')
    deleteButton.addEventListener('click', () => { deleteEvent(ev) })
    tdText.innerHTML = ev.task
    tdDelete.appendChild(deleteButton)
    tr.appendChild(tdText)
    tr.appendChild(tdDelete)
    document.getElementById('modalContent').appendChild(tr)
  }
  for (const b of dayBirths) {
    const tr = document.createElement('TR')
    const tdText = document.createElement('TD')
    const tdDelete = document.createElement('TD')
    const cakeIcon = document.createElement('i')
    const deleteButton = document.createElement('i')
    cakeIcon.classList.add('fa')
    cakeIcon.classList.add('fa-birthday-cake')
    cakeIcon.style.paddingLeft = '15px'
    deleteButton.classList.add('fa')
    deleteButton.classList.add('fa-trash')
    deleteButton.addEventListener('click', () => { deleteEvent(b) })
    tdText.innerHTML = b.task
    tdText.appendChild(cakeIcon)
    tdDelete.appendChild(deleteButton)
    tr.appendChild(tdText)
    tr.appendChild(tdDelete)
    tr.classList.add('birthday')
    document.getElementById('modalContent').appendChild(tr)
  }
}

function deleteEvent (ev) {

}
