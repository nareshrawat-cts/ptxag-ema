/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-partner.js
  function parse(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(".banner__card, .card")).filter((el) => el.querySelector(".card__content, .card__media"));
    const cells = [];
    cardEls.forEach((card) => {
      const picture = card.querySelector(".card__media picture, .card__image picture");
      const img = card.querySelector(".card__media img, .card__image img");
      const imageEl = picture || img || null;
      const content = card.querySelector(".card__content");
      const textCell = [];
      if (content) {
        const title = content.querySelector(".card__title, h1, h2, h3, h4, h5, h6");
        if (title) textCell.push(title);
        const description = content.querySelector(".card__description, p");
        if (description) textCell.push(description);
        const ctas = Array.from(content.querySelectorAll(".card__btns a, a.btn, a"));
        ctas.forEach((cta) => textCell.push(cta));
      }
      if (imageEl || textCell.length) {
        cells.push([imageEl || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-partner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document: document2 }) {
    element.querySelectorAll(".sprite-icon, .sprite-icon__icon").forEach((s) => s.remove());
    const cells = [];
    const left = element.querySelector(".side-by-side__left-container");
    const right = element.querySelector(".side-by-side__right-container");
    if (left || right) {
      const columns = [];
      if (left) columns.push(left);
      if (right) columns.push(right);
      if (columns.length) cells.push(columns);
    } else {
      const media = element.querySelector(".card__media, .card__image, picture");
      const content = element.querySelector(".card__content");
      const imageCol = [];
      const picture = element.querySelector(".card__media picture, .card__image picture");
      const img = element.querySelector(".card__media img, .card__image img, picture img, img");
      if (picture) imageCol.push(picture);
      else if (img) imageCol.push(img);
      const textCol = [];
      if (content) {
        textCol.push(content);
      } else {
        const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
        if (heading) textCol.push(heading);
        element.querySelectorAll("p").forEach((p) => textCol.push(p));
        element.querySelectorAll("a.btn, a.card__btn, a").forEach((a) => textCol.push(a));
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
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse3(element, { document: document2 }) {
    element.querySelectorAll(".sprite-icon, .sprite-icon__icon").forEach((s) => s.remove());
    const cells = [];
    const bgPicture = element.querySelector('.section-intro__asset picture, [class*="asset"] picture');
    const bgImg = element.querySelector('.section-intro__asset img, [class*="asset"] img');
    const bgImage = bgPicture || bgImg || null;
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    const heading = element.querySelector(".cmp-heading__text, .section-intro__heading h1, .section-intro__heading h2, h1, h2, h3");
    if (heading) contentCell.push(heading);
    element.querySelectorAll(".section-intro__text p, .cmp-text p, p").forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p);
    });
    const ctas = Array.from(element.querySelectorAll(".section-intro__cta a, .cta-list a, a.btn"));
    ctas.forEach((cta) => contentCell.push(cta));
    if (!contentCell.length && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-media.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll(".sprite-icon, .sprite-icon__icon").forEach((s) => s.remove());
    element.querySelectorAll('a[href^="blob:"], a[href^="data:"]').forEach((a) => {
      a.replaceWith(...a.childNodes);
    });
    const cells = [];
    const asset = element.querySelector('.text-and-asset__asset, [class*="asset"]');
    let mediaEl = null;
    if (asset) {
      const contentImg = Array.from(asset.querySelectorAll("img")).find((img) => {
        const src = img.getAttribute("src") || "";
        return src && !src.startsWith("data:") && !src.startsWith("blob:") && !src.includes("/s7viewers/") && !src.startsWith("./images/");
      });
      const video = asset.querySelector("video");
      mediaEl = contentImg || video || null;
    }
    if (mediaEl) cells.push([mediaEl]);
    const contentCell = [];
    const heading = element.querySelector(".text-and-asset__heading .cmp-heading__text, .cmp-heading__text, .text-and-asset__heading h1, .text-and-asset__heading h2, h1, h2");
    if (heading) contentCell.push(heading);
    const subhead = element.querySelector(".text-and-asset__subhead");
    if (subhead && subhead.textContent.trim()) contentCell.push(subhead);
    const textWrap = element.querySelector(".text-and-asset__text");
    if (textWrap && textWrap.textContent.trim()) {
      contentCell.push(textWrap);
    }
    const ctas = Array.from(element.querySelectorAll(".text-and-asset__cta a, .standalone-cta a, a.btn"));
    ctas.forEach((cta) => contentCell.push(cta));
    if (!contentCell.length && !mediaEl) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-grid.js
  function parse5(element, { document: document2 }) {
    element.querySelectorAll(".card__btns--sm").forEach((b) => b.remove());
    const tabList = element.querySelector(".cmp-tabs__tablist");
    const labels = tabList ? Array.from(tabList.querySelectorAll(":scope > li.cmp-tabs__tab, :scope > li")) : [];
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    const cells = [];
    const count = Math.max(labels.length, panels.length);
    for (let i = 0; i < count; i += 1) {
      const labelEl = labels[i];
      const panel = panels[i];
      const labelText = labelEl ? labelEl.textContent.trim() : `Tab ${i + 1}`;
      const contentCell = [];
      if (panel) {
        const cards = Array.from(panel.querySelectorAll(".banner__card, .card")).filter((c) => c.querySelector(".card__content, .card__media"));
        if (cards.length) {
          cards.forEach((card) => {
            const picture = card.querySelector(".card__media picture, .card__image picture");
            const img = card.querySelector(".card__media img, .card__image img");
            const imageEl = picture || img;
            if (imageEl) contentCell.push(imageEl);
            const content = card.querySelector(".card__content");
            if (content) {
              const title = content.querySelector(".card__title, h1, h2, h3, h4, h5, h6");
              if (title) contentCell.push(title);
              const desc = content.querySelector(".card__description, p");
              if (desc) contentCell.push(desc);
              content.querySelectorAll(".card__btns a, a.btn, a").forEach((a) => contentCell.push(a));
            }
          });
        } else {
          Array.from(panel.children).forEach((child) => contentCell.push(child));
        }
      }
      if (labelText || contentCell.length) {
        cells.push([labelText, contentCell.length ? contentCell : ""]);
      }
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ptxag-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        "#truste-consent-track"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        "footer.experiencefragment",
        ".cmp-page__skiptomaincontent",
        "link",
        "noscript",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/ptxag-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/transformers/ptxag-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "cards-partner": parse,
    "columns-feature": parse2,
    "hero-cta": parse3,
    "hero-media": parse4,
    "tabs-grid": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "PTx Ag homepage with hero, brand intro, product tabs, resources feature, partners cards, and dealer CTA",
    urls: [
      "https://www.ptxag.com/us/en.html"
    ],
    blocks: [
      {
        name: "hero-media",
        instances: ["section.text-and-asset"]
      },
      {
        name: "columns-feature",
        instances: [".side-by-side", ".neutral-green-theme .multicolumncomp"]
      },
      {
        name: "tabs-grid",
        instances: [".tabs"]
      },
      {
        name: "cards-partner",
        instances: [".featurecontainerblockcomp"]
      },
      {
        name: "hero-cta",
        instances: [".section-intro"]
      }
    ],
    sections: [
      {
        id: "rc5",
        name: "Hero",
        selector: "#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid:nth-of-type(1)",
        style: null,
        blocks: ["hero-media"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "Brand Intro",
        selector: "#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid:nth-of-type(2)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Products",
        selector: "#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid.dark-green-theme:nth-of-type(3)",
        style: "dark-green",
        blocks: ["tabs-grid"],
        defaultContent: [".dark-green-theme:nth-of-type(3) .heading.title"]
      },
      {
        id: "rc8",
        name: "Resources",
        selector: ".theme-container.neutral-green-theme",
        style: "neutral-green",
        blocks: ["columns-feature"],
        defaultContent: [".neutral-green-theme .heading.title"]
      },
      {
        id: "rc9",
        name: "Partners",
        selector: "#maincontent > main.container.responsivegrid.maincontent > div.cmp-container > div.theme-container.container.responsivegrid.dark-green-theme:nth-of-type(5)",
        style: "dark-green",
        blocks: ["cards-partner"],
        defaultContent: [".dark-green-theme:nth-of-type(5) .heading.title"]
      },
      {
        id: "rc10",
        name: "Dealer CTA",
        selector: ".theme-container.neutral-orange-theme",
        style: "neutral-orange",
        blocks: ["hero-cta"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
