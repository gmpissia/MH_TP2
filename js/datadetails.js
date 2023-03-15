async function getData() {
  await fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then(response => response.json())
    .then(json => {
      const data = json;
      events = data.events;
      console.log(events);

      let queryString = location.search;
      let params = new URLSearchParams(queryString);
      let _id = params.get('id');
      let event = events.find(event => event._id == _id);

      if (event) {
        document.getElementById('detailEvent').innerHTML = `
          <div class="card" style="width: 18rem;">
            <img src="${event.image}" class="card-img-top" alt="${event.name}">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">${event.description}</p>
            <div class="row d-flex justify-content-center">
              <p>Price: ${event.price}$</p>
            </div>
          </div>
        `;
      } else {
        document.getElementById('detailEvent').innerHTML = "Event not found.";
      }
    });
}

getData();