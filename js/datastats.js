let events = [];
let currentDate = null;
async function getData(){
  await fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then(response => response.json())
    .then(json => {
      const data = json;
      events = data.events;
      currentDate = new Date(data.currentDate);
    })
    .catch(error => console.error('Error:', error));
    return events;
}

getData();
let attendanceEvents=[];


async function getAttendanceEvents(){
   attendanceEvents = await getData()

  attendanceEvents.forEach(event => {
  let eventDate = new Date(event.date)
  if (eventDate < currentDate){
  event.attendancePercentage = (event.assistance / event.capacity) * 100;
 
}
  else{
      event.attendancePercentage = (event.estimate / event.capacity) * 100;
    
    }
  });
  
};
getAttendanceEvents();


let pastAttendanceEvents=[];
let upcomingAttendanceEvents=[];


async function getTimeEvents(){
  await getAttendanceEvents();
  console.log(attendanceEvents);
  attendanceEvents.forEach(event => {
  let eventDate = new Date(event.date)
  if (eventDate < currentDate)
    pastAttendanceEvents.push(event)
  else
    upcomingAttendanceEvents.push(event)
});

};
getTimeEvents();


async function getRowEvents() {
  await getAttendanceEvents();
  loadStatsEvents();
  await getTimeEvents();
  upcomingCategories= extractCategory(upcomingAttendanceEvents);
  pastCategories = extractCategory(pastAttendanceEvents);
  loadStatsUpcomingEvents();
  // loadStatsPastEvents();
}


// categories = extractCategory(events);

function extractCategory(events){
  let category = [];
  events.forEach(event => {
          if(!category.includes(event.category)) {
              category.push(event.category);
          }
      });
  return category;
}

function loadStatsEvents() {
  let container = document.getElementById("EventsStats");
  let tableBodyHTML = "";
    
  let masGrande = getBiggerAttendance(attendanceEvents);
  let masChico = getSmallerAttendance(attendanceEvents);
  let masGrandeCapacity = getBiggerCapacity(attendanceEvents);
  tableBodyHTML += `<tr>
      <td>${masGrande.attendancePercentage} (${masGrande.name})</td>
      <td>${masChico.attendancePercentage} (${masChico.name})</td>
      <td>${masGrandeCapacity.capacity} (${masGrandeCapacity.name})</td>
  </tr>`;
  
  container.innerHTML = tableBodyHTML;
}

function loadStatsUpcomingEvents() {
  let container = document.getElementById("UpcomingEventsStats");
  let tableBodyHTML = "";
  upcomingCategories.forEach(category => {
    let revenues = 0;
    let promPercentageAttendance= 0;
    upcomingAttendanceEvents.filter(event=>{
      if(event.category.includes(category))
      revenues += event.price*event.estimate
    })
    let cont=0;
    let acumPercentageAttendance=0;
    upcomingAttendanceEvents.filter(event=>{
      
      if(event.category.includes(category)){
        acumPercentageAttendance += event.attendancePercentage
        cont = cont+1;
    }
    })
    if(cont!=0)
    promPercentageAttendance= acumPercentageAttendance/cont;
    tableBodyHTML += `<tr>
    <td>${category}</td>
    <td>${revenues}</td>
    <td>${promPercentageAttendance}</td>
    </tr>`;

  })
  
  
  container.innerHTML = tableBodyHTML;
 
}

function loadStatsPastEvents(categories) {
  let container = document.getElementById("pastEventsStats");
  let tableBodyHTML = "";
    
  let masGrande = getBiggerAttendance(attendanceEvents);
  let masChico = getSmallerAttendance(attendanceEvents);
  let masGrandeCapacity = getBiggerCapacity(attendanceEvents);
  tableBodyHTML += `<tr>
      <td>${masGrande.attendancePercentage} (${masGrande.name})</td>
      <td>${masChico.attendancePercentage} (${masChico.name})</td>
      <td>${masGrandeCapacity.capacity} (${masGrandeCapacity.name})</td>
  </tr>`;
  
  container.innerHTML = tableBodyHTML;
}

function getEventsByCategories(category, events) {
  return events.filter(event => event.category.includes(category));
}

function getPromedioAttendance(eventsToWorkWith) {
  let sumaPercentageAttendance = 0;
  eventsToWorkWith.forEach(event => sumaPercentageAttendance += eventsToWorkWith.attendancePercentage);
  return Math.round(sumaPercentageAttendance / eventsToWorkWith.length);
}

function getBiggerAttendance(eventsToWorkWith) {
  return eventsToWorkWith.reduce((acumulador, valorActual) => {
      if (valorActual.attendancePercentage > acumulador.attendancePercentage) {
          return valorActual;
      } else {
          return acumulador;
      }
  });
}
function getBiggerCapacity(eventsToWorkWith) {
  return eventsToWorkWith.reduce((acumulador, valorActual) => {
      if (valorActual.capacity > acumulador.capacity) {
          return valorActual;
      } else {
          return acumulador;
      }
  });
}

function getSmallerAttendance(eventsToWorkWith) {
  return eventsToWorkWith.reduce((acumulador, valorActual) => {
      if (valorActual.attendancePercentage < acumulador.attendancePercentage) {
          return valorActual;
      } else {
          return acumulador;
      }
  });
}
  
getRowEvents();