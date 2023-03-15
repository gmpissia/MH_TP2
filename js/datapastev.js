let events = [];
let htmlEvents = "";
let pastEvents = [];
let currentDate = null;

async function getData() {
  await fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then(response => response.json())
    .then(json => {
      const data = json;
      console.log(data);
      events = data.events;
      currentDate = new Date(data.currentDate);
      console.log(events);

      events.forEach(event => {
        let eventDate = new Date(event.date);
        if (eventDate < currentDate) {
          pastEvents.push(event)
          htmlEvents += `
            <div class="card" style="width: 18rem;">
              <img src="${event.image}" class="card-img-top" alt="${event.name}">
              <h5 class="card-title">${event.name}</h5>
              <p class="card-text">${event.description}</p>
              <div class="row d-flex justify-content-center">
                <p class="col-sm-6 col-lg-6">Price: ${event.price}$</p>
                <a href="./Details.html?id=${event._id}" class="btn btn-primary col-sm-6 col-lg-6">Details...</a>
              </div>
            </div>
          `;
        }
      });

      document.getElementById('cardContainer').innerHTML = htmlEvents;
    });
}

getData();

  const input = document.getElementById('form1');
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  let checkedValues = [];
  let dataInput = "";
  
  // Event listener for text input
  input.addEventListener("input", (event) => {
    dataInput = event.target.value.trim().toLowerCase();
    applyFilters();
  });
  
  // Event listener for checkboxes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        checkedValues.push(checkbox.value);
      } else {
        const index = checkedValues.indexOf(checkbox.value);
        if (index !== -1) {
          checkedValues.splice(index, 1);
        }
      }
      applyFilters();
    });
  });
  
  function applyFilters() {
    const eventsFiltered = pastEvents.filter(event => {
      // Filter by text input
      const nameMatch = event.name.toLowerCase().includes(dataInput);
      const descriptionMatch = event.description.toLowerCase().includes(dataInput);
  
      // Filter by checkboxes
      const categoryMatch = checkedValues.includes(event.category);
  
      return (nameMatch || descriptionMatch) && (categoryMatch || checkedValues.length === 0);
    });
  
    let html = "";
    if (eventsFiltered.length > 0) {
      for (let event of eventsFiltered) {
        html += `
          <div class="card" style="width: 18rem;">
            <img src="${event.image}" class="card-img-top" alt="${event.name}">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">${event.description}</p>
            <div class="row d-flex justify-content-center">
              <p class="col-sm-6 col-lg-6">Price: ${event.price}$</p>
              <a href="./Details.html?id=${event._id}" class="btn btn-primary col-sm-6 col-lg-6">Details...</a>
            </div>
          </div>
        `;
      }
    } else {
      html = "No events found.";
    }
    document.getElementById('cardContainer').innerHTML = html;}

