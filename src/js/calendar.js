
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
