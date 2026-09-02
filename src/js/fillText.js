fetch("./src/json/titles.json")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#title").textContent = data.title;
    document.querySelector("#description").textContent = data.description;
  });
