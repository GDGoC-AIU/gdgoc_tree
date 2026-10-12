/**
 * GDGoC Tree - Link Filter
 * Client-side instant search/filter for the links container.
 * Initialises the search UI once; survives theme-switch re-renders
 * via MutationObserver (childList only).
 */

let rafPending = false;
let currentQuery = "";

function applyFilter(query) {
  const linksEl = document.querySelector(".links");
  if (!linksEl) return;

  const trimmed = query.trim().toLowerCase();
  const hasQuery = trimmed.length > 0;
  const empty = document.getElementById("link-filter-empty");
  let anyVisible = false;

  Array.from(linksEl.children).forEach((el) => {
    if (el.classList.contains("button-wrapper")) {
      if (!hasQuery) {
        el.removeAttribute("hidden");
        anyVisible = true;
      } else {
        const span = el.querySelector("span");
        const text = span ? span.textContent.trim().toLowerCase() : "";
        const matches = text.includes(trimmed);
        if (matches) {
          el.removeAttribute("hidden");
          anyVisible = true;
        } else {
          el.setAttribute("hidden", "");
        }
      }
    } else {
      // img cards, dividers, text blocks: hide while any query is active
      if (hasQuery) {
        el.setAttribute("hidden", "");
      } else {
        el.removeAttribute("hidden");
      }
    }
  });

  if (empty) {
    empty.hidden = !(hasQuery && !anyVisible);
  }
}

function scheduleFilter() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    applyFilter(currentQuery);
  });
}

function buildUI(linksEl) {
  if (document.getElementById("link-search")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "link-filter-wrapper";

  const label = document.createElement("label");
  label.htmlFor = "link-search";
  label.className = "link-filter-label";
  label.textContent = "Search links";

  const row = document.createElement("div");
  row.className = "link-filter-row";

  const input = document.createElement("input");
  input.type = "search";
  input.id = "link-search";
  input.className = "link-filter-input";
  input.placeholder = "Search\u2026";
  input.autocomplete = "off";

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.id = "link-filter-clear";
  clearBtn.className = "link-filter-clear";
  clearBtn.hidden = true;
  clearBtn.setAttribute("aria-label", "Clear search");
  clearBtn.textContent = "\u2715";

  const empty = document.createElement("p");
  empty.id = "link-filter-empty";
  empty.className = "link-filter-empty";
  empty.setAttribute("aria-live", "polite");
  empty.hidden = true;
  empty.textContent = "No links found.";

  row.appendChild(input);
  row.appendChild(clearBtn);
  wrapper.appendChild(label);
  wrapper.appendChild(row);
  wrapper.appendChild(empty);

  linksEl.parentNode.insertBefore(wrapper, linksEl);

  input.addEventListener("input", () => {
    currentQuery = input.value;
    clearBtn.hidden = currentQuery.length === 0;
    scheduleFilter();
  });

  clearBtn.addEventListener("click", () => {
    currentQuery = "";
    input.value = "";
    input.focus();
    clearBtn.hidden = true;
    scheduleFilter();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      currentQuery = "";
      input.value = "";
      input.focus();
      clearBtn.hidden = true;
      scheduleFilter();
    }
  });
}

function startObserver(linksEl) {
  const observer = new MutationObserver((mutations) => {
    let hasAdditions = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        hasAdditions = true;
        break;
      }
    }
    if (!hasAdditions) return;
    buildUI(linksEl);
    scheduleFilter();
  });

  observer.observe(linksEl, { childList: true });
}

function init() {
  const linksEl = document.querySelector(".links");
  if (!linksEl) return;

  startObserver(linksEl);

  // Handle the case where renderTree already ran before this module executed
  if (linksEl.children.length > 0) {
    buildUI(linksEl);
    applyFilter(currentQuery);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
