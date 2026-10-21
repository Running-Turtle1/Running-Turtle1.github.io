(function () {
  async function fetchJson(url) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 8000);
    try {
      var response = await fetch(url, {
        credentials: 'omit',
        cache: 'no-cache',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Request failed: ' + response.status);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function validateCount(count) {
    if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid star count');
    return count;
  }

  async function fetchStars(repo) {
    try {
      var data = await fetchJson('https://api.github.com/repos/' + repo);
      return validateCount(data.stargazers_count);
    } catch (error) {
      // Shields can still serve counts when GitHub rejects this visitor's IP.
      var badge = await fetchJson('https://img.shields.io/github/stars/' + repo + '.json');
      var value = String(badge.value || badge.message);
      // Never turn an error badge or an abbreviated value such as "1.2k" into a count.
      if (!/^(\d+|\d{1,3}(,\d{3})+)$/.test(value)) throw new Error('Invalid backup star count');
      return validateCount(Number(value.replace(/,/g, '')));
    }
  }

  document.querySelectorAll('[data-github-repo]').forEach(async function (element) {
    var repo = element.getAttribute('data-github-repo');
    var cacheKey = 'github-stars:' + repo;
    var pill = element.closest('.github-star-pill');

    function displayCount(count) {
      element.textContent = String(count);
      pill.setAttribute('aria-label', repo + ': ' + count + ' GitHub stars');
    }

    // Cache is only an initial display; always revalidate on each page load.
    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Number.isSafeInteger(cached.count) && cached.count >= 0) {
        displayCount(cached.count);
      }
    } catch (error) {
      // Storage may be unavailable; the public API still works without it.
    }

    try {
      var count = await fetchStars(repo);
      displayCount(count);
      pill.removeAttribute('title');
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          count: count,
          updatedAt: Date.now()
        }));
      } catch (error) {
        // Keep the fresh count visible when browser storage is disabled or full.
      }
    } catch (error) {
      // Keep the cached or HTML fallback count if GitHub cannot be reached.
      pill.setAttribute('title', 'Unable to update; showing the last saved count.');
    }
  });
})();
