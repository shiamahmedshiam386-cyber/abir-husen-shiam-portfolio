/* =========================================================
   PORTFOLIO — ADMIN PANEL
   Talks to /api/* (Netlify Function + Netlify Blobs).
   Nothing here pretends to save: every Save button waits for
   the server to confirm, and reports it if the server says no.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- state ---------------- */
  var C = null;            // working copy of the site content
  var VER = null;          // version the server last gave us
  var USER = '';
  var MUST_CHANGE = false;   // still on the password the template shipped with
  var DIRTY = false;
  var MEDIA = null;        // cached uploaded-image list
  var PAGE = 'dashboard';

  var BUNDLED = [
    'assets/img/portrait.svg', 'assets/img/about.svg', 'assets/img/favicon.svg',
    'assets/img/proj-1.svg', 'assets/img/proj-2.svg', 'assets/img/proj-3.svg',
    'assets/img/proj-4.svg', 'assets/img/proj-5.svg', 'assets/img/proj-6.svg',
    'assets/img/proj-7.svg', 'assets/img/proj-8.svg', 'assets/img/proj-9.svg',
    'assets/img/case-1.svg', 'assets/img/case-2.svg', 'assets/img/case-3.svg', 'assets/img/case-4.svg'
  ];

  var ICON_KEYS = ['facebook', 'google', 'tiktok', 'youtube', 'social', 'shopify', 'search', 'chart', 'email', 'star'];

  var SECTIONS = [
    ['dashboard', 'Dashboard', 'grid'],
    ['home', 'Home Page', 'home'],
    ['portfolio', 'My Work', 'folder'],
    ['about', 'About Me', 'user'],
    ['services', 'Services', 'layers'],
    ['testimonials', 'Testimonials', 'quote'],
    ['contact', 'Contact Information', 'mail'],
    ['messages', 'Inbox', 'inbox'],
    ['media', 'Images / Media', 'image'],
    ['theme', 'Theme / Colors', 'palette'],
    ['settings', 'Website Settings', 'cog'],
    ['account', 'Admin Account', 'key']
  ];

  var SVG = {
    grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1z"/>',
    folder: '<path d="M3 6a1 1 0 011-1h5l2 2h9a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1z"/>',
    user: '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.6-6 8-6s8 2 8 6z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
    quote: '<path d="M7 7h5v5c0 3-2 5-5 5V7zM14 7h5v5c0 3-2 5-5 5V7z"/>',
    mail: '<path d="M3 6h18v12H3zM3 7l9 6 9-6"/>',
    inbox: '<path d="M3 13h5l1 3h6l1-3h5M3 13l2-8h14l2 8v6H3z"/>',
    image: '<path d="M3 5h18v14H3zM7 11a2 2 0 100-4 2 2 0 000 4zM4 18l5-6 4 4 3-3 4 5z"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1 0 2-1 2-2s-1-2 0-3 3 0 4-1a8 8 0 00-6-12zM7 12a1.4 1.4 0 100-3 1.4 1.4 0 000 3zM11 8a1.4 1.4 0 100-3 1.4 1.4 0 000 3zM16 10a1.4 1.4 0 100-3 1.4 1.4 0 000 3z"/>',
    cog: '<path d="M12 15a3 3 0 100-6 3 3 0 000 6zM4 12l-1-2 2-1 1-2 2 .5L10 6l2-1 2 1 1.5 1.5 2-.5 1 2 2 1-1 2 1 2-2 1-1 2-2-.5L14 20l-2 1-2-1-1.5-1.5-2 .5-1-2-2-1z"/>',
    key: '<path d="M14 7a4 4 0 11-3.4 6.1L4 20H2v-3l6.9-6.6A4 4 0 0114 7zm2 2.5a1 1 0 100-2 1 1 0 000 2z"/>'
  };
  function icon(k) { return '<svg viewBox="0 0 24 24" fill="currentColor">' + (SVG[k] || SVG.grid) + '</svg>'; }

  /* ---------------- small helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function get(path, fallback) {
    var o = C, parts = String(path).split('.');
    for (var i = 0; i < parts.length; i++) {
      if (o == null || typeof o !== 'object') return fallback;
      o = o[parts[i]];
    }
    return o == null ? fallback : o;
  }

  function setAt(path, val) {
    var parts = String(path).split('.'), o = C;
    for (var i = 0; i < parts.length - 1; i++) {
      if (typeof o[parts[i]] !== 'object' || o[parts[i]] === null) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = val;
  }

  function thumbSrc(v) {
    v = String(v || '').trim();
    if (!v) return '../assets/img/favicon.svg';
    if (v.charAt(0) === '/' || /^https?:/i.test(v)) return v;
    return '../' + v;
  }

  function uid(p) { return p + Math.random().toString(36).slice(2, 8); }
  function lines(arr) { return (arr || []).join('\n'); }
  function toLines(str) {
    return String(str || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* ---------------- api ---------------- */
  function api(path, body) {
    var opt = { credentials: 'same-origin', cache: 'no-store' };
    if (body !== undefined) {
      opt.method = 'POST';
      opt.headers = { 'Content-Type': 'application/json' };
      opt.body = JSON.stringify(body);
    }
    return fetch('/api/' + path, opt).then(function (r) {
      return r.text().then(function (t) {
        var d;
        try { d = JSON.parse(t); } catch (e) { d = null; }
        if (!d) {
          throw new Error(r.status === 404
            ? 'The backend is not running on this site yet. Open START-HERE.html (in the folder I sent you) — Step 2 explains the one-time setup.'
            : 'Unexpected response from the server (' + r.status + ').');
        }
        if (!d.ok && d.error) throw new Error(d.error);
        return d;
      });
    });
  }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg, bad) {
    var t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className = 'toast is-on' + (bad ? ' is-bad' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, bad ? 6000 : 2800);
  }

  /* ---------------- theme in the panel ---------------- */
  function applyTheme() {
    var tag = $('#ak-theme');
    if (!tag) { tag = document.createElement('style'); tag.id = 'ak-theme'; document.head.appendChild(tag); }
    var t = get('theme', {}) || {};
    function hex(v, fb) { return /^#[0-9a-fA-F]{6}$/.test(String(v || '')) ? v : fb; }
    function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)].join(','); }
    var c1 = hex(t.c1, '#35E0F0'), c2 = hex(t.c2, '#7B5CFF'), c3 = hex(t.c3, '#FF7A59'), bg = hex(t.bg, '#070A12');
    tag.textContent = ':root{--c1:' + c1 + ';--c2:' + c2 + ';--c3:' + c3 + ';--bg:' + bg +
      ';--c1-rgb:' + rgb(c1) + ';--c2-rgb:' + rgb(c2) + ';--c3-rgb:' + rgb(c3) +
      ';--grad:linear-gradient(115deg,' + c1 + ' 0%,' + c2 + ' 60%,' + c3 + ' 120%)' +
      ';--grad-2:linear-gradient(120deg,' + c1 + ',' + c2 + ');}';
  }

  /* =========================================================
     FIELD BUILDERS
     Each returns HTML; values are read back by data-path.
     ========================================================= */
  function fText(path, label, hint, type) {
    return '<label class="fld"><span>' + esc(label) + (hint ? ' <em>' + esc(hint) + '</em>' : '') + '</span>' +
      '<input type="' + (type || 'text') + '" data-path="' + esc(path) + '" value="' + esc(get(path, '')) + '" /></label>';
  }

  function fArea(path, label, hint, rows) {
    return '<label class="fld"><span>' + esc(label) + (hint ? ' <em>' + esc(hint) + '</em>' : '') + '</span>' +
      '<textarea rows="' + (rows || 4) + '" data-path="' + esc(path) + '">' + esc(get(path, '')) + '</textarea></label>';
  }

  function fLines(path, label, hint, rows) {
    return '<label class="fld"><span>' + esc(label) + ' <em>' + esc(hint || 'one per line') + '</em></span>' +
      '<textarea rows="' + (rows || 5) + '" data-path="' + esc(path) + '" data-kind="lines">' +
      esc(lines(get(path, []))) + '</textarea></label>';
  }

  function fSelect(path, label, options, hint) {
    var cur = String(get(path, ''));
    return '<label class="fld"><span>' + esc(label) + (hint ? ' <em>' + esc(hint) + '</em>' : '') + '</span><select data-path="' + esc(path) + '">' +
      options.map(function (o) {
        var v = typeof o === 'string' ? o : o[0], t = typeof o === 'string' ? (o.charAt(0).toUpperCase() + o.slice(1)) : o[1];
        return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(t) + '</option>';
      }).join('') + '</select></label>';
  }

  function fImage(path, label, hint) {
    var v = get(path, '');
    return '<div class="fld imgfld"><span>' + esc(label) + (hint ? ' <em>' + esc(hint) + '</em>' : '') + '</span>' +
      '<div class="imgfld__row">' +
      '<img class="imgfld__thumb" src="' + esc(thumbSrc(v)) + '" alt="" />' +
      '<input type="text" data-path="' + esc(path) + '" data-img value="' + esc(v) + '" placeholder="Choose or paste an image path" />' +
      '<button type="button" class="btn btn--ghost btn--sm" data-pick>Choose</button>' +
      '</div></div>';
  }

  function fColor(path, label) {
    var v = get(path, '#000000');
    return '<label class="fld"><span>' + esc(label) + '</span><span class="color-row">' +
      '<input type="color" data-path="' + esc(path) + '" data-color value="' + esc(v) + '" />' +
      '<input type="text" data-mirror="' + esc(path) + '" value="' + esc(v) + '" /></span></label>';
  }

  /** panel(title, body[, note][, headExtra]) */
  function panel(title, inner, note, head) {
    return '<section class="panel">' +
      (head ? '<div class="panel__head"><h2 class="panel__title">' + esc(title) + '</h2>' + head + '</div>'
            : '<h2 class="panel__title">' + esc(title) + '</h2>') +
      (note ? '<p class="panel__note">' + esc(note) + '</p>' : '') + inner + '</section>';
  }

  function cols(n, html) { return '<div class="cols-' + n + '">' + html + '</div>'; }

  function savebar(label) {
    return '<div class="savebar"><button type="button" class="btn btn--primary" data-save>' +
      esc(label || 'Save Changes') + '</button>' +
      '<span class="savebar__hint">Saved to the server — live on the website straight away.</span></div>';
  }

  /* ---------------- repeatable list ---------------- */
  var LIST_SPECS = {};   // path -> spec, so Add / Delete know how to build a row

  /** spec = { path, itemName, nameKey, newItem(), row(item, path) } */
  function listPanel(title, note, spec) {
    LIST_SPECS[spec.path] = spec;
    var items = get(spec.path, []) || [];
    var html = '<div class="rows rows--stack" data-list="' + esc(spec.path) + '">' +
      items.map(function (it, i) { return listRow(spec, it, i); }).join('') + '</div>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-add="' + esc(spec.path) + '">+ Add ' + esc(spec.itemName) + '</button>';
    return panel(title, html, note,
      '<button type="button" class="btn btn--ghost btn--sm" data-add="' + esc(spec.path) + '">+ Add ' + esc(spec.itemName) + '</button>');
  }

  function listRow(spec, item, i) {
    var base = spec.path + '.' + i;
    /* mark the field that drives the row's collapsed title */
    var body = spec.row(item, base)
      .replace('data-path="' + base + '.' + spec.nameKey + '"',
               'data-path="' + base + '.' + spec.nameKey + '" data-name-src');
    return '<div class="row row--card" data-row="' + i + '">' +
      '<div class="row__bar"><span class="row__n">' + (i + 1) + '</span>' +
      '<strong class="row__name">' + esc(item[spec.nameKey] || ('New ' + spec.itemName)) + '</strong>' +
      '<button type="button" class="row__del" data-del title="Remove">&times;</button></div>' +
      '<div class="row__body">' + body + '</div></div>';
  }

  /* =========================================================
     SECTION VIEWS
     ========================================================= */
  var VIEWS = {};

  VIEWS.dashboard = function () {
    var tiles = [
      ['home', 'Home Page', 'Hero, stats, sections'],
      ['portfolio', 'My Work', (get('projects', []) || []).length + ' screenshots'],
      ['services', 'Services', (get('services', []) || []).length + ' services'],
      ['testimonials', 'Testimonials', (get('testimonials', []) || []).length + ' reviews'],
      ['about', 'About Me', 'Photo and story'],
      ['contact', 'Contact Information', 'Email, phone, socials'],
      ['messages', 'Inbox', 'Messages from the form'],
      ['media', 'Images / Media', 'Upload and manage images'],
      ['theme', 'Theme / Colors', 'Site colours'],
      ['settings', 'Website Settings', 'Brand and titles'],
      ['account', 'Admin Account', 'Username and password']
    ];
    return panel('Welcome back',
      '<p class="panel__note">Everything on your website is editable here. Pick a section to begin — changes go live as soon as you save.</p>' +
      '<div class="grid-cards">' + tiles.map(function (t) {
        return '<a class="ncard" href="#' + t[0] + '"><span class="ncard__icon">' + icon((SECTIONS.filter(function (s) { return s[0] === t[0]; })[0] || [, , 'grid'])[2]) + '</span>' +
          '<strong>' + esc(t[1]) + '</strong><small>' + esc(t[2]) + '</small><span class="ncard__go">&rarr;</span></a>';
      }).join('') + '</div>');
  };

  VIEWS.home = function () {
    var h = '';
    h += panel('Hero',
      cols(2, fText('home.pill', 'Availability pill', 'leave empty to hide') + fText('home.heading', 'Heading (your name)')) +
      cols(2, fText('home.role_static', 'Role label') + fText('home.cta_button', 'Main button label')) +
      fLines('home.roles', 'Rotating roles') +
      cols(2, fText('home.tagline_a', 'Tagline — first part') + fText('home.tagline_b', 'Tagline — highlighted part')) +
      fArea('home.intro', 'Intro paragraph', '', 3) +
      fImage('home.hero_image', 'Hero photo'));

    h += listPanel('Floating cards on the photo', 'Two small cards over your photo. Leave the list empty to hide them.', {
      path: 'home.float_cards', itemName: 'card', nameKey: 'label',
      newItem: function () { return { value: '', label: '' }; },
      row: function (it, p) { return cols(2, fText(p + '.value', 'Big value') + fText(p + '.label', 'Label')); }
    });

    h += listPanel('Stats counters', 'Only put numbers here you can stand behind.', {
      path: 'home.stats', itemName: 'stat', nameKey: 'label',
      newItem: function () { return { prefix: '', value: '', suffix: '', label: '' }; },
      row: function (it, p) {
        return cols(4, fText(p + '.prefix', 'Prefix', 'e.g. $') + fText(p + '.value', 'Number') +
          fText(p + '.suffix', 'Suffix', 'e.g. + or %') + fText(p + '.label', 'Label'));
      }
    });

    h += panel('Services section heading',
      cols(2, fText('home.services_eyebrow', 'Eyebrow') + fText('home.services_title_a', 'Title')) +
      cols(2, fText('home.services_title_b', 'Highlighted part') + '') +
      fArea('home.services_sub', 'Sub-heading', '', 2));

    h += panel('Featured work heading',
      cols(2, fText('home.work_eyebrow', 'Eyebrow') + fText('home.work_title_a', 'Title')) +
      cols(2, fText('home.work_title_b', 'Highlighted part') + '') +
      fArea('home.work_sub', 'Sub-heading', '', 2));

    h += panel('About teaser',
      cols(2, fText('home.about_eyebrow', 'Eyebrow') + fText('home.about_title_a', 'Title')) +
      cols(2, fText('home.about_title_b', 'Highlighted part') + fImage('home.about_image', 'Photo')) +
      cols(2, fText('home.about_badge_num', 'Badge number') + fText('home.about_badge_text', 'Badge text', 'use <br> for a line break')) +
      fLines('home.about_paras', 'Paragraphs', 'one paragraph per line') +
      fLines('home.about_points', 'Bullet points'));

    h += panel('Tools & expertise',
      cols(2, fText('home.tools_eyebrow', 'Eyebrow') + fText('home.tools_title_a', 'Title — first word')) +
      cols(2, fText('home.tools_title_b', 'Highlighted part') + fText('home.tools_title_c', 'Title — rest')) +
      fArea('home.tools_sub', 'Sub-heading', '', 2));

    h += listPanel('Tool chips', '', {
      path: 'home.tools', itemName: 'tool', nameKey: 'name',
      newItem: function () { return { icon: '', name: '' }; },
      row: function (it, p) { return cols(2, fText(p + '.name', 'Tool name') + fText(p + '.icon', 'Icon letter', 'a single character')); }
    });

    h += panel('Scrolling marquee', fLines('home.marquee', 'Marquee words', 'one per line', 6));

    h += panel('Closing call to action',
      cols(2, fText('home.cta_eyebrow', 'Eyebrow') + fText('home.cta_title_a', 'Title')) +
      cols(2, fText('home.cta_title_b', 'Highlighted part') + fText('home.cta_note', 'Small note')) +
      fArea('home.cta_text', 'Text', '', 3));

    return h + savebar('Save Home Page');
  };

  VIEWS.portfolio = function () {
    var h = panel('Page header',
      cols(2, fText('portfolio_page.eyebrow', 'Eyebrow') + fText('portfolio_page.title_a', 'Title')) +
      cols(2, fText('portfolio_page.title_b', 'Highlighted part') + '') +
      fArea('portfolio_page.intro', 'Intro paragraph', '', 3));

    h += listPanel('Screenshots', 'One screenshot of the work you did, a title, and a short description. The first four also show on the home page.', {
      path: 'projects', itemName: 'project', nameKey: 'title',
      newItem: function () { return { id: uid('p'), title: '', image: '', text: '' }; },
      row: function (it, p) {
        return fText(p + '.title', 'Title') + fImage(p + '.image', 'Screenshot') +
          fArea(p + '.text', 'Short description', '', 3);
      }
    });

    h += panel('Page call to action',
      cols(2, fText('portfolio_page.cta_title_a', 'Title') + fText('portfolio_page.cta_title_b', 'Highlighted part')) +
      fArea('portfolio_page.cta_text', 'Text', '', 3));

    return h + savebar('Save My Work');
  };

  VIEWS.about = function () {
    var h = panel('Page header',
      cols(2, fText('about.eyebrow', 'Eyebrow') + fText('about.title_a', 'Title')) +
      cols(2, fText('about.title_b', 'Highlighted part') + fImage('about.image', 'Your photo')) +
      fArea('about.intro', 'Intro paragraph', '', 3));

    h += panel('Your story',
      fArea('about.lead', 'Opening line', 'shown larger', 3) +
      fLines('about.paras', 'Story paragraphs', 'one paragraph per line', 10) +
      fText('about.sign_role', 'Signature line'));

    h += panel('Page call to action',
      cols(2, fText('about.cta_title_a', 'Title') + fText('about.cta_title_b', 'Highlighted part')) +
      fArea('about.cta_text', 'Text', '', 3));

    return h + savebar('Save About Me');
  };

  VIEWS.services = function () {
    var h = panel('Page header',
      cols(2, fText('services_page.eyebrow', 'Eyebrow') + fText('services_page.title_a', 'Title')) +
      cols(2, fText('services_page.title_b', 'Highlighted part') + '') +
      fArea('services_page.intro', 'Intro paragraph', '', 3));

    h += listPanel('Services', 'These also fill the home page cards, the footer list and the contact form dropdown.', {
      path: 'services', itemName: 'service', nameKey: 'title',
      newItem: function () { return { id: uid('s'), title: '', category: '', icon: 'chart', desc: '', items: [], note: 'Pricing on request' }; },
      row: function (it, p) {
        return cols(3, fText(p + '.title', 'Service name') + fText(p + '.category', 'Category tag') + fSelect(p + '.icon', 'Icon', ICON_KEYS)) +
          fArea(p + '.desc', 'Short description', '', 3) +
          fLines(p + '.items', "What's included") +
          fText(p + '.note', 'Footer note');
      }
    });

    h += panel('Page call to action',
      cols(2, fText('services_page.cta_title_a', 'Title') + fText('services_page.cta_title_b', 'Highlighted part')) +
      fArea('services_page.cta_text', 'Text', '', 3));

    return h + savebar('Save Services');
  };

  VIEWS.testimonials = function () {
    var h = panel('Page header',
      cols(2, fText('testimonials_page.eyebrow', 'Eyebrow') + fText('testimonials_page.title_a', 'Title')) +
      cols(2, fText('testimonials_page.title_b', 'Highlighted part') + '') +
      fArea('testimonials_page.intro', 'Intro paragraph', '', 3));

    h += listPanel('Client reviews', 'Replace these with real reviews from your own clients. The first one shows large at the top.', {
      path: 'testimonials', itemName: 'review', nameKey: 'name',
      newItem: function () { return { id: uid('t'), svc: '', name: '', role: '', initials: '', a: '#35E0F0', b: '#7B5CFF', text: '' }; },
      row: function (it, p) {
        return cols(3, fText(p + '.name', 'Client name') + fText(p + '.role', 'Role / company') + fText(p + '.svc', 'Service tag')) +
          cols(3, fText(p + '.initials', 'Avatar initials', '1–2 letters') + fColor(p + '.a', 'Avatar colour 1') + fColor(p + '.b', 'Avatar colour 2')) +
          fArea(p + '.text', 'Review text', '', 4);
      }
    });

    h += panel('Page call to action',
      cols(2, fText('testimonials_page.cta_title_a', 'Title') + fText('testimonials_page.cta_title_b', 'Highlighted part')) +
      fArea('testimonials_page.cta_text', 'Text', '', 3));

    return h + savebar('Save Testimonials');
  };

  VIEWS.contact = function () {
    var h = panel('How people reach you',
      cols(2, fText('contact.email', 'Email address', '', 'email') + fText('contact.phone', 'Phone number')) +
      cols(2, fText('contact.whatsapp', 'WhatsApp number', 'digits only, with country code') + ''),
      'Leave a field empty to hide it from the website.');

    h += panel('Social links',
      cols(2, fText('contact.facebook', 'Facebook URL') + fText('contact.linkedin', 'LinkedIn URL')) +
      cols(2, fText('contact.youtube', 'YouTube URL') + fText('contact.instagram', 'Instagram URL')),
      'Leave empty or "#" to hide an icon.');

    h += panel('Contact page wording',
      cols(2, fText('contact_page.eyebrow', 'Eyebrow') + fText('contact_page.title_a', 'Title')) +
      cols(2, fText('contact_page.title_b', 'Highlighted part') + '') +
      fArea('contact_page.intro', 'Intro paragraph', '', 3) +
      cols(2, fText('contact_page.form_title', 'Form heading') + fText('contact_page.form_sub', 'Form sub-heading')));

    return h + savebar('Save Contact Information');
  };

  VIEWS.settings = function () {
    var h = panel('Brand',
      cols(3, fText('site.brand_first', 'First name') + fText('site.brand_last', 'Last name') + fText('site.brand_mark', 'Logo initials', '2 letters')) +
      cols(2, fImage('site.logo_image', 'Logo image', 'leave empty to use the initials') +
              fImage('site.favicon', 'Browser tab icon', 'square image; falls back to the logo')) +
      fText('site.title_suffix', 'Browser title suffix') +
      fArea('site.footer_about', 'Footer description', '', 3) +
      fText('site.copyright', 'Copyright line'));

    h += savebar('Save Settings');

    h += '<section class="panel panel--danger"><h2 class="panel__title">Reset content</h2>' +
      '<p class="panel__note">Puts the original text back on every page. Your uploaded images, theme and login are kept. This cannot be undone.</p>' +
      '<button type="button" class="btn btn--danger" data-reset>Reset all content</button></section>';
    return h;
  };

  VIEWS.theme = function () {
    var PRESETS = [
      ['Cyan / Violet', '#35E0F0', '#7B5CFF', '#FF7A59', '#070A12'],
      ['Emerald', '#34F5C5', '#2D9CFF', '#FFC75F', '#06100E'],
      ['Sunset', '#FF8A5B', '#FF4D6D', '#FFD166', '#120A0C'],
      ['Royal', '#8F7BFF', '#4D6DFF', '#FF79C6', '#0A0A14'],
      ['Gold', '#FFCE5C', '#FF9F45', '#7BE0C4', '#100D07'],
      ['Ice', '#8CE6FF', '#5B8CFF', '#C9A6FF', '#070B14']
    ];
    var h = panel('Colours',
      cols(4, fColor('theme.c1', 'Primary') + fColor('theme.c2', 'Secondary') + fColor('theme.c3', 'Accent') + fColor('theme.bg', 'Background')) +
      '<div class="presets">' + PRESETS.map(function (p) {
        return '<button type="button" class="preset" data-preset="' + esc(p.slice(1).join(',')) + '">' +
          '<span class="preset__swatch" style="background:linear-gradient(115deg,' + p[1] + ',' + p[2] + ' 60%,' + p[3] + ')"></span>' +
          esc(p[0]) + '</button>';
      }).join('') + '</div>',
      'The four colours below drive every accent, gradient and glow across the whole website.');

    h += panel('Live preview',
      '<div class="theme-preview"><div class="tp__nav"><span class="tp__mark">' + esc(get('site.brand_mark', 'AA')) + '</span>' +
      '<span class="tp__brand">' + esc(get('site.brand_first', '')) + ' <strong>' + esc(get('site.brand_last', '')) + '</strong></span>' +
      '<span class="tp__pill">Available</span></div>' +
      '<div class="tp__grad"></div>' +
      '<h3 class="tp__h">Driving Growth Through <span>Smarter Marketing</span></h3>' +
      '<p class="tp__p">This is how body text and the accent colours look together.</p>' +
      '<div class="tp__btns"><span class="tp__btn">Primary button</span><span class="tp__btn tp__btn--ghost">Ghost button</span></div>' +
      '<div class="tp__stats"><span><b class="tp__num">250</b> Campaigns</span><span><b class="tp__num">120</b> Clients</span><span><b class="tp__num">7</b> Years</span></div>' +
      '</div>');

    return h + savebar('Save Theme');
  };

  VIEWS.media = function () {
    return panel('Images',
      '<div class="upload-form"><label class="btn btn--primary btn--sm"><input type="file" id="mediaUpload" accept="image/*" hidden multiple /> Upload images</label>' +
      '<span class="picker__status" id="mediaStatus"></span></div>' +
      '<div class="media-grid" id="mediaGrid"><p class="panel__note">Loading…</p></div>',
      'Uploaded images are stored on the server and can be used in any image field. Maximum 3.5 MB each.');
  };

  VIEWS.messages = function () {
    return panel('Inbox',
      '<div class="msgs" id="msgList"><p class="panel__note">Loading…</p></div>',
      'Every message sent through your contact form.');
  };

  VIEWS.account = function () {
    return panel('Admin account',
      cols(2, '<label class="fld"><span>Username</span><input type="text" id="acUser" value="' + esc(USER) + '" /></label>' +
        '<label class="fld"><span>Current password <em>required</em></span><input type="password" id="acCurrent" autocomplete="current-password" /></label>') +
      cols(2, '<label class="fld"><span>New password <em>leave empty to keep it</em></span><input type="password" id="acPass" autocomplete="new-password" /></label>' +
        '<label class="fld"><span>Repeat new password</span><input type="password" id="acPass2" autocomplete="new-password" /></label>') +
      '<div class="savebar"><button type="button" class="btn btn--primary" data-account>Update account</button>' +
      '<span class="savebar__hint">You stay signed in after the change.</span></div>',
      MUST_CHANGE
        ? 'Enter the password the site came with as the current one, then pick your own. It is stored only as a one-way hash and cannot be read back.'
        : 'Your password is stored only as a one-way hash — it cannot be read back, even by you.');
  };

  /* =========================================================
     READ THE FORM BACK INTO CONTENT
     ========================================================= */
  function collect(root) {
    $$('[data-path]', root).forEach(function (el) {
      if (el.hasAttribute('data-mirror')) return;
      var p = el.getAttribute('data-path');
      var v = el.value;
      if (el.getAttribute('data-kind') === 'lines') setAt(p, toLines(v));
      else setAt(p, v);
    });
  }

  /* =========================================================
     LIST add / delete
     ========================================================= */
  function reindex(wrap, path) {
    $$('.row', wrap).forEach(function (row, i) {
      row.setAttribute('data-row', i);
      var n = $('.row__n', row);
      if (n) n.textContent = i + 1;
      $$('[data-path]', row).forEach(function (el) {
        var p = el.getAttribute('data-path');
        el.setAttribute('data-path', p.replace(new RegExp('^' + path.replace(/\./g, '\\.') + '\\.\\d+'), path + '.' + i));
        var m = el.getAttribute('data-mirror');
        if (m) el.setAttribute('data-mirror', m.replace(new RegExp('^' + path.replace(/\./g, '\\.') + '\\.\\d+'), path + '.' + i));
      });
    });
  }

  /* =========================================================
     RENDER
     ========================================================= */
  function renderSide() {
    return '<aside class="side" id="side">' +
      '<a href="../index.html" class="side__brand" target="_blank" rel="noopener">' +
      '<span class="brand-mark">' + esc(get('site.brand_mark', 'AA')) + '</span>' +
      '<div><strong>' + esc(get('site.brand_first', '')) + ' ' + esc(get('site.brand_last', '')) + '</strong>' +
      '<small>View live site &nearr;</small></div></a>' +
      '<nav class="side__nav">' + SECTIONS.map(function (s) {
        return '<a href="#' + s[0] + '" class="side__link' + (s[0] === PAGE ? ' is-active' : '') + '">' +
          icon(s[2]) + '<span>' + esc(s[1]) + '</span></a>';
      }).join('') + '</nav>' +
      '<a href="#" class="side__out" data-logout>' +
      '<svg viewBox="0 0 24 24" fill="none"><path d="M15 17l5-5-5-5M20 12H9M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>Sign Out</span></a></aside>';
  }

  function render() {
    if (MUST_CHANGE) PAGE = 'account';
    var sec = SECTIONS.filter(function (s) { return s[0] === PAGE; })[0] || SECTIONS[0];
    var view = (VIEWS[PAGE] || VIEWS.dashboard)();
    var warn = MUST_CHANGE
      ? '<p class="alert alert--warn">This website was set up with a password that everyone who has these files knows. ' +
        'Choose your own below — nothing can be saved until you do.</p>'
      : '';

    $('#app').innerHTML =
      '<button class="side-toggle" id="sideToggle" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<div class="shell">' + renderSide() +
      '<main class="main"><header class="topbar"><div><h1>' + esc(sec[1]) + '</h1>' +
      '<p class="topbar__sub">Signed in as <strong>' + esc(USER) + '</strong></p></div>' +
      '<a class="btn btn--ghost btn--sm" href="../index.html" target="_blank" rel="noopener">Preview Site</a></header>' + warn +
      '<form id="secForm" onsubmit="return false">' + view + '</form></main></div>' +
      picker();

    applyTheme();
    wire();
    if (PAGE === 'media') loadMedia();
    if (PAGE === 'messages') loadMessages();
    window.scrollTo(0, 0);
  }

  function picker() {
    return '<div class="picker" id="picker" aria-hidden="true"><div class="picker__bd" data-pick-close></div>' +
      '<div class="picker__panel"><div class="picker__head"><h3>Choose an image</h3>' +
      '<button type="button" class="picker__x" data-pick-close aria-label="Close">&times;</button></div>' +
      '<div class="picker__upload"><label class="btn btn--primary btn--sm">' +
      '<input type="file" id="pickUpload" accept="image/*" hidden /> Upload new image</label>' +
      '<span id="pickStatus" class="picker__status"></span></div>' +
      '<div class="picker__grid" id="pickGrid"></div></div></div>';
  }

  /* =========================================================
     EVENT WIRING
     ========================================================= */
  function wire() {
    var form = $('#secForm');

    form.addEventListener('input', function (e) {
      var el = e.target;
      DIRTY = true;
      if (el.hasAttribute('data-color')) {
        var m = $('[data-mirror="' + el.getAttribute('data-path') + '"]');
        if (m) m.value = el.value;
        if (PAGE === 'theme') { setAt(el.getAttribute('data-path'), el.value); applyTheme(); }
      }
      if (el.hasAttribute('data-mirror') && /^#[0-9a-fA-F]{6}$/.test(el.value)) {
        var c = $('[data-color][data-path="' + el.getAttribute('data-mirror') + '"]');
        if (c) c.value = el.value;
        if (PAGE === 'theme') { setAt(el.getAttribute('data-mirror'), el.value); applyTheme(); }
      }
      if (el.hasAttribute('data-img')) {
        var t = el.parentElement.querySelector('.imgfld__thumb');
        if (t) t.src = thumbSrc(el.value);
      }
      if (el.hasAttribute('data-name-src')) {
        var row = el.closest('.row');
        var name = row && $('.row__name', row);
        if (name) name.textContent = el.value || 'Untitled';
      }
    });

    form.addEventListener('click', function (e) {
      var t = e.target;

      var add = t.closest('[data-add]');
      if (add) {
        var path = add.getAttribute('data-add');
        var spec = LIST_SPECS[path];
        var wrap = $('[data-list="' + path + '"]', form);
        if (!spec || !wrap) return;
        collect(form);
        var arr = get(path, []) || [];
        arr.push(spec.newItem());
        setAt(path, arr);
        var i = arr.length - 1;
        var div = document.createElement('div');
        div.innerHTML = listRow(spec, arr[i], i);
        wrap.appendChild(div.firstChild);
        wrap.lastChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
        DIRTY = true;
        return;
      }

      var del = t.closest('[data-del]');
      if (del) {
        var row = del.closest('.row');
        var wrap2 = del.closest('[data-list]');
        if (!row || !wrap2) return;
        var p2 = wrap2.getAttribute('data-list');
        var idx = parseInt(row.getAttribute('data-row'), 10);
        collect(form);
        var arr2 = get(p2, []) || [];
        arr2.splice(idx, 1);
        setAt(p2, arr2);
        row.remove();
        reindex(wrap2, p2);
        DIRTY = true;
        return;
      }

      var pick = t.closest('[data-pick]');
      if (pick) { openPicker(pick.parentElement.querySelector('[data-img]')); return; }

      var preset = t.closest('[data-preset]');
      if (preset) {
        var v = preset.getAttribute('data-preset').split(',');
        ['theme.c1', 'theme.c2', 'theme.c3', 'theme.bg'].forEach(function (p, i) {
          setAt(p, v[i]);
          var c = $('[data-color][data-path="' + p + '"]'), m = $('[data-mirror="' + p + '"]');
          if (c) c.value = v[i];
          if (m) m.value = v[i];
        });
        applyTheme();
        DIRTY = true;
        return;
      }

      if (t.closest('[data-save]')) { save(t.closest('[data-save]')); return; }
      if (t.closest('[data-reset]')) { doReset(); return; }
      if (t.closest('[data-account]')) { saveAccount(t.closest('[data-account]')); return; }
    });

    var st = $('#sideToggle');
    if (st) st.addEventListener('click', function () { $('#side').classList.toggle('is-open'); });

    $$('.side__link').forEach(function (a) {
      a.addEventListener('click', function () { $('#side').classList.remove('is-open'); });
    });

    var out = $('[data-logout]');
    if (out) out.addEventListener('click', function (e) {
      e.preventDefault();
      api('logout', {}).then(function () { location.reload(); }).catch(function () { location.reload(); });
    });

    /* media picker */
    var pg = $('#picker');
    if (pg) {
      pg.addEventListener('click', function (e) { if (e.target.closest('[data-pick-close]')) closePicker(); });
      $('#pickUpload').addEventListener('change', function () {
        uploadFiles(this.files, $('#pickStatus'), function () { closePicker(); openPicker(pickTarget); });
        this.value = '';
      });
    }

    var mu = $('#mediaUpload');
    if (mu) mu.addEventListener('change', function () {
      uploadFiles(this.files, $('#mediaStatus'), loadMedia);
      this.value = '';
    });
  }

  /* =========================================================
     SAVE
     ========================================================= */
  function save(btn) {
    collect($('#secForm'));
    var old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Saving…';
    api('save', { content: C }).then(function (res) {
      VER = res.ver;
      DIRTY = false;
      toast('Saved. Your website is updated.');
    }).catch(function (err) {
      toast(err.message, true);
    }).then(function () {
      btn.disabled = false; btn.textContent = old;
    });
  }

  function doReset() {
    if (!window.confirm('Put the original text back on every page? Your images, theme and login are kept.')) return;
    api('reset', {}).then(function (res) {
      C = res.content; VER = res.ver; DIRTY = false;
      toast('Content reset.');
      render();
    }).catch(function (err) { toast(err.message, true); });
  }

  function saveAccount(btn) {
    var body = {
      user: $('#acUser').value,
      current: $('#acCurrent').value,
      pass: $('#acPass').value,
      pass2: $('#acPass2').value
    };
    if (!body.current) { toast('Enter your current password.', true); return; }
    var old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Updating…';
    api('account', body).then(function (res) {
      USER = res.user;
      DIRTY = false;
      MUST_CHANGE = res.mustChange === true;
      toast(MUST_CHANGE ? 'Account updated.' : 'Password set. Everything is unlocked.');
      if (!MUST_CHANGE) { location.hash = 'dashboard'; PAGE = 'dashboard'; }
      render();
    }).catch(function (err) { toast(err.message, true); })
      .then(function () { btn.disabled = false; btn.textContent = old; });
  }

  /* =========================================================
     MEDIA
     ========================================================= */
  function fetchMedia(force) {
    if (MEDIA && !force) return Promise.resolve(MEDIA);
    return api('media').then(function (res) { MEDIA = res.items || []; return MEDIA; });
  }

  function fmtSize(n) {
    if (!n) return '';
    return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB';
  }

  function loadMedia() {
    var grid = $('#mediaGrid');
    if (!grid) return;
    fetchMedia(true).then(function (items) {
      var html = items.map(function (m) {
        return '<div class="media"><img src="' + esc(m.path) + '" alt="" loading="lazy" />' +
          '<div class="media__meta"><span class="media__name" title="' + esc(m.name) + '">' + esc(m.name) + '</span>' +
          '<span>' + esc(fmtSize(m.size)) + '</span></div>' +
          '<div class="media__acts"><button type="button" class="btn btn--xs btn--ghost" data-copy="' + esc(m.path) + '">Copy path</button>' +
          '<button type="button" class="btn btn--xs btn--danger" data-mdel="' + esc(m.key) + '">Delete</button></div></div>';
      }).join('');

      html += BUNDLED.map(function (p) {
        return '<div class="media media--locked"><img src="../' + esc(p) + '" alt="" loading="lazy" />' +
          '<div class="media__meta"><span class="media__name">' + esc(p.split('/').pop()) + '</span><span>bundled</span></div>' +
          '<div class="media__acts"><button type="button" class="btn btn--xs btn--ghost" data-copy="' + esc(p) + '">Copy path</button></div></div>';
      }).join('');

      grid.innerHTML = html || '<p class="panel__note">No images yet — upload one above.</p>';

      grid.onclick = function (e) {
        var c = e.target.closest('[data-copy]');
        if (c) {
          var v = c.getAttribute('data-copy');
          if (navigator.clipboard) navigator.clipboard.writeText(v);
          toast('Copied: ' + v);
          return;
        }
        var d = e.target.closest('[data-mdel]');
        if (d) {
          if (!window.confirm('Delete this image? Anywhere it is used will show a broken image.')) return;
          api('media/delete', { key: d.getAttribute('data-mdel') })
            .then(function () { toast('Image deleted.'); loadMedia(); })
            .catch(function (err) { toast(err.message, true); });
        }
      };
    }).catch(function (err) { grid.innerHTML = '<p class="alert alert--error">' + esc(err.message) + '</p>'; });
  }

  function uploadFiles(files, statusEl, done) {
    files = Array.prototype.slice.call(files || []);
    if (!files.length) return;
    var okCount = 0, i = 0;

    function next() {
      if (i >= files.length) {
        if (statusEl) statusEl.textContent = okCount + ' image' + (okCount === 1 ? '' : 's') + ' uploaded.';
        MEDIA = null;
        if (done) done();
        return;
      }
      var f = files[i++];
      if (statusEl) statusEl.textContent = 'Uploading ' + f.name + '…';
      var fr = new FileReader();
      fr.onload = function () {
        api('upload', { name: f.name, data: fr.result })
          .then(function () { okCount++; })
          .catch(function (err) { toast(f.name + ': ' + err.message, true); })
          .then(next);
      };
      fr.onerror = function () { toast('Could not read ' + f.name, true); next(); };
      fr.readAsDataURL(f);
    }
    next();
  }

  /* ---------------- picker ---------------- */
  var pickTarget = null;

  function openPicker(input) {
    pickTarget = input;
    var box = $('#picker'), grid = $('#pickGrid');
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    grid.innerHTML = '<p class="panel__note">Loading…</p>';

    fetchMedia().then(function (items) {
      var all = items.map(function (m) { return [m.path, m.name]; })
        .concat(BUNDLED.map(function (p) { return [p, p.split('/').pop()]; }));
      grid.innerHTML = all.map(function (a) {
        return '<button type="button" class="pick-item" data-val="' + esc(a[0]) + '">' +
          '<img src="' + esc(thumbSrc(a[0])) + '" alt="" loading="lazy" /><span>' + esc(a[1]) + '</span></button>';
      }).join('') || '<p class="panel__note">No images yet — upload one above.</p>';

      grid.onclick = function (e) {
        var b = e.target.closest('[data-val]');
        if (!b || !pickTarget) return;
        pickTarget.value = b.getAttribute('data-val');
        var t = pickTarget.parentElement.querySelector('.imgfld__thumb');
        if (t) t.src = thumbSrc(pickTarget.value);
        DIRTY = true;
        closePicker();
      };
    }).catch(function (err) { grid.innerHTML = '<p class="alert alert--error">' + esc(err.message) + '</p>'; });
  }

  function closePicker() {
    var box = $('#picker');
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
  }

  /* =========================================================
     MESSAGES
     ========================================================= */
  function loadMessages() {
    var list = $('#msgList');
    if (!list) return;
    api('messages').then(function (res) {
      var items = res.items || [];
      list.innerHTML = items.length ? items.map(function (m) {
        var when = m.at ? new Date(m.at).toLocaleString() : '';
        return '<article class="msg"><div class="msg__head"><strong>' + esc(m.name) + '</strong>' +
          (m.service ? '<span class="msg__svc">' + esc(m.service) + '</span>' : '') +
          '<button type="button" class="btn btn--xs btn--danger" data-msgdel="' + esc(m.id) + '">Delete</button></div>' +
          '<p class="msg__meta"><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>' +
          (m.phone ? ' · ' + esc(m.phone) : '') + ' · ' + esc(when) + '</p>' +
          '<p class="msg__text">' + esc(m.message) + '</p></article>';
      }).join('') : '<p class="panel__note">No messages yet.</p>';

      list.onclick = function (e) {
        var d = e.target.closest('[data-msgdel]');
        if (!d) return;
        if (!window.confirm('Delete this message?')) return;
        api('messages/delete', { id: d.getAttribute('data-msgdel') })
          .then(function () { toast('Message deleted.'); loadMessages(); })
          .catch(function (err) { toast(err.message, true); });
      };
    }).catch(function (err) { list.innerHTML = '<p class="alert alert--error">' + esc(err.message) + '</p>'; });
  }

  /* =========================================================
     LOGIN
     ========================================================= */
  function showLogin(message) {
    document.body.className = 'login-body';
    document.body.innerHTML =
      '<div class="login-orb login-orb--1"></div><div class="login-orb login-orb--2"></div>' +
      '<div class="login-wrap"><form class="login-card" id="loginForm">' +
      '<div class="login-brand"><span class="brand-mark">AA</span><div><strong>Admin Panel</strong>' +
      '<small>Portfolio Website</small></div></div>' +
      (message ? '<p class="alert alert--error" id="loginMsg">' + esc(message) + '</p>'
               : '<p class="alert alert--error" id="loginMsg" style="display:none"></p>') +
      '<label class="fld"><span>Username</span><input type="text" id="lgUser" autocomplete="username" autofocus /></label>' +
      '<label class="fld"><span>Password</span><span class="pw"><input type="password" id="lgPass" autocomplete="current-password" />' +
      '<button type="button" class="pw-toggle" id="lgToggle" aria-label="Show password">Show</button></span></label>' +
      '<button type="submit" class="btn btn--primary btn--block" id="lgBtn">Sign In</button>' +
      '<p class="login-foot"><a href="../index.html">&larr; Back to the website</a></p>' +
      '</form></div>';

    $('#lgToggle').addEventListener('click', function () {
      var p = $('#lgPass');
      p.type = p.type === 'password' ? 'text' : 'password';
      this.textContent = p.type === 'password' ? 'Show' : 'Hide';
    });

    $('#loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('#lgBtn'), msg = $('#loginMsg');
      btn.disabled = true; btn.textContent = 'Signing in…';
      msg.style.display = 'none';
      api('login', { user: $('#lgUser').value, pass: $('#lgPass').value })
        .then(function () { location.reload(); })
        .catch(function (err) {
          msg.textContent = err.message;
          msg.style.display = '';
          btn.disabled = false; btn.textContent = 'Sign In';
        });
    });
  }

  /* =========================================================
     BOOT
     ========================================================= */
  function routeFromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    return SECTIONS.some(function (s) { return s[0] === h; }) ? h : 'dashboard';
  }

  window.addEventListener('hashchange', function () {
    if (!C) return;
    if (DIRTY && !window.confirm('You have unsaved changes on this page. Leave without saving?')) {
      location.hash = PAGE;
      return;
    }
    DIRTY = false;
    PAGE = routeFromHash();
    render();
  });

  window.addEventListener('beforeunload', function (e) {
    if (DIRTY) { e.preventDefault(); e.returnValue = ''; }
  });

  fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (!s) {
        showLogin('The backend is not running on this site yet. Open START-HERE.html in the folder I sent you — Step 2 explains the one-time setup.');
        return;
      }
      if (!s.ok) { showLogin(''); return; }
      USER = s.user;
      MUST_CHANGE = s.mustChange === true;
      return api('content').then(function (res) {
        C = res.content; VER = res.ver;
        PAGE = routeFromHash();
        render();
      });
    })
    .catch(function (err) {
      showLogin(err && err.message ? err.message : 'Could not reach the server.');
    });
})();
