/**
 * Fetches the footer fragment HTML.
 * Local / `aem up` serves /content/footer.plain.html; DA/EDS serves {footerPath}.plain.html.
 * @param {string} footerPath footer document path without the .plain.html suffix
 * @returns {Promise<string>} the fragment HTML
 */
async function fetchFooter(footerPath) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return '';
  return resp.text();
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

  // Rewrite relative image paths to the absolute content path so they resolve
  // regardless of the page URL the footer is rendered on.
  footer.querySelectorAll('img[src^="images/"]').forEach((img) => {
    img.setAttribute('src', `/content/${img.getAttribute('src')}`);
  });

  const sections = [...footer.querySelectorAll(':scope > div')];
  ['footer-nav', 'footer-brand', 'footer-legal'].forEach((c, i) => {
    if (sections[i]) sections[i].classList.add(c);
  });

  block.textContent = '';
  block.append(footer);
}
