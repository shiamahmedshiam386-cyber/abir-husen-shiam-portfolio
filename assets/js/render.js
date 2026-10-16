/* =========================================================
   PORTFOLIO — SHARED RENDERER
   The same file runs in Node (to pre-build the static pages,
   which is what Google sees) and in the browser (to re-render
   with whatever the Admin Panel has saved).
   One renderer, so the two can never drift apart.
   ========================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AKRender = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  function e(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Long-form copy: keep a few inline tags, strip anything active. */
  function rich(v) {
    var s = String(v == null ? '' : v);
    s = s.replace(/<(?!\/?(strong|em|b|i|br|a)\b)[^>]*>/gi, '');
    s = s.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    s = s.replace(/javascript\s*:/gi, '');
    return s;
  }

  function url(v) {
    v = String(v == null ? '' : v).trim();
    if (!v) return '#';
    if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v)) return e(v);
    return e('https://' + v);
  }

  function hex(v, fb) {
    return /^#[0-9a-fA-F]{6}$/.test(String(v || '').trim()) ? v.trim() : fb;
  }

  function img(p, fb) {
    p = String(p || '').trim();
    return e(p || fb || 'assets/img/portrait.svg');
  }

  function digits(v) { return String(v || '').replace(/\D+/g, ''); }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------------- icons ---------------- */
  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" fill="currentColor"/></svg>',
    google:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2"/><path d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="currentColor" stroke-width="2"/></svg>',
    tiktok:   '<svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3c.4 2.2 1.9 3.8 4 4.1v3c-1.5.1-2.9-.3-4.2-1.1v5.9a5.9 5.9 0 11-5.2-5.9v3.1a2.8 2.8 0 102.3 2.8V3h3.1z" fill="currentColor"/></svg>',
    youtube:  '<svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5" width="19" height="14" rx="4" stroke="currentColor" stroke-width="2"/><path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor"/></svg>',
    social:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="8" r="3" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="7" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M2.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 18c0-2.5 1.4-4 3-4s3 1.5 3 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    shopify:  '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1.3 12.2a2 2 0 01-2 1.8H8.3a2 2 0 01-2-1.8L5 7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 016 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    search:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4.5-4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chart:    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    email:    '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.9"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    star:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8L12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };
  function icon(k) { return ICONS[k] || ICONS.chart; }

  var SOCIAL = {
    facebook:  '<svg viewBox="0 0 24 24"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
    linkedin:  '<svg viewBox="0 0 24 24"><path d="M6.9 8.2H4V20h2.9V8.2zM5.4 3.5A1.7 1.7 0 103.7 5.2 1.7 1.7 0 005.4 3.5zM20 13.4c0-3.2-1.7-4.7-4-4.7a3.5 3.5 0 00-3.1 1.7V8.2H10V20h2.9v-6.2c0-1.6.3-3.2 2.3-3.2s2 1.8 2 3.3V20H20z"/></svg>',
    youtube:   '<svg viewBox="0 0 24 24"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5A2.5 2.5 0 002.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 001.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 001.8-1.8C22 15.2 22 12 22 12zM10 15V9l5.2 3L10 15z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0-2a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM17.8 6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zM12 4c-2.5 0-2.8 0-3.8.1-1 0-1.5.2-1.9.3-.5.2-.8.4-1.2.8s-.6.7-.8 1.2c-.1.4-.3.9-.3 1.9C4 9.2 4 9.5 4 12s0 2.8.1 3.8c0 1 .2 1.5.3 1.9.2.5.4.8.8 1.2s.7.6 1.2.8c.4.1.9.3 1.9.3 1 .1 1.3.1 3.8.1s2.8 0 3.8-.1c1 0 1.5-.2 1.9-.3.5-.2.8-.4 1.2-.8s.6-.7.8-1.2c.1-.4.3-.9.3-1.9.1-1 .1-1.3.1-3.8s0-2.8-.1-3.8c0-1-.2-1.5-.3-1.9a3.3 3.3 0 00-.8-1.2 3.3 3.3 0 00-1.2-.8c-.4-.1-.9-.3-1.9-.3C14.8 4 14.5 4 12 4z"/></svg>',
    whatsapp:  '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6 0a6.6 6.6 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2a.5.5 0 000-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 006 10c0 1.7 1.3 3.4 1.4 3.6a10 10 0 004 3.5c1.4.6 2 .6 2.7.5a2.5 2.5 0 001.6-1.2 2 2 0 00.2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  /* ---------------- theme ---------------- */
  function themeCss(d) {
    var t = d.theme || {};
    var c1 = hex(t.c1, '#35E0F0'), c2 = hex(t.c2, '#7B5CFF'),
        c3 = hex(t.c3, '#FF7A59'), bg = hex(t.bg, '#070A12');
    function rgb(h) { return [parseInt(h.substr(1,2),16), parseInt(h.substr(3,2),16), parseInt(h.substr(5,2),16)].join(','); }
    return ':root{--c1:' + c1 + ';--c2:' + c2 + ';--c3:' + c3 + ';--bg:' + bg + ';' +
           '--c1-rgb:' + rgb(c1) + ';--c2-rgb:' + rgb(c2) + ';--c3-rgb:' + rgb(c3) + ';' +
           '--grad:linear-gradient(115deg,' + c1 + ' 0%,' + c2 + ' 60%,' + c3 + ' 120%);' +
           '--grad-2:linear-gradient(120deg,' + c1 + ',' + c2 + ');}';
  }

  /* ---------------- shared chrome ---------------- */
  var NAV = [
    ['index.html', 'Home'], ['services.html', 'Services'], ['portfolio.html', 'My Work'],
    ['about.html', 'About Me'], ['testimonials.html', 'Testimonials'], ['contact.html', 'Contact']
  ];

  /** The logo: an uploaded image when there is one, otherwise the initials. */
  function brandMark(d) {
    var s = d.site || {};
    var logo = String(s.logo_image || '').trim();
    if (!logo) return '<span class="brand__mark">' + e(s.brand_mark) + '</span>';
    return '<span class="brand__mark brand__mark--img">' +
      '<img src="' + img(logo) + '" alt="' + e((s.brand_first || '') + ' ' + (s.brand_last || '')) + '" /></span>';
  }

  function brand(d) {
    var s = d.site || {};
    return '<a href="index.html" class="brand" data-cursor="link">' + brandMark(d) +
      '<span class="brand__text">' + e(s.brand_first) + '&nbsp;<strong>' + e(s.brand_last) + '</strong></span></a>';
  }

  function nav(d, current) {
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '" class="nav__link' + (n[0] === current ? ' is-active' : '') + '" data-cursor="link">' + e(n[1]) + '</a>';
    }).join('');
    return '<header class="nav" id="nav"><div class="container nav__inner">' + brand(d) +
      '<nav class="nav__links" id="navLinks">' + links +
      '<a href="contact.html" class="btn btn--sm btn--primary nav__cta" data-cursor="link">Let\'s Talk</a></nav>' +
      '<button class="nav__burger" id="navBurger" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '</div></header>';
  }

  function socialLinks(d) {
    var ct = d.contact || {}, out = '';
    ['facebook', 'linkedin', 'youtube', 'instagram'].forEach(function (k) {
      if (!String(ct[k] || '').trim()) return;
      out += '<a href="' + url(ct[k]) + '" aria-label="' + e(k) + '" target="_blank" rel="noopener" data-cursor="link">' + SOCIAL[k] + '</a>';
    });
    var wa = digits(ct.whatsapp);
    if (wa) out += '<a href="https://wa.me/' + e(wa) + '" aria-label="WhatsApp" target="_blank" rel="noopener" data-cursor="link">' + SOCIAL.whatsapp + '</a>';
    return out;
  }

  function footer(d) {
    var s = d.site || {}, ct = d.contact || {};
    var quick = NAV.map(function (n) { return '<li><a href="' + n[0] + '" data-cursor="link">' + e(n[1]) + '</a></li>'; }).join('');
    var svc = (d.services || []).map(function (x) { return '<li><a href="services.html" data-cursor="link">' + e(x.title) + '</a></li>'; }).join('');

    var contact = '';
    if (ct.email) contact += '<li>' + icon('email') + '<a href="mailto:' + e(ct.email) + '" data-cursor="link">' + e(ct.email) + '</a></li>';
    if (ct.phone) contact += '<li><svg viewBox="0 0 24 24" fill="none"><path d="M4 6c0-1 .9-2 2-2h1.6c.5 0 1 .4 1.1.9l.7 2.8c.1.5-.1 1-.5 1.2l-1.4.9a12 12 0 005.7 5.7l.9-1.4c.3-.4.7-.6 1.2-.5l2.8.7c.5.1.9.6.9 1.1V18c0 1.1-.9 2-2 2A14 14 0 014 6z" stroke="currentColor" stroke-width="1.8"/></svg>' +
      '<a href="tel:' + e(String(ct.phone).replace(/[^\d+]/g, '')) + '" data-cursor="link">' + e(ct.phone) + '</a></li>';

    /* Owner's way in — sits with the contact details, not in the bottom bar. */
    contact += '<li class="footer__admin-li"><a href="admin/" class="footer__admin" data-cursor="link">' +
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5-4-1.2-7-5.1-7-9.5V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="11" r="1.6" fill="currentColor"/><path d="M12 12.8V15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
      'Admin Panel</a></li>';

    return '<footer class="footer"><div class="container"><div class="footer__grid">' +
      '<div class="footer__col footer__col--brand">' + brand(d) +
        '<p class="footer__about">' + e(s.footer_about) + '</p>' +
        '<div class="footer__socials">' + socialLinks(d) + '</div></div>' +
      '<div class="footer__col"><h4 class="footer__title">Quick Links</h4><ul class="footer__links">' + quick + '</ul></div>' +
      '<div class="footer__col"><h4 class="footer__title">Services</h4><ul class="footer__links">' + svc + '</ul></div>' +
      '<div class="footer__col"><h4 class="footer__title">Get in Touch</h4><ul class="footer__contact">' + contact + '</ul></div>' +
      '</div><div class="footer__bottom">' +
      '<p>&copy; ' + new Date().getFullYear() + ' ' + e(s.copyright) + '</p>' +
      '</div></div></footer>' +
      '<a href="#top" class="to-top" id="toTop" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
  }

  function pageHero(crumb, eyebrow, ta, tb, intro) {
    return '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
      '<nav class="crumbs reveal" aria-label="Breadcrumb"><a href="index.html">Home</a><i>/</i><span>' + e(crumb) + '</span></nav>' +
      '<span class="eyebrow reveal" data-delay="0.04">' + e(eyebrow) + '</span>' +
      '<h1 class="page-hero__title reveal" data-delay="0.08"><span class="line">' + e(ta) + '</span><span class="line grad">' + e(tb) + '</span></h1>' +
      (String(intro || '').trim() ? '<p class="page-hero__intro reveal" data-delay="0.14">' + e(intro) + '</p>' : '') +
      '</div></div></section>';
  }

  function cta(d, eyebrow, ta, tb, text, button, secondHref, secondLabel) {
    var email = (d.contact || {}).email || '';
    var second = secondHref
      ? '<a href="' + e(secondHref) + '" class="btn btn--ghost btn--lg magnetic" data-cursor="link"><span>' + e(secondLabel) + '</span></a>'
      : (email ? '<a href="mailto:' + e(email) + '" class="btn btn--ghost btn--lg magnetic" data-cursor="link"><span>' + e(email) + '</span></a>' : '');
    return '<section class="section" id="start" style="padding-top:20px"><div class="container">' +
      '<div class="cta__box reveal"><div class="cta__glow"></div>' +
      '<span class="eyebrow">' + e(eyebrow) + '</span>' +
      '<h2 class="cta__title">' + e(ta) + '<br><span class="grad">' + e(tb) + '</span></h2>' +
      '<p class="cta__text">' + e(text) + '</p>' +
      '<div class="cta__actions"><a href="contact.html" class="btn btn--primary btn--lg magnetic" data-cursor="link"><span>' +
      e(button || 'Book a Free Strategy Call') + '</span>' + ARROW + '</a>' + second + '</div>' +
      '<div class="cta__note"><span class="pill__dot"></span> Available for new projects</div>' +
      '</div></div></section>';
  }

  /* ---------------- pages ---------------- */
  function home(d) {
    var h = d.home || {}, ct = d.contact || {};
    var out = '<main>';

    /* hero */
    out += '<section class="hero" id="home"><div class="container hero__grid"><div class="hero__content">';
    if (String(h.pill || '').trim()) out += '<div class="pill reveal" data-delay="0"><span class="pill__dot"></span> ' + e(h.pill) + '</div>';
    out += '<h1 class="hero__title"><span class="line">' + e(h.heading) + '</span></h1>';
    out += '<div class="hero__role reveal" data-delay="0.1"><span class="hero__role-static">' + e(h.role_static) + '</span>' +
           '<span class="hero__role-sep"></span><span class="hero__role-rotate" id="roleRotate">' +
           (h.roles || []).map(function (r) { return '<span>' + e(r) + '</span>'; }).join('') + '</span></div>';
    out += '<p class="hero__tagline reveal" data-delay="0.18">&ldquo;' + e(h.tagline_a) + ' <span class="grad">' + e(h.tagline_b) + '</span>&rdquo;</p>';
    out += '<p class="hero__intro reveal" data-delay="0.26">' + e(h.intro) + '</p>';
    out += '<div class="hero__actions reveal" data-delay="0.34">' +
           '<a href="portfolio.html" class="btn btn--primary magnetic" data-cursor="link"><span>View My Work</span>' + ARROW + '</a>' +
           '<a href="contact.html" class="btn btn--ghost magnetic" data-cursor="link"><span>Hire Me</span></a></div>';
    var soc = socialLinks(d);
    if (soc) out += '<div class="hero__socials reveal" data-delay="0.42"><span class="hero__socials-label">Follow</span>' + soc + '</div>';
    out += '</div>';

    out += '<div class="hero__visual"><div class="portrait" data-tilt>' +
      '<div class="portrait__glow"></div><div class="portrait__ring"></div>' +
      '<div class="portrait__frame"><img src="' + img(h.hero_image) + '" alt="' + e(h.heading) + '" class="portrait__img" /><div class="portrait__shade"></div></div>';
    var fc = h.float_cards || [];
    if (fc[0]) out += '<div class="float-card float-card--roi"><div class="float-card__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 18l5-6 4 4 7-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><strong>' + e(fc[0].value) + '</strong><small>' + e(fc[0].label) + '</small></div></div>';
    if (fc[1]) out += '<div class="float-card float-card--rank"><div class="float-card__icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div><strong>' + e(fc[1].value) + '</strong><small>' + e(fc[1].label) + '</small></div></div>';
    out += '</div></div></div>';
    out += '<a href="#stats" class="scroll-hint" aria-label="Scroll down"><span class="scroll-hint__mouse"><i></i></span><span class="scroll-hint__text">Scroll</span></a></section>';

    /* stats */
    if ((h.stats || []).length) {
      out += '<section class="section section--tight stats" id="stats"><div class="container"><div class="stats__grid glass">';
      h.stats.forEach(function (st, i) {
        var val = String(st.value || ''), dot = val.indexOf('.');
        var dec = dot > -1 ? val.length - dot - 1 : 0;
        out += '<div class="stat reveal" data-delay="' + (i * 0.08).toFixed(2) + '"><div class="stat__num">' +
          (String(st.prefix || '').trim() ? '<em class="pre">' + e(st.prefix) + '</em>' : '') +
          '<span class="count" data-target="' + e(val) + '"' + (dec ? ' data-decimals="' + dec + '"' : '') + '>0</span>' +
          (String(st.suffix || '').trim() ? '<em>' + e(st.suffix) + '</em>' : '') +
          '</div><div class="stat__label">' + e(st.label) + '</div></div>';
      });
      out += '</div></div></section>';
    }

    /* services */
    out += '<section class="section services" id="services"><div class="container"><div class="section__head">' +
      '<span class="eyebrow reveal">' + e(h.services_eyebrow) + '</span>' +
      '<h2 class="section__title reveal" data-delay="0.06">' + e(h.services_title_a) + ' <span class="grad">' + e(h.services_title_b) + '</span></h2>' +
      '<p class="section__sub reveal" data-delay="0.12">' + e(h.services_sub) + '</p></div><div class="services__grid">';
    (d.services || []).forEach(function (s, i) {
      out += '<article class="card card--service spotlight reveal" data-delay="' + (i * 0.07).toFixed(2) + '" data-cursor="view">' +
        '<div class="card__icon">' + icon(s.icon) + '</div>' +
        '<h3 class="card__title">' + e(s.title) + '</h3>' +
        '<p class="card__text">' + e(s.desc) + '</p><ul class="card__list">' +
        (s.items || []).slice(0, 3).map(function (it) { return '<li>' + e(it) + '</li>'; }).join('') +
        '</ul><a href="services.html" class="card__link" data-cursor="link">Learn more <i>&rarr;</i></a></article>';
    });
    out += '</div></div></section>';

    /* featured work */
    out += '<section class="section work" id="work"><div class="container"><div class="section__head section__head--split"><div>' +
      '<span class="eyebrow reveal">' + e(h.work_eyebrow) + '</span>' +
      '<h2 class="section__title reveal" data-delay="0.06">' + e(h.work_title_a) + ' <span class="grad">' + e(h.work_title_b) + '</span></h2></div>' +
      '<p class="section__sub reveal" data-delay="0.12">' + e(h.work_sub) + '</p></div><div class="work__grid">';
    (d.projects || []).slice(0, 4).forEach(function (p, i) {
      out += '<article class="work-card reveal" data-delay="' + (i * 0.08).toFixed(2) + '" data-cursor="view">' +
        '<div class="work-card__media"><img src="' + img(p.image, 'assets/img/proj-1.svg') + '" alt="' + e(p.title) + '" loading="lazy" />' +
        '<div class="work-card__overlay"><span class="work-card__cta">View Project <i>&rarr;</i></span></div>' +
        '<a href="portfolio.html" class="work-card__hit" aria-label="' + e(p.title) + '"></a></div>' +
        '<div class="work-card__body"><h3 class="work-card__title">' + e(p.title) + '</h3>' +
        '<p class="work-card__text">' + e(p.text) + '</p></div></article>';
    });
    out += '</div><div class="work__action reveal"><a href="portfolio.html" class="btn btn--primary magnetic" data-cursor="link"><span>View Full Portfolio</span>' + ARROW + '</a></div></div></section>';

    /* about teaser */
    out += '<section class="section about" id="about"><div class="container about__grid">' +
      '<div class="about__visual reveal"><div class="about__img-wrap">' +
      '<img src="' + img(h.about_image, 'assets/img/about.svg') + '" alt="' + e(h.heading) + '" />' +
      '<div class="about__badge glass"><strong>' + e(h.about_badge_num) + '</strong><span>' + rich(h.about_badge_text) + '</span></div>' +
      '</div></div><div class="about__content">' +
      '<span class="eyebrow reveal">' + e(h.about_eyebrow) + '</span>' +
      '<h2 class="section__title reveal" data-delay="0.06">' + e(h.about_title_a) + ' <span class="grad">' + e(h.about_title_b) + '</span></h2>';
    (h.about_paras || []).forEach(function (p, i) {
      out += '<p class="about__text reveal" data-delay="' + (0.12 + i * 0.06).toFixed(2) + '">' + rich(p) + '</p>';
    });
    out += '<ul class="about__points">' + (h.about_points || []).map(function (pt, i) {
      return '<li class="reveal" data-delay="' + (0.24 + i * 0.04).toFixed(2) + '"><i></i> ' + e(pt) + '</li>';
    }).join('') + '</ul>' +
      '<div class="about__action reveal" data-delay="0.42"><a href="about.html" class="btn btn--ghost magnetic" data-cursor="link"><span>Learn More About Me</span>' + ARROW + '</a></div>' +
      '</div></div></section>';

    /* tools */
    out += '<section class="section tools" id="tools"><div class="container"><div class="section__head">' +
      '<span class="eyebrow reveal">' + e(h.tools_eyebrow) + '</span>' +
      '<h2 class="section__title reveal" data-delay="0.06">' + e(h.tools_title_a) + ' <span class="grad">' + e(h.tools_title_b) + '</span> ' + e(h.tools_title_c) + '</h2>' +
      '<p class="section__sub reveal" data-delay="0.12">' + e(h.tools_sub) + '</p></div><div class="tools__grid">';
    (h.tools || []).forEach(function (t, i) {
      out += '<div class="tool reveal" data-delay="' + (i * 0.04).toFixed(2) + '"><span class="tool__icon">' +
        e(String(t.icon || t.name || '').charAt(0)) + '</span> ' + e(t.name) + '</div>';
    });
    out += '</div>';
    if ((h.marquee || []).length) {
      var row = h.marquee.map(function (m) { return '<span>' + e(m) + '</span><i>&#10022;</i>'; }).join('');
      out += '<div class="marquee reveal"><div class="marquee__track">' + row + row + '</div></div>';
    }
    out += '</div></section>';

    /* testimonials slider */
    if ((d.testimonials || []).length) {
      out += '<section class="section testimonials" id="testimonials"><div class="container"><div class="section__head">' +
        '<span class="eyebrow reveal">Testimonials</span>' +
        '<h2 class="section__title reveal" data-delay="0.06">What <span class="grad">Clients Say</span></h2></div>' +
        '<div class="slider reveal" id="slider"><div class="slider__viewport"><div class="slider__track" id="sliderTrack">';
      d.testimonials.slice(0, 4).forEach(function (t) {
        out += '<div class="slide"><article class="quote glass"><div class="quote__mark">&rdquo;</div>' +
          '<p class="quote__text">' + e(t.text) + '</p>' +
          '<div class="quote__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div class="quote__author">' +
          '<div class="quote__avatar" style="--a:' + hex(t.a, '#35E0F0') + ';--b:' + hex(t.b, '#7B5CFF') + '">' + e(t.initials) + '</div>' +
          '<div><strong>' + e(t.name) + '</strong><small>' + e(t.role) + '</small></div></div></article></div>';
      });
      out += '</div></div><div class="slider__nav">' +
        '<button class="slider__btn" id="prevBtn" aria-label="Previous testimonial" data-cursor="link"><svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<div class="slider__dots" id="sliderDots"></div>' +
        '<button class="slider__btn" id="nextBtn" aria-label="Next testimonial" data-cursor="link"><svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '</div></div><div class="work__action reveal"><a href="testimonials.html" class="btn btn--ghost magnetic" data-cursor="link"><span>Read All Testimonials</span>' + ARROW + '</a></div>' +
        '</div></section>';
    }

    out += cta(d, h.cta_eyebrow, h.cta_title_a, h.cta_title_b, h.cta_text, h.cta_button);
    return out + '</main>';
  }

  function services(d) {
    var p = d.services_page || {};
    var out = '<main>' + pageHero('Services', p.eyebrow, p.title_a, p.title_b, p.intro);
    out += '<section class="section" id="all-services" style="padding-top:0"><div class="container"><div class="svc-grid">';
    (d.services || []).forEach(function (s, i) {
      out += '<article class="svc-card reveal" data-delay="' + (i * 0.06).toFixed(2) + '" data-cursor="view">' +
        '<div class="svc-card__top"><div class="svc-card__icon">' + icon(s.icon) + '</div>' +
        (String(s.category || '').trim() ? '<span class="svc-card__cat">' + e(s.category) + '</span>' : '') + '</div>' +
        '<h2 class="svc-card__title">' + e(s.title) + '</h2>' +
        '<p class="svc-card__text">' + e(s.desc) + '</p>';
      if ((s.items || []).length) {
        out += '<div class="svc-card__label">What\'s Included</div><ul class="svc-card__list">' +
          s.items.map(function (it) { return '<li>' + e(it) + '</li>'; }).join('') + '</ul>';
      }
      out += '<div class="svc-card__foot"><span class="svc-card__note">' + e(s.note) + '</span>' +
        '<a href="contact.html" class="btn btn--primary magnetic" data-cursor="link"><span>Get Started</span>' + ARROW + '</a>' +
        '</div></article>';
    });
    out += '</div></div></section>';
    out += cta(d, 'Get Started', p.cta_title_a, p.cta_title_b, p.cta_text);
    return out + '</main>';
  }

  function portfolio(d) {
    var p = d.portfolio_page || {};
    var out = '<main>' + pageHero('My Work', p.eyebrow, p.title_a, p.title_b, p.intro);
    out += '<section class="section" id="work" style="padding-top:0"><div class="container">';
    var list = d.projects || [];
    if (!list.length) {
      out += '<p class="section__sub">No projects yet.</p>';
    } else {
      out += '<div class="shot-grid">';
      list.forEach(function (pr, i) {
        out += '<article class="shot reveal" data-delay="' + ((i % 3) * 0.06).toFixed(2) + '" tabindex="0" role="button"' +
          ' aria-label="View screenshot: ' + e(pr.title) + '"' +
          ' data-full="' + img(pr.image, 'assets/img/proj-1.svg') + '"' +
          ' data-title="' + e(pr.title) + '" data-text="' + e(pr.text) + '">' +
          '<div class="shot__media"><img src="' + img(pr.image, 'assets/img/proj-1.svg') + '" alt="' + e(pr.title) + '" loading="lazy" />' +
          '<span class="shot__zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></div>' +
          '<div class="shot__body"><h2 class="shot__title">' + e(pr.title) + '</h2>' +
          (String(pr.text || '').trim() ? '<p class="shot__text">' + e(pr.text) + '</p>' : '') +
          '</div></article>';
      });
      out += '</div>';
    }
    out += '</div></section>';
    out += '<div class="lb" id="shotBox" role="dialog" aria-modal="true" aria-labelledby="shotTitle" aria-hidden="true">' +
      '<div class="lb__backdrop" data-shot-close></div><div class="lb__panel lb__panel--shot">' +
      '<button class="lb__close" data-shot-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<div class="shot-view__media"><img id="shotImg" src="" alt="" /></div>' +
      '<div class="shot-view__body"><h2 class="lb__title" id="shotTitle"></h2><p class="lb__text" id="shotText"></p></div></div></div>';
    out += cta(d, "Let's Work Together", p.cta_title_a, p.cta_title_b, p.cta_text);
    return out + '</main>';
  }

  function about(d) {
    var a = d.about || {}, s = d.site || {};
    var out = '<main>' + pageHero('About Me', a.eyebrow, a.title_a, a.title_b, a.intro);
    out += '<section class="section" id="story" style="padding-top:20px"><div class="container story__grid">' +
      '<div class="story__visual reveal"><div class="story__frame"><div class="story__ring"></div>' +
      '<img src="' + img(a.image, 'assets/img/about.svg') + '" alt="' + e(s.brand_first + ' ' + s.brand_last) + '" /></div></div>' +
      '<div class="story__content"><span class="eyebrow reveal">My Story</span>' +
      '<p class="story__lead reveal" data-delay="0.05">' + e(a.lead) + '</p>';
    (a.paras || []).forEach(function (p, i) {
      out += '<p class="story__text reveal" data-delay="' + (0.1 + i * 0.04).toFixed(2) + '">' + rich(p) + '</p>';
    });
    out += '<div class="signature reveal" data-delay="0.28">' +
      '<span class="signature__name">' + e(s.brand_first) + ' ' + e(s.brand_last) + '</span>' +
      '<span class="signature__role">' + e(a.sign_role) + '</span></div></div></div></section>';
    out += cta(d, "Let's Work Together", a.cta_title_a, a.cta_title_b, a.cta_text, 'Book a Free Strategy Call', 'portfolio.html', 'See My Work');
    return out + '</main>';
  }

  function testimonials(d) {
    var p = d.testimonials_page || {}, list = d.testimonials || [];
    var out = '<main>' + pageHero('Testimonials', p.eyebrow, p.title_a, p.title_b, p.intro);
    out += '<section class="section" id="reviews" style="padding-top:0"><div class="container">';
    if (list.length) {
      var f = list[0];
      out += '<div class="t-featured reveal" id="tFeatured"><div class="t-featured__glow"></div>' +
        '<span class="t-featured__mark">&rdquo;</span><div class="t-featured__inner" id="tFeaturedInner">' +
        '<span class="t-featured__tag" id="tfSvc">' + e(f.svc) + '</span>' +
        '<p class="t-featured__text" id="tfText">' + e(f.text) + '</p>' +
        '<div class="t-featured__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
        '<div class="tperson" style="border-top:0;padding-top:0">' +
        '<div class="tperson__avatar" id="tfAvatar" style="--a:' + hex(f.a, '#35E0F0') + ';--b:' + hex(f.b, '#7B5CFF') + '">' + e(f.initials) + '</div>' +
        '<div><strong id="tfName">' + e(f.name) + '</strong><small id="tfRole">' + e(f.role) + '</small></div>' +
        '</div></div></div><div class="t-grid" id="tGrid">';
      list.forEach(function (t, i) {
        out += '<article class="tcard reveal' + (i === 0 ? ' is-active' : '') + '" data-delay="' + ((i % 3) * 0.07).toFixed(2) + '"' +
          ' tabindex="0" role="button" aria-label="Show this review at the top"' +
          ' data-name="' + e(t.name) + '" data-role="' + e(t.role) + '" data-svc="' + e(t.svc) + '"' +
          ' data-init="' + e(t.initials) + '" data-a="' + hex(t.a, '#35E0F0') + '" data-b="' + hex(t.b, '#7B5CFF') + '">' +
          '<span class="tcard__service">' + e(t.svc) + '</span>' +
          '<div class="tcard__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
          '<p class="tcard__text">' + e(t.text) + '</p><div class="tperson">' +
          '<div class="tperson__avatar" style="--a:' + hex(t.a, '#35E0F0') + ';--b:' + hex(t.b, '#7B5CFF') + '">' + e(t.initials) + '</div>' +
          '<div><strong>' + e(t.name) + '</strong><small>' + e(t.role) + '</small></div></div></article>';
      });
      out += '</div>';
    }
    out += '</div></section>';
    out += cta(d, "Let's Work Together", p.cta_title_a, p.cta_title_b, p.cta_text, 'Book a Free Strategy Call', 'portfolio.html', 'See My Work');
    return out + '</main>';
  }

  function contact(d) {
    var p = d.contact_page || {}, ct = d.contact || {};
    var out = '<main>' + pageHero('Contact', p.eyebrow, p.title_a, p.title_b, p.intro);
    out += '<section class="section" id="start" style="padding-top:0"><div class="container contact__grid">';

    out += '<div class="form-card reveal"><div class="form-card__glow"></div>' +
      '<form id="contactForm" novalidate>' +
      '<div style="position:absolute;left:-9999px" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>' +
      '<h2>' + e(p.form_title) + '</h2><p class="form-card__sub">' + e(p.form_sub) + '</p>' +
      '<p class="form-alert" id="formAlert" style="display:none"></p>' +
      '<div class="form-row">' +
      '<div class="field"><label for="cName">Abir Husen Shiam <span>*</span></label><input type="text" id="cName" name="name" placeholder="Enter your full name" autocomplete="name" /><span class="field__error">Please enter your name.</span></div>' +
      '<div class="field"><label for="cEmail">Email Address <span>*</span></label><input type="email" id="cEmail" name="email" placeholder="you@company.com" autocomplete="email" /><span class="field__error">Please enter a valid email address.</span></div>' +
      '</div><div class="form-row">' +
      '<div class="field"><label for="cPhone">Phone / WhatsApp</label><input type="tel" id="cPhone" name="phone" placeholder="Optional" autocomplete="tel" /><span class="field__error">Please check this number.</span></div>' +
      '<div class="field"><label for="cService">Service Needed <span>*</span></label><select id="cService" name="service"><option value="">Choose a service</option>' +
      (d.services || []).map(function (s) { return '<option>' + e(s.title) + '</option>'; }).join('') +
      '<option>Not sure yet</option></select><span class="field__error">Please pick a service.</span></div>' +
      '</div>' +
      '<div class="field"><label for="cMessage">Your Message <span>*</span></label>' +
      '<textarea id="cMessage" name="message" placeholder="Tell me about your business, what you\'ve tried so far, and what you\'d like to achieve."></textarea>' +
      '<span class="field__error">Please write a short message.</span></div>' +
      '<div class="form-foot"><button type="submit" class="btn btn--primary magnetic"><span>Send Message</span>' + ARROW + '</button>' +
      '<span class="form-note">Your details stay private and are never shared.</span></div></form>' +
      '<div class="form-success" id="formSuccess"><div class="form-success__icon">' +
      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<h3>Message Sent</h3><p>Thanks for getting in touch — your message has landed and I\'ll reply personally.</p>' +
      '<button type="button" class="btn btn--ghost magnetic" id="formReset"><span>Write Another Message</span></button></div></div>';

    out += '<div class="info-stack">';
    if (ct.email) {
      out += '<a class="info-card reveal" data-delay="0.05" href="mailto:' + e(ct.email) + '">' +
        '<div class="info-card__icon">' + icon('email') + '</div><div>' +
        '<div class="info-card__label">Email</div><div class="info-card__value">' + e(ct.email) + '</div>' +
        '<div class="info-card__hint">Best for detailed enquiries</div></div></a>';
    }
    if (ct.phone) {
      out += '<a class="info-card reveal" data-delay="0.1" href="tel:' + e(String(ct.phone).replace(/[^\d+]/g, '')) + '">' +
        '<div class="info-card__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 6c0-1 .9-2 2-2h1.6c.5 0 1 .4 1.1.9l.7 2.8c.1.5-.1 1-.5 1.2l-1.4.9a12 12 0 005.7 5.7l.9-1.4c.3-.4.7-.6 1.2-.5l2.8.7c.5.1.9.6.9 1.1V18c0 1.1-.9 2-2 2A14 14 0 014 6z" stroke="currentColor" stroke-width="1.9"/></svg></div>' +
        '<div><div class="info-card__label">Phone</div><div class="info-card__value">' + e(ct.phone) + '</div></div></a>';
    }
    var wa = digits(ct.whatsapp);
    if (wa) {
      out += '<a class="info-card reveal" data-delay="0.15" href="https://wa.me/' + e(wa) + '" target="_blank" rel="noopener">' +
        '<div class="info-card__icon">' + SOCIAL.whatsapp + '</div><div>' +
        '<div class="info-card__label">WhatsApp</div><div class="info-card__value">Message me directly</div>' +
        '<div class="info-card__hint">Quickest way to reach me</div></div></a>';
    }
    var soc = socialLinks(d);
    if (soc) out += '<div class="social-box reveal" data-delay="0.2"><h3>Find Me Online</h3><div class="social-box__row">' + soc + '</div></div>';
    out += '</div></div></section></main>';
    return out;
  }

  var PAGES = {
    'index.html': { fn: home, title: function (d) { return (d.home.heading || '') + ' — ' + (d.home.role_static || ''); }, desc: function (d) { return d.home.intro; } },
    'services.html': { fn: services, title: function (d) { return 'Services — ' + d.site.title_suffix; }, desc: function (d) { return d.services_page.intro; } },
    'portfolio.html': { fn: portfolio, title: function (d) { return 'My Work — ' + d.site.title_suffix; }, desc: function (d) { return d.portfolio_page.intro; } },
    'about.html': { fn: about, title: function (d) { return 'About Me — ' + d.site.title_suffix; }, desc: function (d) { return d.about.intro; } },
    'testimonials.html': { fn: testimonials, title: function (d) { return 'Testimonials — ' + d.site.title_suffix; }, desc: function (d) { return d.testimonials_page.intro; } },
    'contact.html': { fn: contact, title: function (d) { return 'Contact — ' + d.site.title_suffix; }, desc: function (d) { return d.contact_page.intro; } }
  };

  /** Everything that lives inside #ak-app for a given page. */
  function app(page, d) {
    var def = PAGES[page] || PAGES['index.html'];
    return nav(d, page) + def.fn(d) + footer(d);
  }

  return {
    app: app, pages: PAGES, themeCss: themeCss,
    title: function (page, d) { return (PAGES[page] || PAGES['index.html']).title(d); },
    desc:  function (page, d) { return (PAGES[page] || PAGES['index.html']).desc(d); },
    escape: e, icon: icon, social: SOCIAL, img: img
  };
}));
