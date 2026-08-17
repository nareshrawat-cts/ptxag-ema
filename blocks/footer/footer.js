/**
 * Fetches the footer fragment HTML.
 * Local / `aem up` serves /content/footer.plain.html; DA/EDS serves {footerPath}.plain.html.
 * @param {string} footerPath footer document path without the .plain.html suffix
 * @returns {Promise<string>} the fragment HTML
 */
async function fetchFooter(footerPath) {
  // Preview/Live (DA) serve the fragment at the site root (/footer.plain.html);
  // local `aem up` also serves /content/footer.plain.html. Try root first so the
  // footer works in every environment, then fall back to the configured path.
  const candidates = ['/footer.plain.html', `${footerPath}.plain.html`, '/content/footer.plain.html'];
  return candidates.reduce(async (prev, url) => {
    const acc = await prev;
    if (acc) return acc;
    const resp = await fetch(url);
    return resp.ok ? resp.text() : '';
  }, Promise.resolve(''));
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerPath = block.dataset.footer || '/content/footer';
  const html = await fetchFooter(footerPath);
  if (!html) return;

  const footer = document.createElement('div');
  footer.innerHTML = html;

  // Rewrite relative image paths to a root-absolute path so they resolve
  // regardless of the page URL, in both local and Preview/Live (DA) environments.
  footer.querySelectorAll('img[src^="images/"]').forEach((img) => {
    img.setAttribute('src', `/${img.getAttribute('src')}`);
  });

  const sections = [...footer.querySelectorAll(':scope > div')];
  ['footer-nav', 'footer-brand', 'footer-legal'].forEach((c, i) => {
    if (sections[i]) sections[i].classList.add(c);
  });

  block.textContent = '';
  block.append(footer);
}
