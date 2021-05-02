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

      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const h3 = document.createElement("h3");
      h3.textContent = `${playlist.name}`;
      const h4 = document.createElement("h4");
      h4.textContent = `${playlist.owner.display_name}`;
      const p = document.createElement("p");
      p.setAttribute("class", "card-description");
      if (playlist.description.length > 300) {
        playlist.description = playlist.description.substring(0, 300);
        p.textContent = `${playlist.description} ... `;
      }
      else {
        p.textContent = `${playlist.description}`;
      }
      const img = document.createElement("img");
      img.src = playlist.images[0].url;
      container.appendChild(card);
      card.appendChild(h3);
      card.appendChild(h4);
      if (descriptionExists) {
        card.appendChild(p);
      }
      card.appendChild(img);
      card.addEventListener("click", () => {
          const a = document.createElement("a");
          a.href = "generator_mock.html";
          a.click();
          document.body.removeChild(a);
      })
    }
  })
  .catch(console.error);