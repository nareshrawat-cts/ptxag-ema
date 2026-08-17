/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ptxag (www.ptxag.com) site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie / consent banner (TrustArc). Verified in cleaned.html lines 2-9:
    //   <div id="consent_blackbar"> ... <div id="truste-consent-track"> ...
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar',
      '#truste-consent-track',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Selectors verified in cleaned.html:
    //   header.experiencefragment (line 21) - global header / navigation
    //   footer.experiencefragment (line 2071) - global footer (incl. backtotop, footer nav)
    //   .cmp-page__skiptomaincontent (line 15) - skip-to-content link
    //   link (line 18) - stray clientlib <link> stylesheet references
    //   noscript / iframe - non-authorable embeds
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      'footer.experiencefragment',
      '.cmp-page__skiptomaincontent',
      'link',
      'noscript',
      'iframe',
    ]);
  }
}
