fetch("/src/json/links.json")
  .then((response) => response.json())
  .then((links) => {
    links.forEach(({ name, link }) => {
      const element = document.getElementById(name);

      if (element) {
        element.href = link;
      }
    });
  })
  .catch((error) => {
    console.error("Failed to load links:", error);
  });
