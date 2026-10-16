/* =========================================================
   PORTFOLIO — INTERACTIONS
   Interaction layer. Exposed as AKSite.init() so it can run
   again after the page is re-rendered with saved content.
   ========================================================= */
window.AKSite = (function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var globalsBound = false;   /* document/window listeners: bind once only */
  var introDone = false;

  function hasGSAP() { return typeof window.gsap !== 'undefined'; }
  function showNow(el) { el.style.opacity = 1; el.style.transform = 'none'; }
  function $(id) { return document.getElementById(id); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------------- Preloader ---------------- */
  function preloader() {
    var pre = $('preloader');
    if (!pre) { intro(); return; }
    var bar = pre.querySelector('.preloader__bar span');
    var pct = 0;
    var tick = setInterval(function () {
      pct = Math.min(100, pct + Math.random() * 18 + 8);
      if (bar) bar.style.width = pct + '%';
      if (pct >= 100) clearInterval(tick);
    }, 130);

    function finish() {
      clearInterval(tick);
      if (bar) bar.style.width = '100%';
      setTimeout(function () {
        pre.classList.add('is-done');
        document.body.classList.add('is-loaded');
        intro();
      }, 320);
    }
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    setTimeout(function () { if (!pre.classList.contains('is-done')) finish(); }, 3200);
  }

  /* ---------------- Hero intro ---------------- */
  function intro() {
    if (introDone) return;
    introDone = true;

    var heads = all('.hero .reveal, .page-hero .reveal');
    var lines = all('.hero__title .line, .page-hero__title .line');

    if (!hasGSAP() || reduced) {
      heads.forEach(showNow); lines.forEach(showNow);
      return;
    }
    heads.forEach(function (el) {
      gsap.to(el, { y: 0, opacity: 1, duration: .9, delay: .3 + parseFloat(el.dataset.delay || 0),
        ease: 'power3.out', clearProps: 'transform' });
    });
    lines.forEach(function (el, i) {
      gsap.fromTo(el, { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: .25 + i * .09, ease: 'power3.out', clearProps: 'all' });
    });
    if (document.querySelector('.portrait')) gsap.from('.portrait', { scale: .92, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .2 });
    if (document.querySelector('.float-card')) gsap.from('.float-card', { y: 26, opacity: 0, duration: .8, stagger: .16, delay: 1 });
  }

  /* Safety net — above-the-fold text must never stay invisible */
  function safetyNet() {
    setTimeout(function () {
      all('.hero .reveal, .page-hero .reveal, .hero__title .line, .page-hero__title .line')
        .forEach(function (el) { if (parseFloat(getComputedStyle(el).opacity) < .99) showNow(el); });
    }, 4000);
  }

  /* ---------------- Scroll reveals ---------------- */
  function reveals() {
    var items = all('.reveal');
    if (hasGSAP() && window.ScrollTrigger && !reduced) {
      items.forEach(function (el) {
        if (el.closest('.hero') || el.closest('.page-hero')) return;
        gsap.to(el, { y: 0, opacity: 1, duration: .9, ease: 'power3.out',
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
        e.target.style.transitionDelay = parseFloat(e.target.dataset.delay || 0) + 's';
        e.target.style.opacity = 1;
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
    all('.hero .reveal, .page-hero .reveal').forEach(showNow);
  }

  /* ---------------- Animated counters ---------------- */
  function counters() {
    var nodes = all('.count');
    if (!nodes.length) return;
    function run(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.dataset.target) || 0;
      var dec = parseInt(el.dataset.decimals || 0, 10);
      var start = performance.now();
      (function frame(now) {
        var p = Math.min(1, (now - start) / 1900);
        var val = target * (1 - Math.pow(1 - p, 3));
        el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = dec ? target.toFixed(dec) : Math.round(target).toLocaleString('en-US');
      })(start);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: .5 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------------- Navbar ---------------- */
  function navbar() {
    var burger = $('navBurger'), links = $('navLinks');
    if (!burger || !links) return;
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-open');
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('is-open');
        links.classList.remove('is-open');
      });
    });
  }

  /* ---------------- Scroll progress / sticky nav / to-top / scrollspy ----------------
     The header and footer live inside #ak-app, so they are replaced whenever the
     page re-renders with saved content. The scroll listener is bound once, but the
     elements it touches are looked up again on every (re-)init — otherwise it keeps
     styling the old, detached header and the navbar never gets its background. */
  var SC = null;

  function refreshScrollNodes() {
    var spy = all('.nav__link[href^="#"]');
    SC = {
      nav: $('nav'), progress: $('scrollProgress'), toTop: $('toTop'), spy: spy,
      sections: spy.map(function (l) { return document.querySelector(l.getAttribute('href')); })
    };
  }

  function onScroll() {
    if (!SC) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (SC.progress) SC.progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (SC.nav) SC.nav.classList.toggle('is-stuck', y > 24);
    if (SC.toTop) SC.toTop.classList.toggle('is-visible', y > 600);
    if (!SC.spy.length) return;
    var idx = -1;
    SC.sections.forEach(function (s, i) { if (s && s.offsetTop - 140 <= y) idx = i; });
    SC.spy.forEach(function (l, i) { l.classList.toggle('is-active', i === idx); });
  }

  function scrollUi() {
    refreshScrollNodes();
    if (!globalsBound) window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Spotlight + magnetic ---------------- */
  function pointerFx() {
    all('.card, .svc-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    if (reduced || !window.matchMedia('(hover:hover)').matches) return;
    all('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' +
          ((e.clientX - r.left - r.width / 2) * .25) + 'px,' +
          ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------- Cursor (dot + lagging ring) ---------------- */
  function cursor() {
    var ring = $('cursor'), dot = $('cursorDot');
    if (!ring || !dot) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var shown = false;

    window.addEventListener('mousemove', function (e) {
      if (!shown) { shown = true; document.body.classList.add('cursor-ready'); }
      var t = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      dot.style.transform = t; ring.style.transform = t;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('cursor-ready'); shown = false;
    });

    var HOT = 'a,button,[role="button"],.shot,.svc-card,.card,.work-card,.tcard,.slider__btn,input,textarea,select,[data-cursor]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(HOT)) document.body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(HOT)) document.body.classList.remove('cursor-hot');
    });
  }

  /* ---------------- Portrait tilt ---------------- */
  function tilt() {
    var el = document.querySelector('[data-tilt]');
    if (!el || reduced || !window.matchMedia('(hover:hover)').matches) return;
    var wrap = el.parentElement;
    wrap.addEventListener('mousemove', function (e) {
      var r = wrap.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      el.style.transition = 'transform .15s ease-out';
      el.style.transform = 'rotateY(' + (px * 9) + 'deg) rotateX(' + (-py * 9) + 'deg)';
    });
    wrap.addEventListener('mouseleave', function () {
      el.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
      el.style.transform = '';
    });
  }

  /* ---------------- Rotating role text ---------------- */
  function roles() {
    var wrap = $('roleRotate');
    if (!wrap || !wrap.children.length) return;
    var items = wrap.children, i = 0;
    for (var k = 0; k < items.length; k++) items[k].style.opacity = (k === 0) ? 1 : 0;
    if (reduced) return;
    setInterval(function () {
      i = (i + 1) % items.length;
      var offset = -i * items[0].offsetHeight;
      for (var k = 0; k < items.length; k++) {
        items[k].style.transition = 'transform .7s cubic-bezier(.22,1,.36,1), opacity .5s ease';
        items[k].style.transform = 'translateY(' + offset + 'px)';
        items[k].style.opacity = (k === i) ? 1 : 0;
      }
    }, 2600);
  }

  /* ---------------- Testimonials slider (home) ---------------- */
  function slider() {
    var track = $('sliderTrack'), dotsWrap = $('sliderDots');
    if (!track || !track.children.length) return;
    var total = track.children.length, index = 0, timer = null;

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < total; i++) (function (n) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to testimonial ' + (n + 1));
        b.addEventListener('click', function () { go(n); restart(); });
        dotsWrap.appendChild(b);
      })(i);
    }
    function go(n) {
      index = (n + total) % total;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      if (!dotsWrap) return;
      var dots = dotsWrap.children;
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', i === index);
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(index + 1); }, 6500); }

    var prev = $('prevBtn'), next = $('nextBtn');
    if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(index + 1); restart(); });

    var sx = 0, dx = 0, dragging = false;
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; dragging = true; }, { passive: true });
    track.addEventListener('touchmove', function (e) { if (dragging) dx = e.touches[0].clientX - sx; }, { passive: true });
    track.addEventListener('touchend', function () {
      if (Math.abs(dx) > 55) go(index + (dx < 0 ? 1 : -1));
      dx = 0; dragging = false; restart();
    });
    go(0); restart();
  }

  /* ---------------- My Work: screenshot viewer ---------------- */
  function shotViewer() {
    var box = $('shotBox');
    if (!box) return;
    var img = $('shotImg'), title = $('shotTitle'), text = $('shotText'), last = null;

    function open(card) {
      last = card;
      if (img) { img.src = card.dataset.full || ''; img.alt = card.dataset.title || ''; }
      if (title) title.textContent = card.dataset.title || '';
      if (text) {
        text.textContent = card.dataset.text || '';
        text.style.display = (card.dataset.text || '').trim() ? '' : 'none';
      }
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      box.scrollTop = 0;
      var x = box.querySelector('.lb__close');
      if (x) x.focus();
    }
    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (last) last.focus();
    }
    all('.shot').forEach(function (card) {
      card.addEventListener('click', function () { open(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
    box.addEventListener('click', function (e) { if (e.target.closest('[data-shot-close]')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }

  /* ---------------- Testimonials: swap card into featured ---------------- */
  function featuredSwap() {
    var grid = $('tGrid'), featured = $('tFeatured'), inner = $('tFeaturedInner');
    if (!grid || !featured || !inner) return;
    var cards = all('#tGrid .tcard');
    var el = { svc: $('tfSvc'), text: $('tfText'), avatar: $('tfAvatar'), name: $('tfName'), role: $('tfRole') };

    function show(card) {
      if (card.classList.contains('is-active')) return;
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      card.classList.add('is-active');
      var quote = card.querySelector('.tcard__text'), d = card.dataset;

      inner.classList.add('is-swapping');
      setTimeout(function () {
        if (el.svc) el.svc.textContent = d.svc || '';
        if (el.text && quote) el.text.textContent = quote.textContent.trim();
        if (el.name) el.name.textContent = d.name || '';
        if (el.role) el.role.textContent = d.role || '';
        if (el.avatar) {
          el.avatar.textContent = d.init || '';
          el.avatar.style.setProperty('--a', d.a || '#35E0F0');
          el.avatar.style.setProperty('--b', d.b || '#7B5CFF');
        }
        inner.classList.remove('is-swapping');
      }, 340);

      window.scrollTo({ top: featured.getBoundingClientRect().top + window.scrollY - 110,
        behavior: reduced ? 'auto' : 'smooth' });
    }
    cards.forEach(function (card) {
      card.addEventListener('click', function () { show(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(card); }
      });
    });
  }

  /* ---------------- Contact form ----------------
     Posts to /api/contact, which stores the message so it shows
     up in the Admin Panel inbox. No fake success: the panel only
     opens when the server confirms it saved. */
  function contactForm() {
    var form = $('contactForm');
    if (!form) return;
    var alertBox = $('formAlert'), success = $('formSuccess'), resetBtn = $('formReset');

    function fieldOf(el) { return el.closest('.field'); }
    function validate(el) {
      var v = (el.value || '').trim(), ok = true;
      if (el.id === 'cEmail') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (el.id === 'cPhone') ok = v === '' || /^[0-9+()\-\s]{6,}$/.test(v);
      else if (el.id === 'cMessage') ok = v.length >= 10;
      else ok = v !== '';
      var f = fieldOf(el);
      if (f) f.classList.toggle('has-error', !ok);
      return ok;
    }

    var watched = ['cName', 'cEmail', 'cPhone', 'cService', 'cMessage']
      .map($).filter(Boolean);

    watched.forEach(function (el) {
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('change', function () { validate(el); });
      el.addEventListener('input', function () {
        var f = fieldOf(el);
        if (f && f.classList.contains('has-error')) validate(el);
      });
    });

    function say(msg, ok) {
      if (!alertBox) return;
      alertBox.textContent = msg;
      alertBox.className = 'form-alert' + (ok ? ' is-ok' : '');
      alertBox.style.display = msg ? '' : 'none';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = true, firstBad = null;
      watched.forEach(function (el) { if (!validate(el)) { allOk = false; if (!firstBad) firstBad = el; } });
      if (!allOk) {
        say('Please check the highlighted fields.', false);
        if (firstBad) {
          firstBad.focus();
          firstBad.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.classList.add('is-busy'); }
      say('', true);

      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          if (res && res.ok) {
            form.style.display = 'none';
            if (success) success.classList.add('is-shown');
          } else {
            say((res && res.error) || 'Sorry — the message could not be sent. Please email me directly.', false);
          }
        })
        .catch(function () {
          say('Network problem — please try again, or email me directly.', false);
        })
        .then(function () { if (btn) { btn.disabled = false; btn.classList.remove('is-busy'); } });
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      form.reset();
      form.style.display = '';
      if (success) success.classList.remove('is-shown');
      say('', true);
      all('.field').forEach(function (f) { f.classList.remove('has-error'); });
    });
  }

  /* ---------------- Smooth anchor scroll ---------------- */
  function anchors() {
    if (globalsBound) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70,
        behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Boot ---------------- */
  function init(opts) {
    opts = opts || {};
    if (hasGSAP() && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      if (opts.refresh) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    } else {
      document.documentElement.classList.add('no-gsap');
    }

    /* Bind-once, document-level */
    anchors();
    if (!globalsBound) cursor();

    /* Re-bindable, element-level */
    scrollUi();
    navbar(); reveals(); counters(); pointerFx(); tilt(); roles();
    slider(); shotViewer(); featuredSwap(); contactForm();
    safetyNet();

    if (opts.refresh) { introDone = false; intro(); }
    else preloader();

    if (hasGSAP() && window.ScrollTrigger) ScrollTrigger.refresh();
    globalsBound = true;
  }

  return { init: init };
})();
