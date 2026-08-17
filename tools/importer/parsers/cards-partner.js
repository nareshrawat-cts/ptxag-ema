/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-partner. Base: cards.
 * Source: https://www.ptxag.com/us/en.html
 * Generated: 2026-08-17
 *
 * Cards block: 2 columns. First row = block name.
 * Each subsequent row = one card: [image cell, text-content cell].
 * Text cell holds optional title (heading), description, and CTA(s).
 */
export default function parse(element, { document }) {
  // Each card in the source is a .banner__card / .card element.
  const cardEls = Array.from(element.querySelectorAll('.banner__card, .card'))
    // keep only genuine card containers (some class overlaps), and de-dupe nested matches
    .filter((el) => el.querySelector('.card__content, .card__media'));

  const cells = [];

  cardEls.forEach((card) => {
    // Image: prefer picture, fall back to img
    const picture = card.querySelector('.card__media picture, .card__image picture');
    const img = card.querySelector('.card__media img, .card__image img');
    const imageEl = picture || img || null;

    // Text content lives in .card__content
    const content = card.querySelector('.card__content');
    const textCell = [];

    if (content) {
      const title = content.querySelector('.card__title, h1, h2, h3, h4, h5, h6');
      if (title) textCell.push(title);

      const description = content.querySelector('.card__description, p');
      if (description) textCell.push(description);

      // CTAs inside content only (avoid duplicated .card__btns--sm rendered outside content)
      const ctas = Array.from(content.querySelectorAll('.card__btns a, a.btn, a'));
      ctas.forEach((cta) => textCell.push(cta));
    }

    // Only emit a row if there is meaningful content
    if (imageEl || textCell.length) {
      cells.push([imageEl || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-partner', cells });
  element.replaceWith(block);
}
