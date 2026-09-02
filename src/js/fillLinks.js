fetch("./src/json/links.json")
  .then((response) => response.json())
  .then((links) => {
    const container = document.querySelector(".links");

    links.forEach((link, index) => {
      const a = document.createElement("a");

      a.id = link.name;
      a.className = link.color;
      a.href = link.link;

      const img = document.createElement("img");
      img.src = link.icon;
      img.alt = link.name;

      const span = document.createElement("span");
      span.textContent = link.text;

      a.appendChild(img);
      a.appendChild(span);

      a.style.animation = "fadeRight 0.6s ease forwards";
      a.style.animationDelay = `${1 + index * 0.15}s`;

      container.appendChild(a);
    });
  });
