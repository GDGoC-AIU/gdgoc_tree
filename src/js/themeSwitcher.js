/**
 * ============================================================================
 * GDGoC Tree - Theme & Preferences Switcher
 * ============================================================================
 * Handles theme selection (Classic / Pixel Art) and motion preferences
 * (Reduced Motion / Animation Toggle).
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Constants & Enums
// ----------------------------------------------------------------------------
export const DEFAULT_THEME = "pixel"; // "classic" or "pixel" (data.json meta takes priority)

export const Theme = Object.freeze({
  CLASSIC: "classic",
  PIXEL: "pixel"
});

export const Motion = Object.freeze({
  ENABLED: "enabled",
  DISABLED: "disabled"
});

const StorageKey = Object.freeze({
  THEME: "gdgoc_theme",
  USER_THEME: "gdgoc_user_selected_theme",
  LAST_DEFAULT_THEME: "gdgoc_last_default_theme",
  MOTION: "gdgoc_motion"
});

const EventName = Object.freeze({
  THEME_CHANGE: "themeChange",
  MOTION_CHANGE: "motionChange"
});

// ----------------------------------------------------------------------------
// 2. Safe Storage Wrapper (DRY localStorage operations with error boundaries)
// ----------------------------------------------------------------------------
const storage = {
  get(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to save key "${key}":`, err);
      return false;
    }
  },
  has(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }
};

// ----------------------------------------------------------------------------
// 3. Motion Manager (Reduced Motion detection & user override)
// ----------------------------------------------------------------------------
class MotionManager {
  constructor() {
    this.mediaQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    this.state = this.resolveInitialState();
  }

  get systemPrefersReducedMotion() {
    return Boolean(this.mediaQuery?.matches);
  }

  resolveInitialState() {
    const saved = storage.get(StorageKey.MOTION);
    if (saved === Motion.ENABLED || saved === Motion.DISABLED) {
      return saved;
    }
    return this.systemPrefersReducedMotion ? Motion.DISABLED : Motion.ENABLED;
  }

  setState(nextState, { persist = false } = {}) {
    this.state = nextState === Motion.DISABLED ? Motion.DISABLED : Motion.ENABLED;

    document.documentElement.setAttribute("data-motion", this.state);
    if (document.body) {
      document.body.setAttribute("data-motion", this.state);
    }

    if (persist) {
      storage.set(StorageKey.MOTION, this.state);
    }

    window.dispatchEvent(
      new CustomEvent(EventName.MOTION_CHANGE, { detail: { motion: this.state } })
    );

    return this.state;
  }

  toggle() {
    const nextState =
      this.state === Motion.ENABLED ? Motion.DISABLED : Motion.ENABLED;
    return this.setState(nextState, { persist: true });
  }

  listenToSystemChanges() {
    if (!this.mediaQuery) return;

    const onMediaChange = (event) => {
      // Only react to OS changes if user hasn't set an explicit preference
      if (!storage.has(StorageKey.MOTION)) {
        this.setState(event.matches ? Motion.DISABLED : Motion.ENABLED, {
          persist: false
        });
      }
    };

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener("change", onMediaChange);
    } else if (this.mediaQuery.addListener) {
      this.mediaQuery.addListener(onMediaChange);
    }
  }
}

// ----------------------------------------------------------------------------
// 4. Theme Manager (Theme resolution, application & meta sync)
// ----------------------------------------------------------------------------
class ThemeManager {
  constructor() {
    this.state = this.resolveInitialState();
  }

  getConfiguredDefault() {
    const htmlAttr = document.documentElement.getAttribute("data-default-theme");
    const bodyAttr = document.body?.getAttribute("data-default-theme");
    return htmlAttr || bodyAttr || DEFAULT_THEME;
  }

  resolveInitialState() {
    const configuredDefault = this.getConfiguredDefault();
    const lastDefault = storage.get(StorageKey.LAST_DEFAULT_THEME);

    if (lastDefault !== configuredDefault) {
      storage.set(StorageKey.LAST_DEFAULT_THEME, configuredDefault);
      if (!storage.has(StorageKey.USER_THEME)) {
        return configuredDefault;
      }
    }

    return storage.get(StorageKey.USER_THEME) || configuredDefault;
  }

  setState(nextTheme, { persist = false } = {}) {
    this.state = nextTheme === Theme.PIXEL ? Theme.PIXEL : Theme.CLASSIC;

    document.documentElement.setAttribute("data-theme", this.state);
    if (document.body) {
      document.body.setAttribute("data-theme", this.state);
    }

    storage.set(StorageKey.THEME, this.state);
    if (persist) {
      storage.set(StorageKey.USER_THEME, this.state);
    }

    window.dispatchEvent(
      new CustomEvent(EventName.THEME_CHANGE, { detail: { theme: this.state } })
    );

    return this.state;
  }

  async syncFromDataJson() {
    if (storage.has(StorageKey.USER_THEME)) return;

    try {
      const response = await fetch("./src/json/data.json");
      if (!response.ok) return;
      const data = await response.json();
      const metaTheme = data?.meta?.defaultTheme;
      if (metaTheme && !storage.has(StorageKey.USER_THEME)) {
        this.setState(metaTheme, { persist: false });
      }
    } catch {
      // Non-blocking fallback
    }
  }
}

// ----------------------------------------------------------------------------
// 5. Preferences Menu UI Controller
// ----------------------------------------------------------------------------
class PreferencesMenuController {
  constructor(themeManager, motionManager) {
    this.themeManager = themeManager;
    this.motionManager = motionManager;

    this.menuButton = document.getElementById("themeMenuButton");
    this.menuDropdown = document.getElementById("themeDropdown");
    this.themeIcon = document.querySelector(".theme-icon");
    this.themeOptions = document.querySelectorAll(".theme-option[data-set-theme]");

    this.motionToggleBtn = document.getElementById("motionToggleBtn");
    this.motionIcon = document.getElementById("motionIcon");
    this.motionSub = document.getElementById("motionSub");
    this.motionBadge = document.getElementById("motionBadge");
  }

  init() {
    if (!this.menuButton || !this.menuDropdown) return;

    // Apply initial UI render
    this.renderThemeUI(this.themeManager.state);
    this.renderMotionUI(this.motionManager.state);

    // Keep UI in sync with state changes
    window.addEventListener(EventName.THEME_CHANGE, (event) => {
      this.renderThemeUI(event.detail.theme);
    });

    window.addEventListener(EventName.MOTION_CHANGE, (event) => {
      this.renderMotionUI(event.detail.motion);
    });

    this.bindEvents();
  }

  renderThemeUI(theme) {
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === Theme.PIXEL ? "👾" : "🎨";
    }

    this.themeOptions.forEach((option) => {
      const isSelected = option.getAttribute("data-set-theme") === theme;
      option.classList.toggle("active", isSelected);
      option.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  renderMotionUI(motion) {
    const isEnabled = motion === Motion.ENABLED;

    if (this.motionIcon) {
      this.motionIcon.textContent = isEnabled ? "✨" : "⏸️";
    }
    if (this.motionSub) {
      this.motionSub.textContent = isEnabled ? "Enabled" : "Disabled";
    }
    if (this.motionBadge) {
      this.motionBadge.textContent = isEnabled ? "ON" : "OFF";
      this.motionBadge.classList.toggle("off", !isEnabled);
    }
    if (this.motionToggleBtn) {
      this.motionToggleBtn.setAttribute("aria-checked", isEnabled ? "true" : "false");
    }
  }

  open() {
    this.menuDropdown.classList.add("open");
    this.menuButton.setAttribute("aria-expanded", "true");
  }

  close() {
    this.menuDropdown.classList.remove("open");
    this.menuButton.setAttribute("aria-expanded", "false");
  }

  toggle() {
    const isOpen = this.menuDropdown.classList.contains("open");
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  bindEvents() {
    // Menu trigger click
    this.menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggle();
    });

    // Theme choices
    this.themeOptions.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        const selectedTheme = option.getAttribute("data-set-theme");
        if (selectedTheme) {
          this.themeManager.setState(selectedTheme, { persist: true });
        }
        this.close();
      });
    });

    // Motion choice toggle (keeps menu open for visual feedback)
    if (this.motionToggleBtn) {
      this.motionToggleBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.motionManager.toggle();
      });
    }

    // Close on click outside
    document.addEventListener("click", (event) => {
      if (
        !this.menuDropdown.contains(event.target) &&
        !this.menuButton.contains(event.target)
      ) {
        this.close();
      }
    });

    // Close on Escape key and return focus to trigger
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.menuDropdown.classList.contains("open")) {
        this.close();
        this.menuButton.focus();
      }
    });
  }
}

// ----------------------------------------------------------------------------
// 6. Application Instances & Public API Exports
// ----------------------------------------------------------------------------
export const motionManager = new MotionManager();
export const themeManager = new ThemeManager();

/**
 * Public functions preserved for backward compatibility
 */
export function applyTheme(theme, isUserManualChoice = false) {
  return themeManager.setState(theme, { persist: Boolean(isUserManualChoice) });
}

export function applyMotion(state, isUserManualChoice = false) {
  return motionManager.setState(state, { persist: Boolean(isUserManualChoice) });
}

export function getConfiguredDefaultTheme() {
  return themeManager.getConfiguredDefault();
}

export function getSavedMotion() {
  return motionManager.state;
}

export function getSystemPrefersReducedMotion() {
  return motionManager.systemPrefersReducedMotion;
}

export function initThemeSwitcher() {
  // Apply initial DOM states
  themeManager.setState(themeManager.state, { persist: false });
  motionManager.setState(motionManager.state, { persist: false });

  // Initialize UI controls
  const menu = new PreferencesMenuController(themeManager, motionManager);
  menu.init();

  // Watch system preferences & data.json sync
  motionManager.listenToSystemChanges();
  themeManager.syncFromDataJson();
}

// Auto-initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeSwitcher);
} else {
  initThemeSwitcher();
}
