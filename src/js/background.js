/**
 * ============================================================================
 * GDGoC Tree - Background Particles Generator
 * ============================================================================
 * Dynamically spawns animated Google-colored glowing floating particles.
 * Uses DocumentFragment for optimal rendering performance (single reflow).
 * ============================================================================
 */

const GOOGLE_COLORS = Object.freeze([
  "#4285f4",
  "#ea4335",
  "#f9ab00",
  "#34a853",
]);

const PARTICLE_CONFIG = Object.freeze({
  MOBILE_MAX_WIDTH: 768,
  COUNT_MOBILE: 18,
  COUNT_DESKTOP: 35,
  MAX_DELAY_SECONDS: 20,
  MIN_DURATION_SECONDS: 20,
  DURATION_SPREAD_SECONDS: 20,
});

function getRandomGoogleColor() {
  const randomIndex = Math.floor(Math.random() * GOOGLE_COLORS.length);
  return GOOGLE_COLORS[randomIndex];
}

function createParticleElement() {
  const particle = document.createElement("span");
  particle.className = "particle";

  const color = getRandomGoogleColor();
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 8px ${color}, 0 0 20px ${color}`;

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;

  const delay = Math.random() * PARTICLE_CONFIG.MAX_DELAY_SECONDS;
  const duration =
    PARTICLE_CONFIG.MIN_DURATION_SECONDS +
    Math.random() * PARTICLE_CONFIG.DURATION_SPREAD_SECONDS;

  particle.style.animationDelay = `${delay}s`;
  particle.style.animationDuration = `${duration}s`;

  return particle;
}

export function initBackgroundParticles() {
  const container = document.querySelector(".particles");
  if (!container) return;

  const isMobile = window.innerWidth <= PARTICLE_CONFIG.MOBILE_MAX_WIDTH;
  const particleCount = isMobile
    ? PARTICLE_CONFIG.COUNT_MOBILE
    : PARTICLE_CONFIG.COUNT_DESKTOP;

  // Use DocumentFragment to batch DOM mutations into a single reflow
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    fragment.appendChild(createParticleElement());
  }

  container.appendChild(fragment);
}

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBackgroundParticles);
} else {
  initBackgroundParticles();
}

function updateBackgroundSize() {
  const pageWidth = document.documentElement.scrollWidth;
  const pageHeight = document.documentElement.scrollHeight;

  const size = Math.max(pageWidth, pageHeight);

  document.documentElement.style.setProperty(
    "--background-size",
    `${size * 1.6}px`,
  );
}

updateBackgroundSize();
window.addEventListener("resize", updateBackgroundSize);
