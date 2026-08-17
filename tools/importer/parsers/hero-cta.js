/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base: hero.
 * Source: https://www.ptxag.com/us/en.html
 * Generated: 2026-08-17
 *
 * Hero block: 1 column. Row 1 = block name. Row 2 = optional background image.
 * Row 3 = content cell (title heading + subheading + CTA).
 */
export default function parse(element, { document }) {
  // Remove decorative sprite-icon SVGs (base64 data-URIs) so CTA links stay clean.
  element.querySelectorAll('.sprite-icon, .sprite-icon__icon').forEach((s) => s.remove());

  const cells = [];

  // Row 2 (optional): background image.
  const bgPicture = element.querySelector('.section-intro__asset picture, [class*="asset"] picture');
  const bgImg = element.querySelector('.section-intro__asset img, [class*="asset"] img');
  const bgImage = bgPicture || bgImg || null;
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell.
  const contentCell = [];

  const heading = element.querySelector('.cmp-heading__text, .section-intro__heading h1, .section-intro__heading h2, h1, h2, h3');
  if (heading) contentCell.push(heading);

  element.querySelectorAll('.section-intro__text p, .cmp-text p, p').forEach((p) => {
    if (p.textContent.trim()) contentCell.push(p);
  });

  const ctas = Array.from(element.querySelectorAll('.section-intro__cta a, .cta-list a, a.btn'));
  ctas.forEach((cta) => contentCell.push(cta));

  // Empty-block guard
  if (!contentCell.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
