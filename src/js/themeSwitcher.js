/**
 * ============================================================================
 * THEME CONFIGURATION
 * ============================================================================
 * Change this variable to choose the default theme for first-time visitors:
 *   - "classic" : Original clean Google look
 *   - "pixel"   : 8-Bit Retro Gaming pixel art style
 * ============================================================================
 */
export const DEFAULT_THEME = "pixel"; // "classic" or "pixel" (data.json is prioritized)

const STORAGE_KEY = "gdgoc_theme";
const USER_SELECTION_KEY = "gdgoc_user_selected_theme";
const LAST_DEFAULT_KEY = "gdgoc_last_default_theme";

/**
 * Resolves the configured default theme:
 * 1. Checks HTML attribute data-default-theme on <html> or <body> if present
 * 2. Falls back to DEFAULT_THEME variable above
 */
export function getConfiguredDefaultTheme() {
  const htmlAttr = document.documentElement.getAttribute("data-default-theme");
  const bodyAttr = document.body?.getAttribute("data-default-theme");
  return htmlAttr || bodyAttr || DEFAULT_THEME;
}

function getSavedTheme() {
  const defaultTheme = getConfiguredDefaultTheme();

  try {
    const lastDefault = localStorage.getItem(LAST_DEFAULT_KEY);

    // If the developer updated DEFAULT_THEME in the code, immediately respect the new default
    if (lastDefault !== defaultTheme) {
      localStorage.setItem(LAST_DEFAULT_KEY, defaultTheme);
      // If user hasn't explicitly manually chosen a theme, switch to the new default
      if (!localStorage.getItem(USER_SELECTION_KEY)) {
        return defaultTheme;
      }
    }

    // If user previously chose a theme from the menu, keep their choice
    const userSelected = localStorage.getItem(USER_SELECTION_KEY);
    if (userSelected) {
      return userSelected;
    }

    return defaultTheme;
  } catch (e) {
    return defaultTheme;
  }
}

function saveTheme(theme, isUserManualChoice = false) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    if (isUserManualChoice) {
      localStorage.setItem(USER_SELECTION_KEY, theme);
    }
  } catch (e) {
    console.warn("localStorage not accessible:", e);
  }
}

export function applyTheme(theme, isUserManualChoice = false) {
  const currentTheme = theme === "pixel" ? "pixel" : "classic";

  document.documentElement.setAttribute("data-theme", currentTheme);
  document.body.setAttribute("data-theme", currentTheme);

  // Update active state in menu
  const options = document.querySelectorAll(".theme-option");
  options.forEach((opt) => {
    const optTheme = opt.getAttribute("data-set-theme");
    if (optTheme === currentTheme) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });

  // Update button icon
  const iconEl = document.querySelector(".theme-icon");
  if (iconEl) {
    iconEl.textContent = currentTheme === "pixel" ? "👾" : "🎨";
  }

  saveTheme(currentTheme, isUserManualChoice);

  // Dispatch custom event
  window.dispatchEvent(
    new CustomEvent("themeChange", { detail: { theme: currentTheme } })
  );
}

export function initThemeSwitcher() {
  const btn = document.getElementById("themeMenuButton");
  const dropdown = document.getElementById("themeDropdown");
  const options = document.querySelectorAll(".theme-option");

  // Apply initial theme
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme, false);

  // Also check if data.json specifies a defaultTheme
  fetch("./src/json/data.json")
    .then((res) => res.json())
    .then((data) => {
      if (
        data?.meta?.defaultTheme &&
        !localStorage.getItem(USER_SELECTION_KEY)
      ) {
        applyTheme(data.meta.defaultTheme, false);
      }
    })
    .catch(() => {});

  if (!btn || !dropdown) return;

  // Toggle Dropdown
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Theme option clicks
  options.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedTheme = opt.getAttribute("data-set-theme");
      applyTheme(selectedTheme, true);
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

// Auto-initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeSwitcher);
} else {
  initThemeSwitcher();
}
