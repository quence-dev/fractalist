//generates HTML for playlist webpage
const app = document.getElementById("root");
const container = document.createElement("div");
container.setAttribute("class", "container");
app.appendChild(container);

const loadBtn = document.createElement("button");
loadBtn.setAttribute("class", "myButton");
loadBtn.textContent = "Load More";
loadBtn.addEventListener("click", load);
document.body.appendChild(loadBtn);

//here is list of playlists
const params = new URLSearchParams(window.location.search);
var code = (params.get("code"));
let endpoint = 'https://api.spotify.com/v1/me/playlists'; /* initial endpoint */

function load() {
  fetch(endpoint, {
    headers:
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + code
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (next !== null) {
        endpoint = data.next;
      } else {
        document.body.removeChild(loadBtn);
      }

      for (const playlist of data.items) {
        //create HTML elements
        const card = document.createElement("div");
        const grid = document.createElement("div");
        const h3 = document.createElement("h3");
        const h4 = document.createElement("h4");
        const img = document.createElement("img");

        //set classes
        card.setAttribute("class", "card");
        grid.setAttribute("class", "card-grid");
        h3.setAttribute("class", "card-title");
        h4.setAttribute("class", "card-owner");
        img.setAttribute("class", "card-img");

        //set text and images
        h3.textContent = `${playlist.name}`;
        h4.textContent = `by ${playlist.owner.display_name}`;
        img.src = playlist.images[0].url;

        //append elements to page
        container.appendChild(card);
        card.appendChild(img);
        card.appendChild(grid);
        grid.appendChild(h3);
        grid.appendChild(h4);

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
}

  // fetch('resources/mock.json')
  // .then(response => response.json())
  // .then(data => {
  //   console.log(data);
  //   for (const playlist of data.items) {
  //     //create HTML elements
  //     const card = document.createElement("div");
  //     const grid = document.createElement("div");
  //     const h3 = document.createElement("h3");
  //     const h4 = document.createElement("h4");
  //     const img = document.createElement("img");

  //     //set classes
  //     card.setAttribute("class", "card");
  //     grid.setAttribute("class","card-grid");
  //     h3.setAttribute("class", "card-title");
  //     h4.setAttribute("class", "card-owner");
  //     img.setAttribute("class", "card-img");

  //     //set text and images
  //     h3.textContent = `${playlist.name}`;
  //     h4.textContent = `by ${playlist.owner.display_name}`;
  //     img.src = playlist.images[0].url;

  //     //append elements to page
  //     container.appendChild(card);
  //     card.appendChild(img);
  //     card.appendChild(grid);
  //     grid.appendChild(h3);
  //     grid.appendChild(h4);

  //     //event for clicking card
  //     card.addEventListener("click", () => {
  //       const a = document.createElement("a");
  //       a.href = "generator_mock.html";
  //       a.click();
  //       document.body.removeChild(a);
  //     })
  //   }
  // })
  // .catch(console.error);