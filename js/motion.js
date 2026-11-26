// Calm page motion: GSAP + ScrollTrigger reveals, SplitText headline, Lenis smooth scroll,
// and a soft animated hero background. Everything is skipped when the visitor prefers reduced motion.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const has = () => window.gsap && window.ScrollTrigger;
  let lenis = null;
  let splits = [];
  let heroBg = null;
  let pageCtx = null;

  const api = {
    enabled: false,
    // called by the router after each page render
    onPage(opts = {}) {
      if (!api.enabled) {
        if (opts.target) opts.target.scrollIntoView({ block: "start" });
        else window.scrollTo(0, 0);
        return;
      }
      cleanup();
      if (opts.target) api.scrollTo(opts.target, { offset: -150 });
      else if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      const app = document.getElementById("app");
      gsap.fromTo(app, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE, clearProps: "transform,opacity" });
      pageCtx = gsap.context(() => animatePage(app));
      ScrollTrigger.refresh();
    },
    // Soft page transition: the old page fades and lifts away before the new one is drawn (idea 4)
    leave() {
      const app = document.getElementById("app");
      if (!api.enabled || !app || !app.firstElementChild || app.querySelector(".loading")) return Promise.resolve();
      return new Promise((res) => gsap.to(app, { opacity: 0, y: -14, duration: 0.22, ease: "power2.in", onComplete: res }));
    },
    scrollTo(target, { offset = 0, immediate = false } = {}) {
      if (lenis) lenis.scrollTo(target, { offset, immediate, duration: 1.1 });
      else if (typeof target === "number") window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
      else target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
    },
  };
  window.KAMMotion = api;

  if (reduce.matches || !has()) return;
  api.enabled = true;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  document.documentElement.classList.add("motion");

  // ---- smooth scroll (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true, prevent: (node) => !!(node.closest && node.closest(".nav-open .nav, [data-lenis-prevent]")) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // If the visitor turns on "reduce motion" while the page is open, stop everything.
  reduce.addEventListener?.("change", (e) => {
    if (!e.matches) return;
    cleanup();
    lenis?.destroy();
    lenis = null;
    heroBg?.stop();
    api.enabled = false;
    document.documentElement.classList.remove("motion");
    gsap.set(document.getElementById("app"), { clearProps: "all" });
  });

  // FAQ answers slide open and closed instead of jumping (idea 10)
  document.addEventListener("click", (e) => {
    const sum = e.target.closest?.(".faq summary");
    if (!sum || !api.enabled) return;
    const d = sum.parentElement, body = d.querySelector(":scope > div");
    if (!body || d.dataset.anim) { e.preventDefault(); return; }
    e.preventDefault();
    d.dataset.anim = "1";
    const done = () => { delete d.dataset.anim; gsap.set(body, { clearProps: "height,opacity,overflow" }); ScrollTrigger.refresh(); };
    if (d.open) {
      d.classList.remove("is-open");
      gsap.to(body, { height: 0, opacity: 0, overflow: "hidden", duration: 0.32, ease: "power2.inOut", onComplete: () => { d.open = false; done(); } });
    } else {
      d.open = true;
      d.classList.add("is-open");
      gsap.from(body, { height: 0, opacity: 0, overflow: "hidden", duration: 0.42, ease: EASE, onComplete: done });
    }
  });

  // Magnetic gold buttons: they lean a little toward the mouse (idea 8)
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.addEventListener("pointermove", (e) => {
    if (!api.enabled || !fine.matches) return;
    const b = e.target.closest?.(".btn-gold.btn-lg, .nav-cta");
    if (b !== api._mag) { if (api._mag) gsap.to(api._mag, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, .5)" }); api._mag = b; }
    if (!b) return;
    const r = b.getBoundingClientRect();
    gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3, ease: "power2.out" });
  }, { passive: true });

  // Gentle 3D tilt on service and scholarship cards (mouse only)
  document.addEventListener("pointermove", (e) => {
    if (!api.enabled || !fine.matches) return;
    const c = e.target.closest?.(".service-card, .sch-card");
    if (c !== api._tilt) { if (api._tilt) gsap.to(api._tilt, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: EASE }); api._tilt = c; }
    if (!c) return;
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(c, { rotateX: py * -6, rotateY: px * 6, y: -4, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
  }, { passive: true });

  function cleanup() {
    pageCtx?.revert();
    pageCtx = null;
    ScrollTrigger.getAll().forEach((st) => st.kill());
    splits.forEach((s) => s.revert());
    splits = [];
    heroBg?.stop();
    heroBg = null;
  }

  const EASE = "power3.out";

  function splitWords(el) {
    // Split by words (never by letters: Arabic letters must stay joined)
    if (window.SplitText) {
      const s = new window.SplitText(el, { type: "words", wordsClass: "sw", aria: "auto" });
      splits.push(s);
      return s.words;
    }
    return [el];
  }

  function animatePage(root) {
    if (!root) return;

    // Hero (home page)
    const hero = root.querySelector(".hero");
    if (hero) {
      const h1 = hero.querySelector("h1");
      const words = h1 ? splitWords(h1) : [];
      // keep the gold shimmer on the highlighted word after it is split into word pieces
      const gw = h1?.querySelector(".gold-word");
      if (gw) { gw.classList.add("is-split"); gw.querySelectorAll(".sw").forEach((w) => w.classList.add("gold-text")); }
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(hero.querySelector(".eyebrow"), { y: 14, autoAlpha: 0, duration: 0.6 })
        .from(words, { yPercent: 60, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, "-=0.3")
        .from(hero.querySelector(".lead"), { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.45")
        .fromTo(hero.querySelectorAll(".hero-actions .btn"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(hero.querySelectorAll(".stat"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.6");
      const mark = hero.querySelector(".hero-mark img");
      if (mark) {
        // Logo spins fast, then slows down until it stops (every time the home page is opened)
        gsap.fromTo(mark, { rotate: -1800, scale: 0.6, autoAlpha: 0 }, { rotate: 0, scale: 1, autoAlpha: 1, duration: 3.2, ease: "expo.out", delay: 0.1 });
        gsap.to(mark, { y: -12, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3.3 });
      }
      countUp(hero.querySelectorAll(".stat b"));
      heroBg = startHeroBg(hero);
      // gentle parallax as the hero scrolls away
      gsap.to(hero.querySelector(".hero-in"), { yPercent: 12, autoAlpha: 0.4, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    }

    // Inner page headers and university hero
    root.querySelectorAll(".page-head h1, .uni-hero h1").forEach((h1) => {
      const words = splitWords(h1);
      gsap.from(words, { yPercent: 50, autoAlpha: 0, duration: 0.7, ease: EASE, stagger: 0.05 });
    });
    root.querySelectorAll(".page-head p, .uni-hero .tag, .uni-hero p, .crumbs").forEach((el, i) => {
      gsap.from(el, { y: 12, autoAlpha: 0, duration: 0.6, ease: EASE, delay: 0.25 + i * 0.05 });
    });
    const uh = root.querySelector(".uni-hero.has-img");
    if (uh) gsap.fromTo(uh, { backgroundPositionY: "50%" }, { backgroundPositionY: "70%", ease: "none", scrollTrigger: { trigger: uh, start: "top top", end: "bottom top", scrub: true } });

    // Section titles
    root.querySelectorAll(".sec-head").forEach((el) => {
      gsap.from(el.children, { y: 20, autoAlpha: 0, duration: 0.7, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    const reveal = (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.07, overwrite: true });
    // Cards and blocks appear in small groups as they enter the screen
    const items = root.querySelectorAll(".grid > *, .steps li, .quick-links .ql, .faq details, .uni-sec, .uni-side > *, .price-block, .sch-full, .contact-list > div, .uni-cta, .cal-search, .cal-legend, .cal-wrap, .form, .prose > *");
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch(items, {
      start: "top 92%",
      end: "bottom top",
      once: true,
      onEnter: reveal,
      onLeave: reveal, // the visitor jumped past them (e.g. pressed End): show them anyway
      onEnterBack: reveal,
    });

    // "How we work": a gold rail draws across the steps and each number lights up as it is reached (idea 5)
    root.querySelectorAll(".steps").forEach((ol) => {
      const lis = [...ol.children];
      ol.classList.add("steps-anim");
      const light = (p) => lis.forEach((li, i) => li.classList.toggle("lit", p >= (lis.length > 1 ? i / (lis.length - 1) : 0) - 0.02));
      light(0);
      const st = { p: 0 };
      gsap.to(st, {
        p: 1, ease: "none",
        scrollTrigger: { trigger: ol, start: "top 85%", end: "bottom 55%", scrub: 0.6 },
        onUpdate: () => { ol.style.setProperty("--rail", st.p.toFixed(3)); light(st.p); },
      });
    });

    // Line icons draw themselves when they appear (idea 3)
    root.querySelectorAll("svg.li").forEach((svg) => {
      const parts = svg.querySelectorAll("path, circle, rect");
      gsap.fromTo(parts, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.12, scrollTrigger: { trigger: svg, start: "top 95%", once: true } });
    });

    // University photos: a green curtain slides away, then the photo settles from a slight zoom (idea 9)
    const rtl = document.documentElement.dir === "rtl";
    root.querySelectorAll(".uni-card .thumb").forEach((th) => {
      const media = th.querySelector("img.photo, .thumb-ph");
      if (!media) return;
      gsap.fromTo(media, { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.18 },
        { clipPath: "inset(0 0 0 0%)", scale: 1, duration: 1.1, ease: "expo.out", clearProps: "clipPath,transform", scrollTrigger: { trigger: th, start: "top 92%", once: true } });
    });

    // CTA band
    const cta = root.querySelector(".cta-band .cta-in");
    if (cta) gsap.from(cta.children, { y: 24, autoAlpha: 0, duration: 0.8, ease: EASE, stagger: 0.12, scrollTrigger: { trigger: cta, start: "top 90%", once: true } });
  }

  // Count "+1000", "40+", "24h"... up from zero, keeping prefix/suffix
  function countUp(els) {
    els.forEach((el) => {
      const m = el.textContent.trim().match(/^(\D*)(\d[\d,.]*)(.*)$/);
      if (!m) return;
      const end = parseFloat(m[2].replace(/,/g, ""));
      if (!isFinite(end) || end < 2) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.6, ease: "power2.out", delay: 0.9,
        onUpdate: () => { el.textContent = m[1] + Math.round(obj.v).toLocaleString("en-US") + m[3]; },
      });
    });
  }

  // Soft moving light blobs + flowing lines behind the hero text (canvas, pauses when hidden)
  function startHeroBg(hero) {
    const cv = document.createElement("canvas");
    cv.className = "hero-canvas";
    cv.setAttribute("aria-hidden", "true");
    hero.prepend(cv);
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();
    const blobs = [
      { x: 0.82, y: 0.25, r: 0.42, c: "178,160,120", a: 0.22, sx: 0.00007, sy: 0.00005, p: 0 },
      { x: 0.12, y: 0.85, r: 0.38, c: "178,160,120", a: 0.16, sx: 0.00005, sy: 0.00008, p: 2 },
      { x: 0.5, y: 0.5, r: 0.5, c: "52,90,80", a: 0.5, sx: 0.00004, sy: 0.00006, p: 4 },
    ];
    function resize() {
      const r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame(now) {
      raf = 0;
      if (!visible) return;
      const t = now - t0;
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const x = (b.x + Math.sin(t * b.sx + b.p) * 0.08) * w;
        const y = (b.y + Math.cos(t * b.sy + b.p) * 0.08) * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      // slow flowing lines inspired by the curves of the KAM mark
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(243,233,224,${0.05 + i * 0.012})`;
        ctx.beginPath();
        for (let x = 0; x <= w + 20; x += 20) {
          const y = h * (0.3 + i * 0.12) + Math.sin(x * 0.004 + t * 0.00025 + i) * 30 + Math.sin(x * 0.011 - t * 0.0002 + i * 2) * 12;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(hero);
    const onVis = () => { visible = !document.hidden; if (visible && !raf) raf = requestAnimationFrame(frame); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    resize();
    gsap.from(cv, { autoAlpha: 0, duration: 1.5 });
    raf = requestAnimationFrame(frame);
    return {
      stop() {
        cancelAnimationFrame(raf); raf = 0; visible = false;
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", resize);
        cv.remove();
      },
    };
  }
})();
