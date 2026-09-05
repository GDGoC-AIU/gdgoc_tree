const particlesContainer = document.querySelector(".particles");

const particleCount = window.innerWidth <= 768 ? 18 : 35;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("span");

  particle.classList.add("particle");

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;

  particle.style.animationDelay = `${Math.random() * 20}s`;
  particle.style.animationDuration = `${20 + Math.random() * 20}s`;

  particlesContainer.appendChild(particle);
}
