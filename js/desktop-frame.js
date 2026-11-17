/* Keep the academic page's links inside the desktop browser when embedded. */
(function () {
  'use strict';
  if (window.parent === window) return;
  var base = new URL('.', window.location.href);
  var parentOrigin = base.protocol === 'file:' ? '*' : base.origin;
  function send(action, extra) {
    window.parent.postMessage(Object.assign({ channel: 'pengchao-desktop', action: action }, extra), parentOrigin);
  }
  document.addEventListener('pointerdown', function () { send('focus'); });
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.hasAttribute('download')) return;
    var url = new URL(link.href);
    if (!/^(https?:|file:)$/.test(url.protocol)) return;
    var internal = base.protocol === 'file:' ? url.protocol === 'file:' && url.pathname.startsWith(base.pathname) : url.origin === base.origin;
    if (!internal) { link.target = '_blank'; link.rel = 'noopener noreferrer'; return; }
    if (link.target === '_blank') return;
    event.preventDefault();
    if (link.classList.contains('desktop-return')) send('close');
    else send('navigate', { url: url.href });
  });
  send('ready', { url: window.location.href, title: document.title });
})();
