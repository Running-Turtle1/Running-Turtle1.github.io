/* Static desktop shell. Links to the academic homepage also work without JS. */
(function () {
  'use strict';

  var clock = document.getElementById('desktop-clock');
  function updateClock() {
    var now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('calendar-day').textContent = now.getDate();
  }
  updateClock();
  window.setInterval(updateClock, 30000);

  var desktop = document.querySelector('.desktop');
  var appName = document.getElementById('active-app');
  var menuButton = document.getElementById('system-button');
  var menu = document.getElementById('system-menu');
  var mobile = window.matchMedia('(max-width: 680px)');
  var windows = {};
  var activeId = null;
  var nextLayer = 5;

  document.body.classList.add('js-ready');
  menuButton.hidden = false;
  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  }
  menuButton.addEventListener('click', function () { setMenu(menu.hidden); });
  document.addEventListener('pointerdown', function (event) {
    if (!event.target.closest('#system-button, #system-menu')) setMenu(false);
  });

  function updateWindowState() {
    Object.keys(windows).forEach(function (id) {
      var entry = windows[id];
      if (entry.opener) entry.opener.setAttribute('aria-expanded', String(!entry.panel.hidden));
      entry.panel.dataset.active = String(activeId === id && !entry.panel.hidden);
    });
    appName.textContent = activeId ? windows[activeId].panel.dataset.appLabel : 'Pengchao Wei';
  }
  function focusWindow(id) {
    if (!windows[id] || windows[id].panel.hidden) return;
    if (activeId !== id) windows[id].panel.style.zIndex = ++nextLayer;
    activeId = id;
    updateWindowState();
  }
  function setPosition(panel, left, top) {
    var maxLeft = Math.max(0, desktop.clientWidth - panel.offsetWidth);
    var maxTop = Math.max(0, desktop.clientHeight - panel.offsetHeight);
    panel.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';
    panel.style.top = Math.max(0, Math.min(top, maxTop)) + 'px';
  }
  function containWindow(panel) {
    if (!mobile.matches && !panel.hidden && !panel.classList.contains('is-maximized')) {
      setPosition(panel, panel.offsetLeft, panel.offsetTop);
    }
  }
  function openWindow(id) {
    var entry = windows[id];
    if (!entry) return;
    var previousFocus = document.activeElement;
    if (previousFocus && previousFocus !== document.body && !entry.panel.contains(previousFocus)) entry.returnFocus = previousFocus;
    entry.panel.hidden = false;
    containWindow(entry.panel);
    setMenu(false);
    focusWindow(id);
    var focusTarget = entry.panel.querySelector('input') || entry.panel.querySelector('[data-window-action="close"]');
    focusTarget.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('desktop:windowchange', { detail: { id: id, action: 'open' } }));
  }
  function hideWindow(id, action) {
    var entry = windows[id];
    if (!entry) return;
    entry.panel.hidden = true;
    if (activeId === id) {
      activeId = null;
      var remaining = Object.keys(windows).filter(function (key) { return !windows[key].panel.hidden; });
      remaining.sort(function (a, b) { return Number(windows[b].panel.style.zIndex) - Number(windows[a].panel.style.zIndex); });
      if (remaining.length) focusWindow(remaining[0]);
    }
    updateWindowState();
    var returnFocus = entry.opener || entry.returnFocus;
    if (returnFocus && returnFocus.isConnected && !returnFocus.closest('[hidden]')) returnFocus.focus({ preventScroll: true });
    else menuButton.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('desktop:windowchange', { detail: { id: id, action: action } }));
  }

  document.querySelectorAll('[data-window]').forEach(function (panel) {
    var id = panel.dataset.window;
    var opener = document.querySelector('[data-open-window="' + id + '"]');
    var handle = panel.querySelector('.window-titlebar');
    var maximize = panel.querySelector('[data-window-action="maximize"]');
    var originalMaxLabel = maximize.getAttribute('aria-label');
    var drag = null;
    windows[id] = { panel: panel, opener: opener };
    panel.querySelector('.window-controls').hidden = false;
    if (opener) {
      opener.hidden = false;
      opener.addEventListener('click', function (event) { event.preventDefault(); openWindow(id); });
    }
    panel.addEventListener('pointerdown', function () { focusWindow(id); });
    panel.addEventListener('focusin', function () { focusWindow(id); });
    panel.querySelector('[data-window-action="minimize"]').addEventListener('click', function () { hideWindow(id, 'minimize'); });
    panel.querySelector('[data-window-action="close"]').addEventListener('click', function () { hideWindow(id, 'close'); });
    function toggleMaximize() {
      var isMaximized = panel.classList.toggle('is-maximized');
      maximize.setAttribute('aria-pressed', String(isMaximized));
      maximize.setAttribute('aria-label', isMaximized ? originalMaxLabel.replace('Maximize', 'Restore') : originalMaxLabel);
      maximize.title = isMaximized ? 'Restore' : 'Maximize';
      containWindow(panel);
    }
    maximize.addEventListener('click', toggleMaximize);
    handle.addEventListener('dblclick', function (event) {
      if (!event.target.closest('button')) toggleMaximize();
    });
    handle.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || mobile.matches || panel.classList.contains('is-maximized') || event.target.closest('button')) return;
      drag = { pointer: event.pointerId, x: event.clientX, y: event.clientY, left: panel.offsetLeft, top: panel.offsetTop };
      handle.setPointerCapture(event.pointerId);
      panel.classList.add('is-dragging');
      document.body.classList.add('is-dragging-window');
      event.preventDefault();
    });
    handle.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.pointer) return;
      setPosition(panel, drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
    });
    function endDrag() {
      drag = null;
      panel.classList.remove('is-dragging');
      document.body.classList.remove('is-dragging-window');
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
    handle.addEventListener('lostpointercapture', endDrag);
    window.addEventListener('resize', function () { endDrag(); containWindow(panel); });
    if (window.ResizeObserver) new window.ResizeObserver(function () { containWindow(panel); }).observe(panel);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (!menu.hidden) {
      setMenu(false);
      menuButton.focus();
    } else if (activeId && windows[activeId].panel.contains(document.activeElement)) {
      hideWindow(activeId, 'minimize');
    }
  });
  window.desktopWindows = { open: openWindow, close: function (id) { hideWindow(id, 'close'); }, focus: focusWindow };

  // Match the reference's once-per-session boot and plain desktop on return.
  var booted = false;
  try {
    booted = window.sessionStorage.getItem('pengchao-desktop-booted') === '1';
    window.sessionStorage.setItem('pengchao-desktop-booted', '1');
  } catch (error) { /* The desktop also works when storage is disabled. */ }
  windows.welcome.panel.hidden = booted;
  updateWindowState();
  if (!booted) focusWindow('welcome');
  var splash = document.getElementById('boot-screen');
  if (!booted && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    splash.hidden = false;
    var bootFinished = false;
    function finishBoot() {
      if (bootFinished) return;
      bootFinished = true;
      splash.classList.add('is-finished');
      window.setTimeout(function () { splash.hidden = true; }, 500);
      document.removeEventListener('pointerdown', finishBoot);
      document.removeEventListener('keydown', finishBoot);
    }
    window.setTimeout(finishBoot, 1500);
    document.addEventListener('pointerdown', finishBoot);
    document.addEventListener('keydown', finishBoot);
  }
})();
