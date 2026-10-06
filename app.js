const HEROES_URL = 'data/heroes.json';
const ITEMS_URL = 'data/items.json';
const BUILD_SIZE = 6;
// Heroes that never get boots; every other hero gets exactly one pair.
const NO_BOOTS_HEROES = ['centaur'];

const els = {
  error: document.getElementById('error'),
  result: document.getElementById('result'),
  heroIcon: document.getElementById('hero-icon'),
  heroName: document.getElementById('hero-name'),
  build: document.getElementById('build'),
  rollAll: document.getElementById('roll-all'),
  rollHero: document.getElementById('roll-hero'),
  rollBuild: document.getElementById('roll-build'),
};

let heroes = [];
let items = [];
let currentHero = null;
let currentBuild = [];

const needsBoots = (hero) => !NO_BOOTS_HEROES.includes(hero.id);
const hasBoots = (build) => build.some((item) => item.boots);

function randomHero() {
  // Avoid showing the same hero twice in a row.
  const pool = heroes.length > 1 ? heroes.filter((h) => h !== currentHero) : heroes;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Six unique items: exactly one pair of boots, or none for NO_BOOTS_HEROES.
function randomBuild(hero) {
  const pool = items.filter((item) => !item.boots);
  const build = [];

  while (build.length < BUILD_SIZE && pool.length > 0) {
    build.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
  }

  const boots = items.filter((item) => item.boots);
  if (needsBoots(hero) && boots.length > 0) {
    const slot = Math.floor(Math.random() * BUILD_SIZE);
    build[slot] = boots[Math.floor(Math.random() * boots.length)];
  }

  return build;
}

function replay(el) {
  el.classList.remove('pop');
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add('pop');
}

function renderHero() {
  currentHero = randomHero();
  els.heroIcon.src = currentHero.icon;
  els.heroIcon.alt = currentHero.name;
  els.heroName.textContent = currentHero.name;
  replay(els.heroIcon);

  // Keep an existing build valid for the new hero.
  if (currentBuild.length > 0 && needsBoots(currentHero) !== hasBoots(currentBuild)) {
    renderBuild();
  }
}

function renderBuild() {
  currentBuild = randomBuild(currentHero);
  els.build.replaceChildren(
    ...currentBuild.map((item) => {
      const li = document.createElement('li');
      li.className = 'pop';

      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.name;

      const name = document.createElement('span');
      name.textContent = item.name;

      li.append(img, name);
      return li;
    })
  );
}

function showError(message) {
  els.error.textContent = message;
  els.error.hidden = false;
}

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function init() {
  try {
    [heroes, items] = await Promise.all([loadJson(HEROES_URL), loadJson(ITEMS_URL)]);
  } catch (err) {
    console.error(err);
    showError(
      location.protocol === 'file:'
        ? 'Could not load the data files. Browsers block fetch() on file:// pages — serve this folder with a local web server instead.'
        : `Could not load the data files (${err.message}).`
    );
    return;
  }

  els.rollAll.addEventListener('click', () => {
    renderHero();
    renderBuild();
  });
  els.rollHero.addEventListener('click', renderHero);
  els.rollBuild.addEventListener('click', renderBuild);

  renderHero();
  renderBuild();
  els.result.hidden = false;
}

init();
