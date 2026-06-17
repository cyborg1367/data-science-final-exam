/**
 * Math rendering helper (KaTeX auto-render).
 *
 * Lets question authors write LaTeX inside questions, options and explanations.
 * Supported delimiters:
 *   \( ... \)   inline math    e.g.  \(\hat{y} = \beta_0 + \beta_1 x\)
 *   \[ ... \]   display math
 *   $$ ... $$   display math
 *
 * NOTE: single `$ ... $` is intentionally NOT enabled, because the questions
 * contain currency amounts (e.g. $58, $4.1M) that must stay literal.
 */
(function (global) {
  const OPTIONS = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false }
    ],
    throwOnError: false,
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option']
  };

  function render(root) {
    const el = root || document.body;
    if (global.renderMathInElement) {
      try { global.renderMathInElement(el, OPTIONS); } catch (e) { /* ignore bad math */ }
      return;
    }
    // KaTeX (deferred) not ready yet — run once it has loaded.
    document.addEventListener('DOMContentLoaded', function () {
      if (global.renderMathInElement) {
        try { global.renderMathInElement(el, OPTIONS); } catch (e) { /* ignore */ }
      }
    });
  }

  global.typesetMath = render;
})(window);
