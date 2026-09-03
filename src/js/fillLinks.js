/**
 * GDGoC Tree - Dynamic Renderer
 * Reads data.json and renders items sequentially from top to bottom.
 * Supports: 'button', 'img', 'divider', and 'text'.
 */

fetch("./src/json/data.json")
  .then((response) => response.json())
  .then((data) => {
    // 1. Update Title & Description from meta if available
    if (data.meta) {
      if (data.meta.title) {
        const titleEl = document.querySelector("#title");
        if (titleEl) titleEl.textContent = data.meta.title;
      }
      if (data.meta.description) {
        const descEl = document.querySelector("#description");
        if (descEl) descEl.textContent = data.meta.description;
      }
    }

    const container = document.querySelector(".links");
    if (!container) return;
    container.innerHTML = "";

    const items = Array.isArray(data.items) ? data.items : [];
    let visibleIndex = 0;

    items.forEach((item) => {
      // Skip inactive items
      if (item.active === false) return;

      let el = null;
      const type = item.type || "button";

      switch (type) {
        case "button": {
          const a = document.createElement("a");
          a.id = item.id || item.name || `btn-${visibleIndex}`;
          a.style.setProperty("--button-before-color", item.color || "#4285f4");
          a.href = item.link || "#";
          if (item.link && !item.link.startsWith("mailto:") && !item.link.startsWith("tel:")) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }

          if (item.icon) {
            const img = document.createElement("img");
            img.src = item.icon;
            img.alt = item.text || item.name || "icon";
            a.appendChild(img);
          }

          const span = document.createElement("span");
          span.textContent = item.text || "Link";
          a.appendChild(span);

          el = a;
          break;
        }

        case "img": {
          let wrap;
          if (item.link) {
            wrap = document.createElement("a");
            wrap.href = item.link;
            wrap.target = "_blank";
            wrap.rel = "noopener noreferrer";
          } else {
            wrap = document.createElement("div");
          }
          wrap.className = "tree-img-card";

          const img = document.createElement("img");
          img.src = item.src || item.image;
          img.alt = item.alt || item.caption || "banner";
          wrap.appendChild(img);

          if (item.caption) {
            const caption = document.createElement("div");
            caption.className = "tree-img-caption";
            caption.textContent = item.caption;
            wrap.appendChild(caption);
          }

          el = wrap;
          break;
        }

        case "divider": {
          const div = document.createElement("div");
          div.className = "tree-divider";
          if (item.color) {
            div.style.backgroundColor = item.color;
          }
          el = div;
          break;
        }

        case "text": {
          const textDiv = document.createElement("div");
          const isHeading = item.variant === "heading";
          textDiv.className = `tree-text ${isHeading ? "tree-heading" : "tree-paragraph"}`;
          textDiv.textContent = item.text || "";
          el = textDiv;
          break;
        }

        default:
          break;
      }

      if (el) {
        // Apply exact staggered fly-in animation in sequence
        el.style.animation = "fadeRight 0.6s ease forwards";
        el.style.animationDelay = `${1 + visibleIndex * 0.12}s`;
        visibleIndex++;

        container.appendChild(el);
      }
    });
  })
  .catch((err) => console.error("Failed to load tree data:", err));
