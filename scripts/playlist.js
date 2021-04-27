const app = document.getElementById("root");
const container = document.createElement("div");
container.setAttribute("class", "container");
app.appendChild(container);

fetch('resources/mock.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    for (const playlist of data.items) {
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const h3 = document.createElement("h3");
      h3.textContent = `${playlist.name} (${playlist.owner.display_name})`;
      const p = document.createElement("p");
      playlist.description = playlist.description.substring(0, 300);
      p.textContent = `${playlist.description} ... `;
      const img = document.createElement("img");
      img.src = playlist.images[0].url;
      container.appendChild(card);
      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(img);
      card.addEventListener("click", () => {
          const a = document.createElement("a");
          a.href = "mock_generator.html";
          a.click();
          document.body.removeChild(a);
      })
    }
  })
  .catch(console.error);