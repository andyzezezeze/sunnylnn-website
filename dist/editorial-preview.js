const header = document.querySelector('#preview-header');
const menuButton = document.querySelector('.menu-button');
const mainMenu = document.querySelector('#main-menu');
const languageButton = document.querySelector('.language-button');
const languageMenu = document.querySelector('#language-menu');
const heroVideo = document.querySelector('.hero video');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

function setMenu(open) {
  mainMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  if (heroVideo && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (open) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  }
}

function setLanguageMenu(open) {
  languageMenu.hidden = !open;
  languageButton.setAttribute('aria-expanded', String(open));
}

menuButton.addEventListener('click', () => {
  setLanguageMenu(false);
  setMenu(mainMenu.hidden);
});

languageButton.addEventListener('click', () => {
  setMenu(false);
  setLanguageMenu(languageMenu.hidden);
});

document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => {
    languageButton.textContent = button.dataset.language;
    setLanguageMenu(false);
  });
});

document.addEventListener('click', (event) => {
  if (!languageMenu.hidden && !languageMenu.contains(event.target) && !languageButton.contains(event.target)) setLanguageMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    setLanguageMenu(false);
  }
});

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 48);
}
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const feature = document.querySelector('#neighbourhood-feature');
const featureImage = document.querySelector('#neighbourhood-image');
const featureName = document.querySelector('#neighbourhood-name');
const featureLocation = document.querySelector('#neighbourhood-location');

document.querySelectorAll('.neighbourhood-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.neighbourhood-button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    feature.classList.add('changing');
    const preload = new Image();
    preload.src = button.dataset.image;
    preload.onload = () => {
      featureImage.src = button.dataset.image;
      featureImage.alt = `${button.dataset.name} residence in ${button.textContent.trim()}`;
      featureName.textContent = button.dataset.name;
      featureLocation.textContent = button.dataset.location;
      feature.href = button.dataset.href;
      requestAnimationFrame(() => feature.classList.remove('changing'));
    };
  });
});
