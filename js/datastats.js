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

let highestAtt={};
let lowestAtt={};
let highestCap={};
let sortedAttendanceEvents=[];
let sortedCapacityEvents=[];
async function getRows(){
  await getTimeEvents();
  sortedAttendanceEvents = attendanceEvents.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  sortedCapacityEvents = attendanceEvents.sort((a,b) => {
    return b.capacity - a.capacity;
  });
  highestAtt = sortedAttendanceEvents[0];
  lowestAtt = sortedAttendanceEvents[(sortedAttendanceEvents.length-1)];
  highestCap = sortedCapacityEvents[0];
  console.log(highestAtt);
  console.log(lowestAtt);
  console.log(highestCap);
  console.log(sortedAttendanceEvents);
}
getRows();