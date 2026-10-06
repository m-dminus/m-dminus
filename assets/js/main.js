/* =============================================================================
   MASKATECH LABS — main.js
   Vanilla ES2020, progressive enhancement. Every feature degrades to the static
   markup when JavaScript is unavailable.
     1. Config injection (site-config.js → DOM)
     2. Nav (scroll state, mobile menu, active section)
     3. Scroll reveals
     4. Hero: scan → design → print of a night guard (canvas 2D)
     5. Workflow stage sync
     6. Pointer glow + magnetic buttons (fine pointers only)
     7. Contact form → prefilled mailto:
     8. Footer year
   ============================================================================= */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const cfg = window.MASKATECH_CONFIG || {};
  // A browser that runs this syntax has matchMedia, but a stripped-down embedded view can lack it. Treat every query
  // as unmatched there instead of throwing before the rest of the script (scroll reveals included) has run.
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener() {}, addListener() {} });
  const reduceMQ = mq('(prefers-reduced-motion: reduce)');
  const fineMQ = mq('(hover: hover) and (pointer: fine)');
  const prefersReduced = () => reduceMQ.matches;
  // Safari < 14 only has the legacy addListener
  const onMQ = (mq, fn) => (mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn));
  const $ = (sel, r = doc) => r.querySelector(sel);
  const $$ = (sel, r = doc) => Array.from(r.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------------------------------------------------------------------
     1. Config injection
     data-cfg="path.to.value"      → textContent
     data-cfg-link="path.to.value" → href (mailto: for emails, tel: for phones)
     --------------------------------------------------------------------------- */
  const getPath = (path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), cfg);
  // A phone number, written any common US way ("(773) 857-2290", "773.857.2290", "1-773-857-2290", "+1 773 857 2290"):
  // digits plus the usual separators, with at least 7 digits so a stray short numeric string isn't misread as one.
  const isPhone = (v) => /^[\d\s().+-]+$/.test(v) && (v.match(/\d/g) || []).length >= 7;
  // An extension after the number ("773 857 2290 ext 3", "773-857-2290 x12") is split off first and kept as ;ext=N
  // (RFC 3966), so its digits are not folded into the number itself.
  const phoneExt = /^(.*?\d)[\s,]*(?:ext\.?|extension|x)\s*(\d{1,6})$/i;
  $$('[data-cfg]').forEach((el) => {
    const v = getPath(el.dataset.cfg);
    if (typeof v === 'string' && v.trim()) el.textContent = v.trim();
  });
  $$('[data-cfg-link]').forEach((el) => {
    const raw = getPath(el.dataset.cfgLink);
    if (typeof raw !== 'string' || !raw.trim()) return;
    const v = raw.trim();
    const ext = v.match(phoneExt);
    const number = ext ? ext[1] : v;
    if (v.includes('@')) el.setAttribute('href', 'mailto:' + v);
    else if (isPhone(number)) {
      // A number written with "+" already carries its country code ("+1 773 …", "+44 20 …", "(+44) 20 …") and is
      // used as written, less any "(0)" ("+44 (0)20 …"), the national trunk prefix that is not dialled from abroad.
      // Otherwise a leading 00 or 011 is an international dialling prefix, never part of a US number (US area codes
      // start with 2-9), so it is dropped and the country code that follows is kept. What is left without either is
      // a US number: one already written with its country code (11 digits starting with 1) keeps it, a bare 10-digit
      // number gets a 1 prefixed. Writing the same number any of these ways produces the same tel: link.
      const plus = /^\(?\+/.test(number);
      const digits = (plus ? number.replace(/\(0\)/g, '') : number).replace(/\D/g, '');
      const intl = plus ? digits : digits.replace(/^(?:011|00)/, '');
      const withCountry = plus || intl !== digits || (intl.length === 11 && intl[0] === '1') ? intl : '1' + intl;
      el.setAttribute('href', 'tel:+' + withCountry + (ext ? ';ext=' + ext[2] : ''));
    }
    else el.setAttribute('href', v);
  });
  const form = $('#case-form');
  const contactEmail = typeof cfg.contactEmail === 'string' ? cfg.contactEmail.trim() : '';
  if (form && contactEmail.includes('@')) {
    form.setAttribute('action', 'mailto:' + contactEmail);
  }

  /* ---------------------------------------------------------------------------
     2. Nav
     --------------------------------------------------------------------------- */
  const nav = $('#nav');
  const navToggle = nav && $('.nav-toggle', nav);
  const navMenu = $('#nav-menu');
  const progress = $('#nav-progress');
  const behind = $$('main, footer');
  if (nav) {
    let ticking = false;
    const paint = () => {
      ticking = false;
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
      if (progress) {
        const max = root.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0).toFixed(4) + ')';
      }
    };
    paint();
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  }
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    behind.forEach((el) => { if ('inert' in el) el.inert = open; }); // the page behind the open menu is not reachable
    root.classList.toggle('menu-open', open);
    if (open) { const first = $('a', navMenu); if (first) first.focus(); }
  };
  if (nav && navToggle && navMenu) {
    navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    navMenu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false); navToggle.focus(); return; }
      if (e.key === 'Tab') {                                       // keep focus inside the open menu
        const f = [navToggle].concat($$('a, button', navMenu));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    doc.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 980 && nav.classList.contains('is-open')) setMenu(false); }, { passive: true });  // matches the @media (max-width: 980px) breakpoint in style.css
  }
  // Active link follows the section in view
  const links = $$('.nav-link');
  const sections = links.map((a) => $(a.getAttribute('href'))).concat([$('#top'), $('#contact')]).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + en.target.id;   // hero / contact match no link → all cleared
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------------------------
     3. Scroll reveals
     --------------------------------------------------------------------------- */
  // CSS hides [data-reveal] only once this class is set. It is set here, right before the code that reveals them
  // again, so an error anywhere above leaves the content showing rather than hidden for good.
  root.classList.add('reveal');
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------------------------------------------------------------------------
     4. Hero — scan → design → print
     A night guard is modelled as a stack of horizontal contour rings (the outer
     and inner wall of an inverted-U cross-section swept along a parabolic arch).
     Phase 1 "scan": surface points appear.  Phase 2 "design": a wireframe draws
     in over the points.  Phase 3 "print": rings fill from the base with a bright
     active layer, then the whole object holds and fades before the loop repeats.
     Readouts show the animation's own phase, layer count and orbit angle only.
     --------------------------------------------------------------------------- */
  const stage = $('#hero-stage');
  const canvas = $('#hero-canvas');
  const motionBtn = $('#hud-motion');
  if (stage && canvas && canvas.getContext) {
    // getContext returns null when the browser cannot give the page a 2D context (canvas blocked by a privacy
    // setting or extension, a lost GPU process). The static fallback then stays, as without JavaScript; start() below
    // never runs the animation, and the readouts that describe it are hidden (CSS). The Motion toggle stays: it also
    // pauses the ticker and the workflow glyphs.
    const ctx = canvas.getContext('2d');
    if (!ctx) stage.classList.add('no-canvas');
    const hudLayer = $('#hud-layer'), hudOrbit = $('#hud-orbit'), hudTotal = $('#hud-total');
    const phasePills = $$('.hud-phase', stage);

    /* @geometry-start (assets/img/appliance-layers.svg is generated from the same parameters) */
    const A = 1.0, B = 1.35, YOFF = 0.62, HGT = 0.42;
    const small = window.innerWidth < 700;
    const NL = small ? 56 : 72, NS = small ? 64 : 84, NPTS = small ? 1500 : 2600;
    const center = (t) => ({ x: A * t, y: B * t * t - YOFF });
    const tangent = (t) => { const dx = A, dy = 2 * B * t, l = Math.hypot(dx, dy); return { x: dx / l, y: dy / l }; };
    const width = (t) => 0.30 + 0.16 * Math.min(1, Math.abs(t) * 1.15);
    const teeth = (t) => Math.pow(Math.max(0, Math.cos(7.5 * t * Math.PI)), 3);
    const CX = 0, CY = 0.05, CZ = HGT * 0.5;            // centroid, subtracted before rotation
    const layers = [];
    for (let k = 0; k < NL; k++) {
      const z = HGT * (k / (NL - 1));
      const f = Math.sqrt(Math.max(0, 1 - Math.pow(z / HGT, 2)));
      const outer = new Float32Array((NS + 1) * 3), inner = new Float32Array((NS + 1) * 3);
      for (let i = 0; i <= NS; i++) {
        const t = -1 + 2 * i / NS, c = center(t), tg = tangent(t), nx = tg.y, ny = -tg.x;
        const wv = width(t) / 2 * f, bump = 0.035 * teeth(t) * f, ridge = 0.03 * teeth(t) * (1 - f);
        outer[i * 3] = c.x + nx * (wv + bump) - CX; outer[i * 3 + 1] = c.y + ny * (wv + bump) - CY; outer[i * 3 + 2] = z + ridge - CZ;
        inner[i * 3] = c.x - nx * (wv + bump * 0.5) - CX; inner[i * 3 + 1] = c.y - ny * (wv + bump * 0.5) - CY; inner[i * 3 + 2] = z + ridge - CZ;
      }
      layers.push({ outer, inner });
    }
    const cloud = new Float32Array(NPTS * 4);
    { let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < NPTS; i++) {
        const t = -1 + 2 * rnd(), v = Math.PI * rnd(), f = Math.cos(v), z = HGT * Math.sin(v);
        const c = center(t), tg = tangent(t), nx = tg.y, ny = -tg.x;
        const wv = width(t) / 2 * f + 0.035 * teeth(t) * Math.abs(f);
        cloud[i * 4] = c.x + nx * wv - CX; cloud[i * 4 + 1] = c.y + ny * wv - CY; cloud[i * 4 + 2] = z + 0.03 * teeth(t) * (1 - Math.abs(f)) - CZ; cloud[i * 4 + 3] = rnd();
      }
    }
    /* @geometry-end */
    if (hudTotal) hudTotal.textContent = '/' + String(NL).padStart(3, '0');

    let W = 0, H = 0, scale = 1, cx = 0, cy = 0;
    // Frame guard: if drawing runs long, draw every other ring / point (then every third); recover when it is cheap again
    let stride = 1, slowFrames = 0, cheapFrames = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(W, H) * 0.35; cx = W * 0.52; cy = H * 0.52;
    };

    // Camera
    const D = 3.2;
    let cyaw = 1, syaw = 0, cpit = 1, spit = 0;
    const setCamera = (yaw, pitch) => { cyaw = Math.cos(yaw); syaw = Math.sin(yaw); cpit = Math.cos(pitch); spit = Math.sin(pitch); };
    const px = new Float32Array(2), proj = (x, y, z) => {
      const rx = x * cyaw - y * syaw, ry = x * syaw + y * cyaw;
      const dy = ry * cpit - z * spit, rz = ry * spit + z * cpit;
      const k = D / (D + dy);
      px[0] = cx + rx * k * scale; px[1] = cy - rz * k * scale; return k;
    };
    const ring = (arr) => {
      ctx.beginPath();
      for (let i = 0, n = arr.length; i < n; i += 3) { proj(arr[i], arr[i + 1], arr[i + 2]); i ? ctx.lineTo(px[0], px[1]) : ctx.moveTo(px[0], px[1]); }
    };

    // Timeline (ms)
    const T_SCAN = 3600, T_DESIGN = 3000, T_PRINT = 6200, T_HOLD = 2600, T_FADE = 1100;
    const CYCLE = T_SCAN + T_DESIGN + T_PRINT + T_HOLD + T_FADE;
    const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    let t0 = 0, raf = 0, running = false, visible = true, lastPhase = '', lastLayer = -1, lastOrbit = -1;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const setPhase = (name) => {
      if (name === lastPhase) return; lastPhase = name;
      phasePills.forEach((p) => p.classList.toggle('is-on', p.dataset.phase === name));
    };

    const frame = (now) => {
      if (!running) return;
      if (!t0) t0 = now;
      const tStart = performance.now();
      const el = (now - t0) % CYCLE;
      pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
      const yaw = 0.78 + 0.32 * Math.sin((now - t0) * 0.00021) + pointer.x * 0.35;
      const pitch = 0.98 + pointer.y * 0.18;
      setCamera(yaw, pitch);

      ctx.clearRect(0, 0, W, H);
      const scanP = easeOut(clamp(el / T_SCAN, 0, 1));
      const designP = easeOut(clamp((el - T_SCAN) / T_DESIGN, 0, 1));
      const printP = clamp((el - T_SCAN - T_DESIGN) / T_PRINT, 0, 1);
      const fadeP = clamp((el - T_SCAN - T_DESIGN - T_PRINT - T_HOLD) / T_FADE, 0, 1);
      const phase = el < T_SCAN ? 'scan' : el < T_SCAN + T_DESIGN ? 'design' : 'print';
      ctx.globalAlpha = 1 - fadeP;

      // Ground glow under the object
      const g = ctx.createRadialGradient(cx, cy + scale * 0.55, 0, cx, cy + scale * 0.55, scale * 1.15);
      g.addColorStop(0, el < T_SCAN + T_DESIGN ? 'rgba(139, 124, 255, 0.12)' : 'rgba(255, 179, 92, 0.09)'); g.addColorStop(1, 'rgba(139, 124, 255, 0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // 1) point cloud — appears during scan, dissolves during design
      if (el < T_SCAN + T_DESIGN) {
        const a0 = el < T_SCAN ? 1 : 1 - designP;
        for (let i = 0; i < NPTS; i += stride) {
          if (cloud[i * 4 + 3] > scanP) continue;
          const k = proj(cloud[i * 4], cloud[i * 4 + 1], cloud[i * 4 + 2]);
          const a = a0 * (0.35 + 0.5 * (k - 0.75));
          ctx.fillStyle = 'rgba(214, 205, 255,' + a.toFixed(3) + ')';
          ctx.fillRect(px[0], px[1], 1.4, 1.4);
        }
      }
      // 2) wireframe — draws in along the arch during design, dims as the print takes over
      if (el >= T_SCAN) {
        const wa = el < T_SCAN + T_DESIGN ? 1 : Math.max(0.12, 1 - printP * 1.4);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(139, 124, 255,' + (0.6 * wa).toFixed(3) + ')';
        const nPts = Math.floor((NS + 1) * designP);
        for (let k = 0; k < NL; k += 9) {
          const L = layers[k];
          for (const arr of [L.outer, L.inner]) {
            ctx.beginPath();
            for (let i = 0; i < nPts; i++) { proj(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]); i ? ctx.lineTo(px[0], px[1]) : ctx.moveTo(px[0], px[1]); }
            ctx.stroke();
          }
        }
        ctx.strokeStyle = 'rgba(139, 124, 255,' + (0.38 * wa * designP).toFixed(3) + ')';
        for (let i = 0; i <= NS; i += 7) {
          ctx.beginPath();
          for (let k = 0; k < NL; k++) { const L = layers[k].outer; proj(L[i * 3], L[i * 3 + 1], L[i * 3 + 2]); k ? ctx.lineTo(px[0], px[1]) : ctx.moveTo(px[0], px[1]); }
          ctx.stroke();
        }
      }
      // 3) print — rings fill from the base; the active ring glows
      let nDone = 0;
      if (el >= T_SCAN + T_DESIGN) {
        nDone = Math.min(NL, Math.floor(NL * printP) + (printP >= 1 ? 0 : 1));
        for (let k = 0; k < nDone; k++) {
          const L = layers[k], active = printP < 1 && k === nDone - 1;
          if (!active && k % stride) continue;
          if (active) { ctx.strokeStyle = 'rgba(255, 224, 170, 1)'; ctx.lineWidth = 2.2; ctx.shadowColor = 'rgba(255, 179, 92, 0.95)'; ctx.shadowBlur = 16; }
          else { ctx.strokeStyle = 'rgba(226, 222, 245,' + (0.16 + 0.6 * (k / NL)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.shadowBlur = 0; }
          ring(L.outer); ctx.stroke(); ring(L.inner); ctx.stroke();
        }
        ctx.shadowBlur = 0;
        if (printP < 1) { // print plane at the active layer height
          const z = (nDone - 1) / (NL - 1) * HGT - CZ;
          proj(-1.45, -0.1, z); const x1 = px[0], y1 = px[1]; proj(1.45, -0.1, z);
          const lg = ctx.createLinearGradient(x1, y1, px[0], px[1]);
          lg.addColorStop(0, 'rgba(255, 179, 92, 0)'); lg.addColorStop(0.5, 'rgba(255, 179, 92, 0.6)'); lg.addColorStop(1, 'rgba(255, 179, 92, 0)');
          ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(px[0], px[1]); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Readouts (only when the value changes)
      setPhase(phase);
      const layerNo = el >= T_SCAN + T_DESIGN ? nDone : 0;
      if (layerNo !== lastLayer && hudLayer) { hudLayer.textContent = String(layerNo).padStart(3, '0'); lastLayer = layerNo; }
      const deg = Math.round((((yaw * 180) / Math.PI) % 360 + 360) % 360);
      if (deg !== lastOrbit && hudOrbit) { hudOrbit.textContent = String(deg).padStart(3, '0') + '°'; lastOrbit = deg; }

      const cost = performance.now() - tStart;
      if (cost > 12 && stride < 3) { cheapFrames = 0; if (++slowFrames >= 30) { stride++; slowFrames = 0; } }
      else if (cost < 5 && stride > 1) { slowFrames = 0; if (++cheapFrames >= 180) { stride--; cheapFrames = 0; } }
      else { slowFrames = Math.max(0, slowFrames - 1); }

      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!ctx || running || !visible) return; running = true; t0 = 0; stage.classList.add('is-live'); resize(); raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const motionOff = () => root.classList.contains('motion-off');
    // The canvas is always drawn with the dark-theme palette (rgba literals below), which the user agent does not
    // recolour the way it recolours CSS. Under forced colors (e.g. Windows High Contrast) those low-contrast
    // colours land on a Canvas-coloured background and the animation becomes unreadable while the HUD readouts keep
    // reporting a layer count and orbit angle for something the visitor cannot see. Keep the static SVG fallback
    // (and its alt text) showing instead, the same as under reduced motion.
    const forcedColorsMQ = mq('(forced-colors: active)');
    const forcedColors = () => forcedColorsMQ.matches;
    // Single source of truth for "is the animation allowed to run right now" — every call site below goes through
    // this (not just motionOff()) so forced colors is respected regardless of which event asks for a restart.
    const allowedToRun = () => !motionOff() && !forcedColors();
    const apply = () => { if (allowedToRun()) start(); else { stop(); stage.classList.remove('is-live'); } };

    // Motion toggle (also respects the OS reduced-motion setting on boot)
    const setMotion = (on, remember) => {
      root.classList.toggle('motion-off', !on);
      if (motionBtn) { motionBtn.setAttribute('aria-pressed', String(on)); const s = $('.hud-state', motionBtn); if (s) s.textContent = on ? 'on' : 'off'; }
      if (remember) { try { localStorage.setItem('maskatech-motion', on ? 'on' : 'off'); } catch { /* storage unavailable */ } }
      apply();
    };
    if (motionBtn) motionBtn.addEventListener('click', () => setMotion(motionOff(), true));
    // The OS setting always wins when it asks for reduced motion; short of that, a remembered "off" also wins.
    // Read fresh each time (not just once at boot) so a later OS-setting change still honours a stored "off"
    // instead of unconditionally turning the animation back on underneath it.
    const resolveMotion = () => {
      let stored = null; try { stored = localStorage.getItem('maskatech-motion'); } catch { /* storage unavailable */ }
      return prefersReduced() ? false : stored !== 'off';
    };
    onMQ(reduceMQ, () => setMotion(resolveMotion()));
    onMQ(forcedColorsMQ, apply);

    // Pause when off-screen or the tab is hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) { if (allowedToRun()) start(); } else stop(); }, { threshold: 0.05 }).observe(stage);
    }
    doc.addEventListener('visibilitychange', () => { if (doc.hidden) stop(); else if (allowedToRun() && visible) start(); });

    // Resize
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (running) resize(); }, 120); }, { passive: true });

    // Pointer parallax (fine pointers only)
    if (fineMQ.matches) {
      stage.addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(); pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; });
      stage.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });
    }

    setMotion(resolveMotion());
  }

  /* ---------------------------------------------------------------------------
     5. Workflow stage sync — the step nearest the viewport centre drives the glyph
     --------------------------------------------------------------------------- */
  const wfSteps = $$('[data-wf-step]');
  const wfGlyphs = $$('[data-wf-glyph]');
  const wfIdx = $('#wf-hud-idx'), wfName = $('#wf-hud-name');
  const wfNavEl = $('#nav'), wfCardEl = $('.wf-stage-card');
  if (wfSteps.length && wfGlyphs.length) {
    const activate = (i) => {
      wfSteps.forEach((s, j) => s.classList.toggle('is-active', i === j));
      wfGlyphs.forEach((g, j) => g.classList.toggle('is-active', i === j));
      if (wfIdx) wfIdx.textContent = String(i + 1).padStart(2, '0');
      if (wfName) { const n = $('.wf-name', wfSteps[i]); if (n) wfName.textContent = n.textContent; }
    };
    // Pick the step whose centre is nearest a target line, recomputed directly from layout on every scroll —
    // not gated by IntersectionObserver "is this step touching a fixed band" state. A band narrower than a step
    // (which the readable area below the sticky strip on a short viewport can be) means only one step, possibly
    // the wrong one, is ever "in" it at a given scroll position; scanning every step's actual position avoids that.
    // At <=860px the stage becomes an opaque sticky strip stacked over the steps (see the CSS comment above that
    // media query). Returns the strip's bottom edge in viewport px (0 on the wide layout, where there is no strip).
    const stripBottom = () => (wfNavEl && wfCardEl && mq('(max-width: 860px)').matches)
      ? wfNavEl.getBoundingClientRect().height + 8 /* the stage's own top offset above the card */ + wfCardEl.getBoundingClientRect().height
      : 0;
    let lastActive = -1;
    const pick = () => {
      const strip = stripBottom();
      const mid = (strip ? strip + 16 /* reading gap below the strip */ : 0) + (window.innerHeight - strip) / 2;
      // What hides a heading at the top: the strip, or on the wide layout (no strip) the fixed nav bar.
      const cover = strip || (wfNavEl ? Math.max(0, wfNavEl.getBoundingClientRect().bottom) : 0);
      // Nearest-to-mid alone still picks a step whose centre has drifted back up under the strip late in its own
      // scroll range, right before the next step would take over — "nearest" only needs the neighbour to be even
      // further away, which near the strip boundary it briefly isn't. Never choose a step still under the strip
      // while a step clear of it exists; only fall back to "least hidden" when nothing is clear yet (section entry).
      // "Under the strip" and "clear" are judged by the step's heading, not its box: the box starts at the step's
      // top padding (~32px above the heading), so by the box edge a step whose heading is still readable just below
      // the strip already counts as hidden, and the next step counts as clear while only its empty padding is on
      // screen, which made the strip name a step none of whose text was visible yet. A clear step's heading must also
      // be wholly on screen: on a 320px-tall viewport a heading peeking a few px above the bottom edge otherwise took
      // over while the previous step's text was still the only readable text.
      let bestClear = -1, bestClearDist = Infinity;
      let bestHidden = -1, bestHiddenTop = -Infinity;
      wfSteps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return; // off-screen entirely: not a candidate
        const n = $('.wf-name', s);
        const h = n ? n.getBoundingClientRect() : r;
        if (h.top >= cover) {
          if (h.bottom > window.innerHeight + 1) return;            // heading not fully on screen yet (1px for sub-pixel layout)
          const dist = Math.abs((r.top + r.bottom) / 2 - mid);
          if (dist < bestClearDist) { bestClearDist = dist; bestClear = i; }
        } else if (h.top > bestHiddenTop) { bestHiddenTop = h.top; bestHidden = i; }
      });
      const best = bestClear >= 0 ? bestClear : bestHidden;
      if (best >= 0 && best !== lastActive) { activate(best); lastActive = best; }
    };
    let ticking = false;
    const onScrollOrResize = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pick(); }); } };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    pick();
  }

  /* ---------------------------------------------------------------------------
     6. Pointer glow + magnetic buttons (fine pointers, motion allowed)
     --------------------------------------------------------------------------- */
  if (fineMQ.matches) {
    $$('[data-glow]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (root.classList.contains('motion-off')) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    if (!prefersReduced()) {
      $$('[data-magnet]').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          if (root.classList.contains('motion-off')) { el.style.transform = ''; return; }
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + clamp(dx * 0.12, -5, 5).toFixed(1) + 'px,' + clamp(dy * 0.18, -4, 4).toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      });
    }
  }

  /* ---------------------------------------------------------------------------
     7. Contact form → prefilled mailto:
     --------------------------------------------------------------------------- */
  if (form) {
    const status = $('#form-status');
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) return;                       // let the browser show its validation UI
      const to = (form.getAttribute('action') || '').replace(/^mailto:/i, '');   // the one address: config → action (see above)
      if (!to.includes('@')) return;                           // no usable address: let the native submit proceed
      e.preventDefault();
      const v = (id) => (($('#' + id) || {}).value || '').trim();
      // The options' values are ASCII stand-ins for the no-JavaScript submission (see index.html); use the label.
      const sel = $('#f-appliance');
      const appliance = sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text.trim() : v('f-appliance');
      const subject = 'New case — ' + appliance;
      // A textarea's value always has LF-only line breaks, even where the join below uses RFC 6068's required CRLF;
      // normalise the notes field the same way so a multi-line note doesn't mix the two inside one mailto body.
      const notes = v('f-notes').replace(/\r?\n/g, '\r\n');
      const body = ['Name: ' + v('f-name'), 'Practice: ' + v('f-practice'), 'Email: ' + v('f-email'), 'Appliance: ' + appliance, '', 'Notes:', notes].join('\r\n');
      if (status) status.textContent = 'Opening your email app with the case details.';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------------------------------
     8. Footer year
     --------------------------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
