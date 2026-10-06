const HEROES_URL = 'data/heroes.json';
const ITEMS_URL = 'data/items.json';
const BUILD_SIZE = 6;

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

function randomHero() {
  // Avoid showing the same hero twice in a row.
  const pool = heroes.length > 1 ? heroes.filter((h) => h !== currentHero) : heroes;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Six unique items, with at most one pair of boots.
function randomBuild() {
  const pool = [...items];
  const build = [];
  let hasBoots = false;

  while (build.length < BUILD_SIZE && pool.length > 0) {
    const [item] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    if (item.boots && hasBoots) continue;
    hasBoots = hasBoots || item.boots;
    build.push(item);
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
}

function renderBuild() {
  els.build.replaceChildren(
    ...randomBuild().map((item) => {
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
