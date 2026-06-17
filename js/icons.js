/**
 * Icon kit — a single, isomorphic line-icon set for the whole exam app.
 * Every glyph shares the same 24×24 grid, 1.75 stroke, round caps/joins and
 * inherits color via `currentColor`, so icons stay visually consistent anywhere.
 *
 * Usage:
 *   Icons.svg('clock')                      -> SVG markup string (for templates)
 *   <span class="icon" data-icon="clock"></span> + Icons.hydrate()  (for static HTML)
 */
(function (global) {
  const PATHS = {
    // Education / people
    teacher:
      '<path d="M3 8.5l9-4 9 4-9 4-9-4z"/><path d="M21 8.5v4"/>' +
      '<path d="M7 10.7V14c0 1.2 2.2 2.6 5 2.6s5-1.4 5-2.6v-3.3"/>',
    user:
      '<circle cx="12" cy="8" r="3.6"/><path d="M5 19.5a7 7 0 0 1 14 0"/>',

    // Content / structure
    clipboard:
      '<rect x="5" y="5" width="14" height="16" rx="2.2"/>' +
      '<path d="M9 3.6h6a1 1 0 0 1 1 1V6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4.6a1 1 0 0 1 1-1z"/>' +
      '<path d="M9 12h6M9 16h4"/>',
    'clipboard-check':
      '<rect x="5" y="5" width="14" height="16" rx="2.2"/>' +
      '<path d="M9 3.6h6a1 1 0 0 1 1 1V6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4.6a1 1 0 0 1 1-1z"/>' +
      '<path d="M9 13.5l2 2 4-4"/>',
    book:
      '<path d="M12 6.7C10.4 5.2 7.8 4.6 4 5.2v12.6c3.8-.6 6.4 0 8 1.5 1.6-1.5 4.2-2.1 8-1.5V5.2c-3.8-.6-6.4 0-8 1.5z"/>' +
      '<path d="M12 6.7V19.3"/>',

    // Time / metrics
    clock:
      '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.1 2"/>',
    calendar:
      '<rect x="4" y="5.5" width="16" height="15" rx="2.2"/>' +
      '<path d="M4 9.6h16"/><path d="M8 3.5v4M16 3.5v4"/>',
    target:
      '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/>' +
      '<circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    bolt:
      '<path d="M13 2.6 5.5 13.4H11l-1 8 7.5-10.8H12l1-8z"/>',
    chart:
      '<path d="M4 20h16"/>' +
      '<rect x="6" y="11" width="3" height="6.5" rx="1"/>' +
      '<rect x="10.5" y="7" width="3" height="10.5" rx="1"/>' +
      '<rect x="15" y="13.5" width="3" height="4" rx="1"/>',
    trophy:
      '<path d="M8 4.5h8V9a4 4 0 0 1-8 0V4.5z"/>' +
      '<path d="M8 6.2H5.6a2 2 0 0 0 1.9 3.9M16 6.2h2.4a2 2 0 0 1-1.9 3.9"/>' +
      '<path d="M12 13v3"/>' +
      '<path d="M9 20h6M9.5 20c0-1.4.9-2 2.5-2s2.5.6 2.5 2"/>',

    // Status / actions
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    circle: '<circle cx="12" cy="12" r="7.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    star:
      '<path d="M12 3.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88 6.8 19.6l.99-5.79-4.21-4.1 5.82-.85z"/>',
    'star-filled':
      '<path d="M12 3.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88 6.8 19.6l.99-5.79-4.21-4.1 5.82-.85z" fill="currentColor"/>',
    warning:
      '<path d="M12 4.2 21 19.2H3z"/><path d="M12 10v4"/>' +
      '<circle cx="12" cy="16.6" r="0.5" fill="currentColor" stroke="none"/>',
    lock:
      '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/>' +
      '<path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>' +
      '<path d="M12 14.5v2"/>'
  };

  function svg(name, opts) {
    const inner = PATHS[name];
    if (!inner) return '';
    const extra = opts && opts.className ? ' ' + opts.className : '';
    return (
      '<svg class="icon-svg' + extra + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      inner +
      '</svg>'
    );
  }

  function hydrate(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-icon]').forEach(function (el) {
      const name = el.getAttribute('data-icon');
      const markup = svg(name);
      if (markup) el.innerHTML = markup;
    });
  }

  global.Icons = { svg: svg, hydrate: hydrate, has: function (n) { return !!PATHS[n]; } };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }
})(window);
