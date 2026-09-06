/* =============================================================================
   MASKATECH LABS — main.js
   Vanilla ES2020, progressive enhancement. Every feature degrades to the
   static markup when JavaScript is unavailable.
     1. Config injection (site-config.js → DOM)
     2. Nav (scroll state, mobile menu, active section)
     3. Scroll reveals
     4. Hero: dental-arch scan mesh (canvas 2D)
     5. Workflow stepper
     6. Contact form → prefilled mailto:
     7. Footer year
   ============================================================================= */
(() => {
  'use strict';

  const doc = document;
  const cfg = window.MASKATECH_CONFIG || {};
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = () => reduceMQ.matches;
  // Safari < 14 only has the legacy addListener; a throw here would abort the whole IIFE
  const onReduceChange = (fn) => (reduceMQ.addEventListener ? reduceMQ.addEventListener('change', fn) : reduceMQ.addListener(fn));
  const $ = (sel, root = doc) => root.querySelector(sel);
  const $$ = (sel, root = doc) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------------------------
     1. Config injection
     data-cfg="path.to.value"      → textContent
     data-cfg-link="path.to.value" → href (mailto: for emails, tel: for phones)
     --------------------------------------------------------------------------- */
  const getPath = (path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), cfg);

  const isPhone = (v) => /^[\d\s()+-]+$/.test(v);
  $$('[data-cfg]').forEach((el) => {
    const v = getPath(el.dataset.cfg);
    if (typeof v !== 'string' || !v.trim()) return;
    el.textContent = v;                                    // written verbatim (tel: links get white-space: nowrap in CSS)
  });
  $$('[data-cfg-link]').forEach((el) => {
    const v = getPath(el.dataset.cfgLink);
    if (typeof v !== 'string' || !v.trim()) return;
    if (v.includes('@')) el.setAttribute('href', 'mailto:' + v);
    else if (isPhone(v)) el.setAttribute('href', 'tel:+1' + v.replace(/\D/g, ''));
    else el.setAttribute('href', v);
  });
  const form = $('#case-form');
  if (form && typeof cfg.contactEmail === 'string' && cfg.contactEmail.includes('@')) {
    form.setAttribute('action', 'mailto:' + cfg.contactEmail);
  }

  /* ---------------------------------------------------------------------------
     2. Nav
     --------------------------------------------------------------------------- */
  const nav = $('#nav');
  const navToggle = $('.nav-toggle', nav);
  const navMenu = $('#nav-menu');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    navMenu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); navToggle.focus(); } });
    doc.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false); });
  }

  // Active link follows the section in view
  const links = $$('.nav-link');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------------------------
     3. Scroll reveals
     --------------------------------------------------------------------------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.remove('is-pending'); en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    // Arm on the first scroll: anything still below the fold is hidden and
    // revealed as it enters. Before that, the page is complete as rendered.
    const arm = () => {
      window.removeEventListener('scroll', arm);
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight + 40) { el.classList.add('is-pending'); io.observe(el); }
      });
    };
    window.addEventListener('scroll', arm, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     4. Hero — dental-arch scan mesh
     A parametric surface (14 teeth along a parabolic arch) is projected with a
     simple pinhole camera and drawn as a wireframe. A scan front sweeps along
     the arch; vertices behind it are "captured" and drawn bright, vertices
     ahead of it are faint. The mesh rotates slowly and re-scans on a loop.
     --------------------------------------------------------------------------- */
  /* @mesh-start */
  const ARCH = (() => {
    const TOOTH_W = [10, 10, 7, 7, 7.5, 6.5, 8.5];       // relative mesio-distal widths, back → front
    const PROFILE = [                                     // [half-depth, tooth height], back → front
      [0.125, 0.150], [0.118, 0.165], [0.092, 0.200], [0.086, 0.210], [0.074, 0.262], [0.060, 0.240], [0.062, 0.262]
    ];
    const TEETH = 14, SEG_U = 7, SEG_V = 10;
    const NU = TEETH * SEG_U + 1, NV = SEG_V + 1;
    const V0 = -0.5, V1 = Math.PI + 0.5;
    const W = 1.0, D = 1.25, ZOFF = 0.5;

    // Arc-length parametrisation of the arch centreline x = W t, z = D t² − ZOFF
    const N = 1200;
    const ts = new Float64Array(N + 1), ss = new Float64Array(N + 1);
    let acc = 0, px = -W, pz = D - ZOFF;
    for (let i = 0; i <= N; i++) {
      const t = -1 + (2 * i) / N;
      const x = W * t, z = D * t * t - ZOFF;
      if (i) acc += Math.hypot(x - px, z - pz);
      ts[i] = t; ss[i] = acc; px = x; pz = z;
    }
    for (let i = 0; i <= N; i++) ss[i] /= acc;
    const tAt = (s) => {
      let lo = 0, hi = N;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] < s) lo = m; else hi = m; }
      const f = (s - ss[lo]) / ((ss[hi] - ss[lo]) || 1);
      return ts[lo] + (ts[hi] - ts[lo]) * f;
    };

    // Tooth boundaries along s
    const widths = TOOTH_W.concat(TOOTH_W.slice().reverse());
    const total = widths.reduce((a, b) => a + b, 0);
    const bounds = [0];
    widths.forEach((w) => bounds.push(bounds[bounds.length - 1] + w / total));
    const toothAt = (s) => {
      let k = 0;
      while (k < TEETH - 1 && s >= bounds[k + 1]) k++;
      return { k, ph: (s - bounds[k]) / (bounds[k + 1] - bounds[k]) };
    };

    const centre = (t) => {
      const x = W * t, z = D * t * t - ZOFF;
      const dx = W, dz = 2 * D * t, l = Math.hypot(dx, dz);
      return { x, z, nx: dz / l, nz: -dx / l };          // n = outward (buccal) normal
    };

    // Surface point for arch position s ∈ [0,1] and cross-section angle v
    const surf = (s, v) => {
      const c = centre(tAt(s));
      const { k, ph } = toothAt(s);
      const i = Math.min(k, TEETH - 1 - k);
      const r0 = PROFILE[i][0], h0 = PROFILE[i][1];
      const b = Math.sin(ph * Math.PI);
      const r = r0 * (0.6 + 0.4 * Math.pow(b, 0.6));
      let h = h0 * (0.66 + 0.34 * Math.pow(b, 0.5));
      if (i < 2) h *= 1 + 0.09 * Math.cos(ph * Math.PI * 4);     // molar surface relief
      const cv = Math.cos(v), sv = Math.sin(v);
      const y = sv >= 0 ? h * sv : 0.16 * sv;                     // below the gum line: fixed flare
      const rr = sv >= 0 ? r : r * (1 + 0.7 * -sv);
      return [c.x + c.nx * rr * cv, y - 0.06, c.z + c.nz * rr * cv - 0.1];
    };

    // Build vertices + segment lists
    const verts = new Float32Array(NU * NV * 3);
    const vs = new Float32Array(NU * NV);                 // arch position per vertex (for the scan)
    for (let i = 0; i < NU; i++) {
      const s = i / (NU - 1);
      for (let j = 0; j < NV; j++) {
        const v = V0 + (V1 - V0) * (j / (NV - 1));
        const p = surf(s, v), id = i * NV + j;
        verts[id * 3] = p[0]; verts[id * 3 + 1] = p[1]; verts[id * 3 + 2] = p[2];
        vs[id] = s;
      }
    }
    const segA = [], segB = [], segS = [];
    for (let i = 0; i < NU; i++) {
      for (let j = 0; j < NV; j++) {
        const id = i * NV + j;
        if (i < NU - 1) { segA.push(id); segB.push(id + NV); segS.push((vs[id] + vs[id + NV]) / 2); }
        if (j < NV - 1) { segA.push(id); segB.push(id + 1); segS.push(vs[id]); }
      }
    }

    // Camera: yaw about Y, pitch about X, pinhole projection
    const project = (src, count, out, yaw, pitch, cx, cy, scale, fov) => {
      const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      let zmin = Infinity, zmax = -Infinity;
      for (let i = 0; i < count; i++) {
        const x = src[i * 3], y = src[i * 3 + 1], z = src[i * 3 + 2];
        const x1 = x * cy_ + z * sy, z1 = -x * sy + z * cy_;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const d = fov / (fov + z2);
        out[i * 3] = cx + x1 * d * scale;
        out[i * 3 + 1] = cy - y2 * d * scale;
        out[i * 3 + 2] = z2;
        if (z2 < zmin) zmin = z2;
        if (z2 > zmax) zmax = z2;
      }
      return [zmin, zmax];
    };

    return {
      NU, NV, V0, V1, verts, vs, count: NU * NV,
      segA: Uint16Array.from(segA), segB: Uint16Array.from(segB), segS: Float32Array.from(segS),
      surf, centre, tAt, project
    };
  })();
  /* @mesh-end */

  const hero = $('.hero');
  const canvas = $('#hero-canvas');
  const stage = $('#hero-stage');
  const hudYaw = $('#hud-yaw'), hudScan = $('#hud-scan'), hudPct = $('#hud-pct');
  const motionBtn = $('#hud-motion');

  if (hero && canvas && stage && canvas.getContext) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const M = ARCH;
    const proj = new Float32Array(M.count * 3);
    const ACC = '42,232,212';
    const PALE = '160,178,190';
    const NB = 8;                                          // alpha buckets per group
    const buckets = { on: [], off: [] };
    for (let i = 0; i < NB; i++) { buckets.on.push([]); buckets.off.push([]); }
    const front = [];
    const SCAN_DUR = 7000, HOLD = 2200, FADE = 900, CYCLE = SCAN_DUR + HOLD + FADE;

    const state = {
      running: !prefersReduced(),
      raf: 0,
      t0: performance.now(),
      last: 0,
      inView: true,
      dpr: 1,
      w: 0, h: 0,
      cx: 0, cy: 0, scale: 1,
      yaw: -0.55, pitch: -0.6,
      px: 0, py: 0, tx: 0, ty: 0                            // pointer parallax (target / eased)
    };

    const layout = () => {
      const r = hero.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = Math.max(1, Math.round(r.width));
      state.h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      state.cx = s.left - r.left + s.width / 2;
      state.cy = s.top - r.top + s.height * 0.52;
      state.scale = Math.min(s.width * 0.42, s.height * 0.5);
      state.fadeIn = s.height * 0.46;                     // elliptical fade keeps the bleed near the stage
      state.fadeOut = s.height * 0.74;
      state.fadeAspect = s.width / s.height;
    };

    const seg3 = (ax, ay, az, bx, by, bz, yaw, pitch) => {
      const tmp = new Float32Array(6), out = new Float32Array(6);
      tmp[0] = ax; tmp[1] = ay; tmp[2] = az; tmp[3] = bx; tmp[4] = by; tmp[5] = bz;
      M.project(tmp, 2, out, yaw, pitch, state.cx, state.cy, state.scale, 2.6);
      return out;
    };

    const drawGround = (yaw, pitch) => {
      // circular hairline grid under the arch
      const R = 1.55, Y = -0.4, step = 0.25;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let g = -R + step; g < R; g += step) {
        const half = Math.sqrt(R * R - g * g);
        let p = seg3(g, Y, -half, g, Y, half, yaw, pitch);
        ctx.moveTo(p[0], p[1]); ctx.lineTo(p[3], p[4]);
        p = seg3(-half, Y, g, half, Y, g, yaw, pitch);
        ctx.moveTo(p[0], p[1]); ctx.lineTo(p[3], p[4]);
      }
      ctx.stroke();
      // rim
      ctx.strokeStyle = 'rgba(' + ACC + ',0.18)';
      ctx.beginPath();
      const tmp = new Float32Array(3), out = new Float32Array(3);
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        tmp[0] = Math.cos(a) * R; tmp[1] = Y; tmp[2] = Math.sin(a) * R;
        M.project(tmp, 1, out, yaw, pitch, state.cx, state.cy, state.scale, 2.6);
        if (i) ctx.lineTo(out[0], out[1]); else ctx.moveTo(out[0], out[1]);
      }
      ctx.stroke();
    };

    const drawScanFront = (s, yaw, pitch, alpha) => {
      // Cross-section ring at the scan position + a faint scanning plane
      const K = 28;
      const tmp = new Float32Array(K * 3), out = new Float32Array(K * 3);
      for (let i = 0; i < K; i++) {
        const v = M.V0 - 0.25 + (M.V1 - M.V0 + 0.5) * (i / (K - 1));
        const p = M.surf(s, v);
        tmp[i * 3] = p[0]; tmp[i * 3 + 1] = p[1] + (i === 0 || i === K - 1 ? -0.12 : 0); tmp[i * 3 + 2] = p[2];
      }
      M.project(tmp, K, out, yaw, pitch, state.cx, state.cy, state.scale, 2.6);
      // plane
      const c = M.centre(M.tAt(s));
      const nx = c.nx, nz = c.nz, ex = 0.42;
      const plane = new Float32Array(12), pout = new Float32Array(12);
      const corners = [[-ex, -0.4], [ex, -0.4], [ex, 0.32], [-ex, 0.32]];
      corners.forEach((q, i) => { plane[i * 3] = c.x + nx * q[0]; plane[i * 3 + 1] = q[1]; plane[i * 3 + 2] = c.z + nz * q[0] - 0.1; });
      M.project(plane, 4, pout, yaw, pitch, state.cx, state.cy, state.scale, 2.6);
      ctx.beginPath();
      ctx.moveTo(pout[0], pout[1]); ctx.lineTo(pout[3], pout[4]); ctx.lineTo(pout[6], pout[7]); ctx.lineTo(pout[9], pout[10]); ctx.closePath();
      ctx.fillStyle = 'rgba(' + ACC + ',' + (0.045 * alpha) + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(' + ACC + ',' + (0.22 * alpha) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      // ring glow + ring
      ctx.beginPath();
      for (let i = 0; i < K; i++) { if (i) ctx.lineTo(out[i * 3], out[i * 3 + 1]); else ctx.moveTo(out[i * 3], out[i * 3 + 1]); }
      ctx.strokeStyle = 'rgba(' + ACC + ',' + (0.16 * alpha) + ')';
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(' + ACC + ',' + (0.95 * alpha) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const render = (now) => {
      const el = now - state.t0;
      const phase = el % CYCLE;
      let scan, fade = 1;
      if (phase < SCAN_DUR) {
        const p = phase / SCAN_DUR;
        scan = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;     // ease in-out
      } else if (phase < SCAN_DUR + HOLD) {
        scan = 1;
      } else {
        scan = 1;
        fade = 1 - (phase - SCAN_DUR - HOLD) / FADE;                          // mesh fades before the next pass
      }
      const yaw = state.yaw + (state.running ? el * 0.00011 : 0) + state.px * 0.18;
      const pitch = state.pitch + (state.running ? Math.sin(el * 0.00025) * 0.05 : 0) + state.py * 0.08;

      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.w, state.h);

      drawGround(yaw, pitch);

      const [zmin, zmax] = M.project(M.verts, M.count, proj, yaw, pitch, state.cx, state.cy, state.scale, 2.6);
      const zr = (zmax - zmin) || 1;

      for (let i = 0; i < NB; i++) { buckets.on[i].length = 0; buckets.off[i].length = 0; }
      front.length = 0;

      const segA = M.segA, segB = M.segB, segS = M.segS;
      for (let i = 0; i < segA.length; i++) {
        const a = segA[i] * 3, b = segB[i] * 3;
        const depth = 1 - ((proj[a + 2] + proj[b + 2]) / 2 - zmin) / zr;    // 1 = near
        const s = segS[i];
        let list;
        if (s <= scan) {
          if (scan - s < 0.02) list = front;
          else list = buckets.on[Math.min(NB - 1, Math.floor(depth * NB))];
        } else {
          list = buckets.off[Math.min(NB - 1, Math.floor(depth * NB))];
        }
        list.push(proj[a], proj[a + 1], proj[b], proj[b + 1]);
      }

      const strokeList = (list, style, width) => {
        if (!list.length) return;
        ctx.strokeStyle = style; ctx.lineWidth = width;
        ctx.beginPath();
        for (let i = 0; i < list.length; i += 4) { ctx.moveTo(list[i], list[i + 1]); ctx.lineTo(list[i + 2], list[i + 3]); }
        ctx.stroke();
      };

      for (let i = 0; i < NB; i++) {
        const d = (i + 0.5) / NB;
        strokeList(buckets.off[i], 'rgba(' + PALE + ',' + (0.05 + 0.06 * d).toFixed(3) + ')', 1);
      }
      for (let i = 0; i < NB; i++) {
        const d = (i + 0.5) / NB;
        const a = (0.12 + 0.6 * d * d) * fade;
        strokeList(buckets.on[i], 'rgba(' + ACC + ',' + a.toFixed(3) + ')', d > 0.6 ? 1.1 : 1);
      }
      strokeList(front, 'rgba(' + ACC + ',' + (0.95 * fade).toFixed(3) + ')', 1.4);

      // captured vertices (near side only)
      ctx.fillStyle = 'rgba(' + ACC + ',' + (0.85 * fade).toFixed(3) + ')';
      const vs = M.vs;
      for (let i = 0; i < M.count; i++) {
        if (vs[i] > scan) continue;
        const depth = 1 - (proj[i * 3 + 2] - zmin) / zr;
        if (depth < 0.55) continue;
        const sz = depth > 0.8 ? 2 : 1.5;
        ctx.fillRect(proj[i * 3] - sz / 2, proj[i * 3 + 1] - sz / 2, sz, sz);
      }

      if (scan < 1 || phase < SCAN_DUR + 300) drawScanFront(Math.min(scan, 0.999), yaw, pitch, scan < 1 ? 1 : Math.max(0, 1 - (phase - SCAN_DUR) / 300));

      // Soft elliptical mask around the stage so the ground disc fades before it reaches the copy
      ctx.globalCompositeOperation = 'destination-in';
      ctx.save();
      ctx.translate(state.cx, state.cy);
      ctx.scale(state.fadeAspect, 1);
      const mask = ctx.createRadialGradient(0, 0, state.fadeIn, 0, 0, state.fadeOut);
      mask.addColorStop(0, 'rgba(0,0,0,1)');
      mask.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mask;
      ctx.fillRect(-state.cx / state.fadeAspect, -state.cy, state.w / state.fadeAspect, state.h);
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';

      // HUD readouts
      if (hudYaw) {
        let deg = ((yaw * 180) / Math.PI) % 360; if (deg < 0) deg += 360;
        hudYaw.textContent = deg.toFixed(1).padStart(5, '0') + '°';
      }
      if (hudScan) hudScan.style.width = Math.round(scan * 100) + '%';
      if (hudPct) hudPct.textContent = Math.round(scan * 100) + '%';
    };

    const loop = (now) => {
      state.raf = 0;
      if (!state.running || !state.inView || doc.hidden) return;
      state.px += (state.tx - state.px) * 0.04;
      state.py += (state.ty - state.py) * 0.04;
      render(now);
      state.raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!state.raf && state.running && state.inView && !doc.hidden) state.raf = requestAnimationFrame(loop); };
    const stop = () => { if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; };
    const renderStatic = () => {
      // one composed frame: mid-scan, three-quarter view
      const t = state.t0 + SCAN_DUR * 0.62;
      state.px = 0; state.py = 0;
      render(t);
    };

    const setRunning = (on) => {
      state.running = on;
      if (motionBtn) {
        motionBtn.setAttribute('aria-pressed', String(on));
        const st = $('.hud-state', motionBtn);
        if (st) st.textContent = on ? 'on' : 'off';
      }
      if (on) { state.t0 = performance.now() - SCAN_DUR * 0.1; start(); } else { stop(); renderStatic(); }
      // page-wide: CSS keyframes (glyphs, eyebrow pulse) stop via html.motion-off; the stepper listens for the event
      doc.documentElement.classList.toggle('motion-off', !on);
      doc.dispatchEvent(new CustomEvent('maskatech:motion', { detail: { on } }));
    };

    // Boot
    layout();
    hero.classList.add('is-live');
    // The fallback <img> is only faded by CSS; its alt stays the hero's text alternative (the canvas is aria-hidden)
    if (state.running) start(); else renderStatic();

    // Resize
    let rz = 0;
    const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { layout(); if (!state.running) renderStatic(); }); };
    window.addEventListener('resize', onResize);
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(stage);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(onResize);

    // Pause when off-screen / tab hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { state.inView = en[0].isIntersecting; if (state.inView) start(); else stop(); }, { threshold: 0 }).observe(hero);
    }
    doc.addEventListener('visibilitychange', () => { if (doc.hidden) stop(); else start(); });

    // Pointer parallax (fine pointers only)
    if (window.matchMedia('(pointer: fine)').matches) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        state.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        state.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      hero.addEventListener('pointerleave', () => { state.tx = 0; state.ty = 0; });
    }

    // Motion toggle + reduced-motion changes
    if (motionBtn) {
      setRunning(state.running);
      motionBtn.addEventListener('click', () => setRunning(!state.running));
    }
    onReduceChange(() => setRunning(!reduceMQ.matches));
  }

  /* ---------------------------------------------------------------------------
     5. Workflow stepper
     Buttons expand one step at a time and switch the stage glyph. Auto-advances
     while in view until the visitor interacts. Reduced motion: no auto-advance.
     --------------------------------------------------------------------------- */
  const wf = $('#wf');
  if (wf) {
    const items = $$('[data-wf-item]', wf);
    const glyphs = $$('[data-wf-glyph]', wf);
    const hudStep = $('#wf-hud'), hudName = $('#wf-hud-name');
    const DUR = 4200;
    let idx = 0, timer = 0, auto = !prefersReduced(), inView = false;
    wf.style.setProperty('--wf-dur', DUR + 'ms');

    const activate = (n, timed) => {
      idx = (n + items.length) % items.length;
      items.forEach((li, i) => {
        const on = i === idx;
        li.classList.toggle('is-active', on);
        li.classList.remove('is-timed');
        if (on && timed) { void li.offsetWidth; li.classList.add('is-timed'); }    // restart the progress hairline
        const btn = $('.wf-btn', li);
        if (btn) btn.setAttribute('aria-expanded', String(on));
      });
      glyphs.forEach((g, i) => g.classList.toggle('is-active', i === idx));
      if (hudStep) hudStep.textContent = String(idx + 1).padStart(2, '0');
      if (hudName) hudName.textContent = $('.wf-name', items[idx]).textContent;
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!auto || !inView) return;
      timer = setTimeout(() => { activate(idx + 1, true); schedule(); }, DUR);
    };

    items.forEach((li, i) => {
      const btn = $('.wf-btn', li);
      btn.addEventListener('click', () => { auto = false; clearTimeout(timer); activate(i, false); });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); $('.wf-btn', items[(i + 1) % items.length]).focus(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); $('.wf-btn', items[(i - 1 + items.length) % items.length]).focus(); }
      });
    });
    wf.addEventListener('pointerenter', () => clearTimeout(timer));
    wf.addEventListener('focusin', () => { auto = false; clearTimeout(timer); });          // keyboard users: stop for good
    doc.addEventListener('maskatech:motion', (e) => { if (!e.detail.on) { auto = false; clearTimeout(timer); } });
    wf.addEventListener('pointerleave', schedule);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        inView = en[0].isIntersecting;
        if (inView) { activate(idx, auto); schedule(); } else clearTimeout(timer);
      }, { threshold: 0.35 }).observe(wf);
    } else {
      activate(0, false);
    }
    onReduceChange(() => { auto = !reduceMQ.matches && auto; if (!auto) clearTimeout(timer); });
  }

  /* ---------------------------------------------------------------------------
     6. Contact form → prefilled mailto:
     --------------------------------------------------------------------------- */
  if (form) {
    const status = $('#form-status');
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) return;                     // let the browser show native messages
      e.preventDefault();
      const f = new FormData(form);
      const to = (cfg.contactEmail || 'cases@maskatech.com').trim();
      const appliance = String(f.get('Appliance') || '').trim();
      const subject = 'New case' + (appliance ? ' — ' + appliance : '');
      const lines = [
        'Name: ' + (f.get('Name') || ''),
        'Practice: ' + (f.get('Practice') || ''),
        'Email: ' + (f.get('Email') || ''),
        'Appliance: ' + appliance,
        '',
        'Notes:',
        String(f.get('Notes') || '')
      ];
      const href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      if (status) status.textContent = 'Opening your email app with the case details.';
      window.location.href = href;
    });
  }

  /* ---------------------------------------------------------------------------
     7. Footer year
     --------------------------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
