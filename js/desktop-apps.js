/* Desktop files, previews and an embedded browser; external links use new tabs. */
(function () {
  'use strict';

  var manager = window.desktopWindows;
  var base = new URL('.', window.location.href);
  var homepage = new URL('homepage.html', base);
  var entrypoint = new URL('index.html', base);
  var folders = { home: ['Home', 5], papers: ['Publications', 1], projects: ['Projects', 5] };
  var documents = { prism: 'PRISM.pdf', tjudate: 'TJU Date.webloc' };
  var academicAnchors = ['bio', 'education', 'news', 'timeline', 'publications', 'project', 'codebase', 'awards', 'contests', 'competitions', 'languages', 'service'];
  var fileContent = document.getElementById('file-content');
  var frame = document.getElementById('desktop-frame');
  var browserPanel = document.getElementById('browser-window');
  var back = document.getElementById('browser-back');
  var forward = document.getElementById('browser-forward');
  var address = document.getElementById('browser-address');
  var external = document.getElementById('browser-external');
  var history = [];
  var historyIndex = -1;

  function internal(url) {
    if (url.protocol === 'file:') return base.protocol === 'file:' && url.pathname.startsWith(base.pathname);
    return /^https?:$/.test(url.protocol) && url.origin === base.origin;
  }
  function cloneTemplate(name) {
    return document.getElementById(name).content.cloneNode(true);
  }
  function openFiles(location) {
    if (!folders[location]) return;
    fileContent.replaceChildren(cloneTemplate('folder-' + location));
    document.getElementById('files-title').textContent = 'Files — ' + folders[location][0];
    var crumbs = document.getElementById('file-breadcrumb');
    crumbs.replaceChildren();
    (location === 'home' ? ['home'] : ['home', location]).forEach(function (folder, index) {
      if (index) crumbs.appendChild(document.createTextNode(' › '));
      var button = document.createElement('button');
      button.type = 'button';
      button.dataset.files = folder;
      button.textContent = folders[folder][0];
      if (folder === location) button.setAttribute('aria-current', 'location');
      crumbs.appendChild(button);
    });
    document.querySelectorAll('.file-sidebar [data-files]').forEach(function (button) {
      if (button.dataset.files === location) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('file-status').textContent = folders[location][1] + (folders[location][1] === 1 ? ' item' : ' items');
    manager.open('files');
  }
  function openDocument(id) {
    if (!documents[id]) return;
    document.getElementById('document-content').replaceChildren(cloneTemplate('document-' + id));
    document.getElementById('document-title').textContent = documents[id] + ' — Document Viewer';
    manager.open('document');
  }
  function syncBrowser() {
    var url = history[historyIndex];
    back.disabled = historyIndex <= 0;
    forward.disabled = historyIndex >= history.length - 1;
    if (!url) return;
    var parsed = new URL(url);
    address.textContent = parsed.protocol === 'file:' ? parsed.pathname.slice(base.pathname.length) + parsed.search + parsed.hash : parsed.host + parsed.pathname + parsed.search + parsed.hash;
    address.title = url;
    external.href = url;
  }
  function loadFrame(url) {
    // replace() keeps the desktop tab's Back button out of the iframe history.
    try { frame.contentWindow.location.replace(url); }
    catch (error) { frame.src = url; }
  }
  function browserGo(url, record) {
    if (record && history[historyIndex] !== url) {
      history = history.slice(0, historyIndex + 1);
      history.push(url);
      historyIndex = history.length - 1;
    }
    syncBrowser();
    loadFrame(url);
  }
  function openBrowser(raw) {
    var url = new URL(raw, base);
    if (!internal(url)) return;
    manager.open('browser');
    if (history[historyIndex] !== url.href) browserGo(url.href, true);
  }
  back.addEventListener('click', function () {
    if (historyIndex > 0) { historyIndex--; browserGo(history[historyIndex], false); }
  });
  forward.addEventListener('click', function () {
    if (historyIndex < history.length - 1) { historyIndex++; browserGo(history[historyIndex], false); }
  });
  document.getElementById('browser-reload').addEventListener('click', function () {
    if (historyIndex >= 0) loadFrame(history[historyIndex]);
  });

  function navigate(raw) {
    if (raw === 'home' || raw === 'files') return openFiles('home');
    if (raw === 'papers' || raw === 'publications') return openFiles('papers');
    if (raw === 'projects' || raw === 'project') return openFiles('projects');
    if (['news', 'welcome', 'code'].includes(raw)) return manager.open(raw);
    var url;
    try { url = new URL(raw, base); } catch (error) { return; }
    if (!internal(url)) return;
    if (url.pathname === homepage.pathname || url.pathname === entrypoint.pathname || url.pathname === base.pathname) {
      if (url.hash === '#publications') return openFiles('papers');
      if (url.hash === '#project' || url.hash === '#codebase') return openFiles('projects');
      if (url.hash === '#news') return manager.open('news');
      if (url.pathname !== homepage.pathname) url = new URL('homepage.html' + url.hash, base);
    }
    openBrowser(url.href);
  }

  function routeClick(event, fromFrame) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var target = event.target.closest && event.target.closest('[data-files], [data-document], [data-desktop-app], a[href]');
    if (!target) return;
    if (!fromFrame) {
      if (target.dataset.files) { event.preventDefault(); return openFiles(target.dataset.files); }
      if (target.dataset.document) { event.preventDefault(); return openDocument(target.dataset.document); }
      if (target.dataset.desktopApp) { event.preventDefault(); return manager.open(target.dataset.desktopApp); }
    }
    if (!target.matches('a[href]') || target.hasAttribute('download')) return;
    var url = new URL(target.href);
    if (!/^(https?:|file:)$/.test(url.protocol)) return;
    if (!internal(url)) { target.target = '_blank'; target.rel = 'noopener noreferrer'; return; }
    if (target.target === '_blank') return;
    event.preventDefault();
    if (fromFrame) {
      if (target.classList.contains('desktop-return') || url.pathname === entrypoint.pathname || (url.pathname === base.pathname && !url.hash)) return manager.close('browser');
      return browserGo(url.href, true);
    }
    if (target.hasAttribute('data-browser-page')) return openBrowser(url.href);
    navigate(url.href);
  }
  document.addEventListener('click', function (event) { routeClick(event, false); });

  // Ordinary same-origin pages need no special integration. The homepage also
  // includes a small message bridge so embedded links work in local file previews.
  frame.addEventListener('load', function () {
    if (browserPanel.hidden || historyIndex < 0) return;
    try {
      var doc = frame.contentDocument;
      if (!doc || doc.URL === 'about:blank') return;
      var actual = new URL(doc.URL);
      if (internal(actual)) {
        history[historyIndex] = actual.href;
        syncBrowser();
        document.getElementById('browser-title').textContent = doc.title || 'Web Browser';
      }
      doc.addEventListener('click', function (event) { routeClick(event, true); });
      doc.addEventListener('pointerdown', function () { manager.focus('browser'); });
    } catch (error) { /* File previews can use the message bridge instead. */ }
  });
  window.addEventListener('message', function (event) {
    if (event.source !== frame.contentWindow || browserPanel.hidden || historyIndex < 0) return;
    if (event.origin !== base.origin && !(base.protocol === 'file:' && event.origin === 'null')) return;
    var data = event.data;
    if (!data || data.channel !== 'pengchao-desktop') return;
    if (data.action === 'focus') return manager.focus('browser');
    if (data.action === 'close') return manager.close('browser');
    if (typeof data.url !== 'string') return;
    var url;
    try { url = new URL(data.url); } catch (error) { return; }
    if (!internal(url)) return;
    if (data.action === 'navigate') browserGo(url.href, true);
    if (data.action === 'ready') {
      history[historyIndex] = url.href;
      syncBrowser();
      document.getElementById('browser-title').textContent = typeof data.title === 'string' ? data.title : 'Web Browser';
    }
  });
  document.addEventListener('desktop:windowchange', function (event) {
    if (event.detail.id === 'browser' && event.detail.action === 'close') {
      history = [];
      historyIndex = -1;
      frame.src = 'about:blank';
      address.textContent = '';
      syncBrowser();
    }
  });
  function openLegacyAnchor() {
    if (academicAnchors.includes(window.location.hash.slice(1))) navigate('homepage.html' + window.location.hash);
  }
  window.desktopNavigation = { open: navigate, files: openFiles, browser: openBrowser, document: openDocument };
  window.addEventListener('hashchange', openLegacyAnchor);
  openLegacyAnchor();
})();
