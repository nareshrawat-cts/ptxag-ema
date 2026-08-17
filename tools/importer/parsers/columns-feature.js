/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.ptxag.com/us/en.html
 * Generated: 2026-08-17
 *
 * Columns block: first row = block name. Second row defines the column count;
 * each cell becomes a responsive column. This variant renders content side by side.
 *
 * Handles two source shapes:
 *  - `.side-by-side`: left container (heading + copy + CTAs) | right container (image)
 *  - `.multicolumncomp` banner card: image | text content (title + description + CTA)
 */
export default function parse(element, { document }) {
  // Remove decorative sprite-icon SVGs (base64 data-URIs) so links stay clean.
  element.querySelectorAll('.sprite-icon, .sprite-icon__icon').forEach((s) => s.remove());

  const cells = [];

  // Shape A: explicit side-by-side left/right containers.
  const left = element.querySelector('.side-by-side__left-container');
  const right = element.querySelector('.side-by-side__right-container');

  if (left || right) {
    const columns = [];
    if (left) columns.push(left);
    if (right) columns.push(right);
    if (columns.length) cells.push(columns);
  } else {
    // Shape B: banner card (image + content) — image column | text column.
    const media = element.querySelector('.card__media, .card__image, picture');
    const content = element.querySelector('.card__content');

    const imageCol = [];
    const picture = element.querySelector('.card__media picture, .card__image picture');
    const img = element.querySelector('.card__media img, .card__image img, picture img, img');
    if (picture) imageCol.push(picture);
    else if (img) imageCol.push(img);

    const textCol = [];
    if (content) {
      textCol.push(content);
    } else {
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textCol.push(heading);
      element.querySelectorAll('p').forEach((p) => textCol.push(p));
      element.querySelectorAll('a.btn, a.card__btn, a').forEach((a) => textCol.push(a));
    }

    if (imageCol.length && textCol.length) {
      cells.push([imageCol, textCol]);
    } else if (imageCol.length) {
      cells.push([imageCol]);
    } else if (textCol.length) {
      cells.push([textCol]);
    } else if (media) {
      cells.push([media]);
    }
  }

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
