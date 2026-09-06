const particlesContainer = document.querySelector(".particles");

const particleCount = window.innerWidth <= 768 ? 18 : 35;
const googleColors = ["#4285f4", "#ea4335", "#f9ab00", "#34a853"];

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("span");

  particle.classList.add("particle");

  const randomColor =
    googleColors[Math.floor(Math.random() * googleColors.length)];
  particle.style.backgroundColor = randomColor;
  particle.style.boxShadow = `0 0 8px ${randomColor}, 0 0 20px ${randomColor}`;

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;

  particle.style.animationDelay = `${Math.random() * 20}s`;
  particle.style.animationDuration = `${20 + Math.random() * 20}s`;

  particlesContainer.appendChild(particle);
}
