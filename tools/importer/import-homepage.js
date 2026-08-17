/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsPartnerParser from './parsers/cards-partner.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroCtaParser from './parsers/hero-cta.js';
import heroMediaParser from './parsers/hero-media.js';
import tabsGridParser from './parsers/tabs-grid.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/ptxag-cleanup.js';
import sectionsTransformer from './transformers/ptxag-sections.js';
import dmImagesTransformer from './transformers/ptxag-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'cards-partner': cardsPartnerParser,
  'columns-feature': columnsFeatureParser,
  'hero-cta': heroCtaParser,
  'hero-media': heroMediaParser,
  'tabs-grid': tabsGridParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'PTx Ag homepage with hero, brand intro, product tabs, resources feature, partners cards, and dealer CTA',
  urls: [
    'https://www.ptxag.com/us/en.html',
  ],
  blocks: [
    {
      name: 'hero-media',
      instances: ['section.text-and-asset'],
    },
    {
      name: 'columns-feature',
      instances: ['.side-by-side', '.neutral-green-theme .multicolumncomp'],
    },
    {
      name: 'tabs-grid',
      instances: ['.tabs'],
    },
    {
      name: 'cards-partner',
      instances: ['.featurecontainerblockcomp'],
    },
    {
      name: 'hero-cta',
      instances: ['.section-intro'],
    },
  ],
  sections: [
    {
      id: 'rc5', name: 'Hero',
      selector: '#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid:nth-of-type(1)',
      style: null, blocks: ['hero-media'], defaultContent: [],
    },
    {
      id: 'rc6', name: 'Brand Intro',
      selector: '#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid:nth-of-type(2)',
      style: null, blocks: ['columns-feature'], defaultContent: [],
    },
    {
      id: 'rc7', name: 'Products',
      selector: '#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid.dark-green-theme:nth-of-type(3)',
      style: 'dark-green', blocks: ['tabs-grid'], defaultContent: ['.dark-green-theme:nth-of-type(3) .heading.title'],
    },
    {
      id: 'rc8', name: 'Resources',
      selector: '.theme-container.neutral-green-theme',
      style: 'neutral-green', blocks: ['columns-feature'], defaultContent: ['.neutral-green-theme .heading.title'],
    },
    {
      id: 'rc9', name: 'Partners',
      selector: '#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid.dark-green-theme:nth-of-type(5)',
      style: 'dark-green', blocks: ['cards-partner'], defaultContent: ['.dark-green-theme:nth-of-type(5) .heading.title'],
    },
    {
      id: 'rc10', name: 'Dealer CTA',
      selector: '.theme-container.neutral-orange-theme',
      style: 'neutral-orange', blocks: ['hero-cta'], defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
// cleanup self-gates to beforeTransform; sections + dm-images self-gate to afterTransform.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return; // avoid double-processing overlapping selectors
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata + DM image anchors)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
