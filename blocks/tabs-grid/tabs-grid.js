// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * Restructures the flat authored content of a tab panel into a grid of cards.
 * The content cell holds a flat sequence of:
 *   <p><picture></p>, <h3>, [<p>description</p>...], <p><a>Learn More</a></p>
 * A new card begins at each image; following elements up to the next image
 * form that card's body.
 * @param {Element} content The content cell of the tab panel
 */
function buildCards(content) {
  if (!content) return;

  // The scene7 image renderer leaves the whole flat card sequence
  // (PICTURE, H3, P..., PICTURE, H3, P...) inside a single <p> wrapper.
  // Fall back to the content cell itself if there is no such wrapper.
  const flow = content.querySelector(':scope > p') && content.children.length === 1
    ? content.firstElementChild
    : content;

  const ul = document.createElement('ul');
  ul.className = 'tabs-grid-cards';

  let body = null;

  [...flow.children].forEach((node) => {
    const picture = node.tagName === 'PICTURE' ? node : node.querySelector('picture, img');
    if (picture) {
      // an image starts a new card
      const li = document.createElement('li');
      li.className = 'tabs-grid-card';

      const media = document.createElement('div');
      media.className = 'tabs-grid-card-image';
      media.append(picture.closest('picture') || picture);
      li.append(media);

      body = document.createElement('div');
      body.className = 'tabs-grid-card-body';
      li.append(body);

      ul.append(li);
    } else if (body) {
      // heading, description and link belong to the current card
      body.append(node);
    }
  });

  content.replaceWith(ul);
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-grid-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-grid-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // group the flat panel content into a grid of cards
    // (the content cell is the sibling of the tab-label cell)
    buildCards(tab.nextElementSibling);

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-grid-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
