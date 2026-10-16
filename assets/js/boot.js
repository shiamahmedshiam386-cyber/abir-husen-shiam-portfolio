/* =========================================================
   PORTFOLIO — BOOT
   The pages ship pre-rendered (fast + visible to Google).
   This asks the server whether the Admin Panel has saved
   anything newer, and if so re-renders in place.
   ========================================================= */
(function () {
  'use strict';

  var page = (location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html');
  if (!/\.html$/.test(page)) page = 'index.html';

  /* Kick the request off straight away, in parallel with page load. */
  var pending = fetch('/api/content', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; });

  function applyTheme(d) {
    var tag = document.getElementById('ak-theme');
    if (!tag) { tag = document.createElement('style'); tag.id = 'ak-theme'; document.head.appendChild(tag); }
    tag.textContent = window.AKRender.themeCss(d);
  }

  /* The favicon and the preloader sit outside #ak-app, so they are updated
     on their own whenever the server has a logo saved. */
  function applyBrand(d) {
    var s = (d && d.site) || {};
    var logo = String(s.logo_image || '').trim();
    var icon = String(s.favicon || '').trim() || logo;

    if (icon) {
      var link = document.getElementById('ak-favicon');
      if (!link) {
        link = document.createElement('link');
        link.id = 'ak-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      if (link.getAttribute('href') !== icon) link.setAttribute('href', icon);
    }

    var pre = document.getElementById('preMark');
    if (pre && logo && !pre.querySelector('img')) {
      pre.className = 'preloader__mark preloader__mark--img';
      pre.innerHTML = '<img src="" alt="" />';
      pre.firstChild.src = logo;
    }
  }

  function repaint(d) {
    var host = document.getElementById('ak-app');
    if (!host) return;
    applyTheme(d);
    host.innerHTML = window.AKRender.app(page, d);
    var t = window.AKRender.title(page, d);
    if (t) document.title = t;
  }

  function start(refresh) {
    if (window.AKSite) window.AKSite.init({ refresh: !!refresh });
  }

  /* Give the server a short moment, so a changed page doesn't flash
     the old content first. If it's slow, show what we have and
     repaint quietly when the answer arrives. */
  var settled = false;

  function handle(res, late) {
    if (settled && !late) return;
    settled = true;
    if (res && res.content) { try { applyBrand(res.content); } catch (err) { /* noop */ } }
    var changed = res && res.content && res.ver && res.ver !== window.AK_VER;
    if (changed) {
      try { repaint(res.content); } catch (err) { /* keep static content */ }
      start(!!late);
      window.AK_VER = res.ver;
    } else {
      start(!!late);
    }
  }

  pending.then(function (res) {
    if (settled) {
      /* Arrived after we already started — repaint only if needed. */
      if (res && res.content) { try { applyBrand(res.content); } catch (err) { /* noop */ } }
      if (res && res.content && res.ver && res.ver !== window.AK_VER) {
        try {
          repaint(res.content);
          window.AK_VER = res.ver;
          if (window.AKSite) window.AKSite.init({ refresh: true });
        } catch (err) { /* noop */ }
      }
      return;
    }
    handle(res, false);
  });

  setTimeout(function () { if (!settled) { settled = true; start(false); } }, 700);
})();
