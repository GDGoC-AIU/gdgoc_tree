/**
 * GDGoC Tree - Dynamic Renderer
 * Reads data.json and renders items sequentially from top to bottom.
 * Supports: 'button', 'img', 'divider', and 'text'.
 * Supports theme-filtering ("theme": "pixel" | "classic") and theme-specific assets.
 */

let cachedData = null;
let isInitialRender = true;

function getCurrentTheme() {
  return (
    document.documentElement.getAttribute("data-theme") ||
    document.body?.getAttribute("data-theme") ||
    "classic"
  ).toLowerCase();
}

function resolveAsset(val, theme) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[theme] || val.classic || val.default || "";
  }
  return "";
}

function isItemVisibleInTheme(item, theme) {
  // If no theme is specified, it's visible in all themes
  if (!item.theme || item.theme === "all") return true;

  if (Array.isArray(item.theme)) {
    return item.theme.map((t) => t.toLowerCase()).includes(theme);
  }

  if (typeof item.theme === "string") {
    return item.theme.toLowerCase() === theme;
  }

  return true;
}

export function renderTree(data) {
  if (!data) return;
  cachedData = data;

  const currentTheme = getCurrentTheme();

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

    // Skip items not intended for current theme
    if (!isItemVisibleInTheme(item, currentTheme)) return;

    let el = null;
    const type = item.type || "button";

    switch (type) {
      case "button": {
        const a = document.createElement("a");
        a.id = item.id || item.name || `btn-${visibleIndex}`;
        a.style.setProperty("--button-before-color", item.color || "#4285f4");
        a.href = item.link || "#";
        if (
          item.link &&
          !item.link.startsWith("mailto:") &&
          !item.link.startsWith("tel:")
        ) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        const iconSrc =
          (currentTheme === "pixel" && item.pixelIcon) ||
          resolveAsset(item.icon, currentTheme);

        if (iconSrc) {
          const img = document.createElement("img");
          img.src = iconSrc;
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

        const imgSrc =
          (currentTheme === "pixel" && item.pixelSrc) ||
          resolveAsset(item.src || item.image, currentTheme);

        const img = document.createElement("img");
        img.src = imgSrc;
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
      if (isInitialRender) {
        // Apply exact staggered fly-in animation in sequence on first load
        el.style.animation = "fadeRight 0.6s ease forwards";
        el.style.animationDelay = `${1 + visibleIndex * 0.12}s`;
      } else {
        // Quick smooth transition when changing themes
        el.style.animation = "fadeRight 0.25s ease forwards";
        el.style.animationDelay = `${visibleIndex * 0.04}s`;
      }

      el.addEventListener("animationend", () => {
        el.style.animation = "none";
        el.style.opacity = "1";
      });

      visibleIndex++;

      container.appendChild(el);
    }
  });

  isInitialRender = false;
}

// Initial load
fetch("./src/json/data.json")
  .then((response) => response.json())
  .then((data) => {
    renderTree(data);
  })
  .catch((err) => console.error("Failed to load tree data:", err));

// Re-render when theme changes
window.addEventListener("themeChange", () => {
  if (cachedData) {
    renderTree(cachedData);
  }
});
