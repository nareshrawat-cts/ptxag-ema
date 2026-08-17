/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-grid. Base: tabs.
 * Source: https://www.ptxag.com/us/en.html
 * Generated: 2026-08-17
 *
 * Tabs block: 2 columns. Row 1 = block name. Each subsequent row is one tab:
 *   cell 1 = tab label, cell 2 = tab content.
 * In this variant each tab panel holds a grid of cards (image + title + CTA).
 * We flatten each card's image, title, and primary CTA into the content cell
 * (blocks must not be nested inside blocks), dropping the duplicated small-screen
 * button (.card__btns--sm) to avoid doubled links.
 */
export default function parse(element, { document }) {
  // Drop duplicated small-screen buttons that mirror the in-content CTA.
  element.querySelectorAll('.card__btns--sm').forEach((b) => b.remove());

  const tabList = element.querySelector('.cmp-tabs__tablist');
  const labels = tabList
    ? Array.from(tabList.querySelectorAll(':scope > li.cmp-tabs__tab, :scope > li'))
    : [];
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];

  const count = Math.max(labels.length, panels.length);
  for (let i = 0; i < count; i += 1) {
    const labelEl = labels[i];
    const panel = panels[i];

    // Tab label cell.
    const labelText = labelEl ? labelEl.textContent.trim() : `Tab ${i + 1}`;

    // Tab content cell: flatten cards into image / title / CTA sequence.
    const contentCell = [];
    if (panel) {
      const cards = Array.from(panel.querySelectorAll('.banner__card, .card'))
        .filter((c) => c.querySelector('.card__content, .card__media'));

      if (cards.length) {
        cards.forEach((card) => {
          const picture = card.querySelector('.card__media picture, .card__image picture');
          const img = card.querySelector('.card__media img, .card__image img');
          const imageEl = picture || img;
          if (imageEl) contentCell.push(imageEl);

          const content = card.querySelector('.card__content');
          if (content) {
            const title = content.querySelector('.card__title, h1, h2, h3, h4, h5, h6');
            if (title) contentCell.push(title);
            const desc = content.querySelector('.card__description, p');
            if (desc) contentCell.push(desc);
            content.querySelectorAll('.card__btns a, a.btn, a').forEach((a) => contentCell.push(a));
          }
        });
      } else {
        // Fallback: no card grid — take the panel's meaningful children.
        Array.from(panel.children).forEach((child) => contentCell.push(child));
      }
    }

    // Only emit a row if the tab has a label or content.
    if (labelText || contentCell.length) {
      cells.push([labelText, contentCell.length ? contentCell : '']);
    }
  }

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-grid', cells });
  element.replaceWith(block);
}
