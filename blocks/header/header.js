// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetches the nav fragment HTML.
 * Local / `aem up` serves /content/nav.plain.html; DA/EDS serves {navPath}.plain.html.
 * @param {string} navPath nav document path without the .plain.html suffix
 * @returns {Promise<string>} the fragment HTML
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return '';
  return resp.text();
}

/**
 * Closes all open desktop dropdowns.
 * @param {Element} nav the nav element
 */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the mobile menu open/closed.
 * @param {Element} nav the nav element
 * @param {boolean} [force] optional forced state (true = open)
 */
function toggleMenu(nav, force) {
  const expanded = force !== undefined ? !force : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (expanded) closeAllDropdowns(nav);
}

/**
 * Turns a nav <li> that has a nested <ul> into a dropdown/expandable trigger.
 * @param {Element} li the list item
 * @param {Element} nav the nav element
 */
function decorateDropdown(li, nav) {
  const submenu = li.querySelector(':scope > ul');
  if (!submenu) return;
  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');

  const trigger = li.querySelector(':scope > a');
  if (trigger) trigger.classList.add('nav-drop-trigger');

  // Toggle button (chevron) — separate click target from the link so the label can navigate.
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav-drop-toggle';
  toggleBtn.setAttribute('type', 'button');
  toggleBtn.setAttribute('aria-label', `Toggle ${trigger ? trigger.textContent.trim() : 'submenu'}`);
  li.insertBefore(toggleBtn, submenu);

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = li.getAttribute('aria-expanded') === 'true';
    if (isDesktop.matches) closeAllDropdowns(nav);
    li.setAttribute('aria-expanded', open ? 'false' : 'true');
  });

  // Desktop hover opens/closes top-level panels.
  const isTopLevel = li.parentElement.classList.contains('nav-sections-list');
  if (isTopLevel) {
    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        closeAllDropdowns(nav);
        li.setAttribute('aria-expanded', 'true');
      }
    });
    li.addEventListener('mouseleave', () => {
      if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navPath = block.dataset.nav || '/content/nav';
  const html = await fetchNav(navPath);
  if (!html) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  nav.innerHTML = html;

  // Nav images use relative `images/...` paths (portable + validation-friendly).
  // Rewrite to the absolute content path so they resolve regardless of page URL.
  nav.querySelectorAll('img[src^="images/"]').forEach((img) => {
    img.setAttribute('src', `/content/${img.getAttribute('src')}`);
  });

  const sections = [...nav.querySelectorAll(':scope > div')];
  ['nav-brand', 'nav-sections', 'nav-secondary'].forEach((c, i) => {
    if (sections[i]) sections[i].classList.add(c);
  });

  const brand = nav.querySelector('.nav-brand a');
  if (brand) brand.classList.add('nav-brand-link');

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const topList = navSections.querySelector(':scope > ul');
    if (topList) topList.classList.add('nav-sections-list');
    navSections.querySelectorAll('li').forEach((li) => decorateDropdown(li, nav));
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // close on outside click / escape
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && isDesktop.matches) closeAllDropdowns(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllDropdowns(nav);
      if (!isDesktop.matches) toggleMenu(nav, false);
    }
  });

  // reset when crossing the desktop/mobile boundary
  isDesktop.addEventListener('change', () => {
    closeAllDropdowns(nav);
    toggleMenu(nav, false);
    document.body.style.overflowY = '';
  });

  // Move the secondary utility nav out of the constrained primary nav so it can
  // render as a full-width band below the main bar (matches the source header).
  const secondary = nav.querySelector('.nav-secondary');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  if (secondary) {
    const band = document.createElement('div');
    band.className = 'nav-secondary-band';
    band.append(secondary);
    navWrapper.append(band);
  }
  block.textContent = '';
  block.append(navWrapper);
}
