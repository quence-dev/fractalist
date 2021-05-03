//generates HTML for playlist webpage

//here is list of playlists
const params = new URLSearchParams(window.location.search);
    var code = (params.get("code"));
    console.log(code);
    fetch('https://api.spotify.com/v1/me/playlists',{
    headers : 
    {'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + code
    }})
    .then((res) => res.json())
    .then((data) => {
      var playlists = data
      console.log(data)
    });

const app = document.getElementById("root");
const container = document.createElement("div");
container.setAttribute("class", "container");
app.appendChild(container);

fetch('resources/mock.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    for (const playlist of data.items) {
      // check whether playlist description is empty
      let descriptionExists = (playlist.description === "") ? false : true;
      
      //create HTML elements
      const card = document.createElement("div");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("h4");
      const p = document.createElement("p");
      const img = document.createElement("img");
      
      //set classes
      card.setAttribute("class", "card");
      h3.setAttribute("class", "card-title");
      h4.setAttribute("class", "card-owner");
      p.setAttribute("class", "card-description");

      //set text and images
      h3.textContent = `${playlist.name}`;
      h4.textContent = `${playlist.owner.display_name}`;
      if (playlist.description.length > 300) {
        playlist.description = playlist.description.substring(0, 300);
        p.textContent = `${playlist.description} ... `;
      }
      else {
        p.textContent = `${playlist.description}`;
      }
      img.src = playlist.images[0].url;

      //append elements to page
      container.appendChild(card);
      card.appendChild(img);
      card.appendChild(h3);
      card.appendChild(h4);
      if (descriptionExists) {
        card.appendChild(p);
      }

      //event for clicking card
      card.addEventListener("click", () => {
          const a = document.createElement("a");
          a.href = "generator_mock.html";
          a.click();
          document.body.removeChild(a);
      })
    }
  })
  .catch(console.error);