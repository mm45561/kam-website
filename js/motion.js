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
      pageCtx = gsap.context(() => animatePage(document.getElementById("app")));
      ScrollTrigger.refresh();
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
  });

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
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(hero.querySelector(".eyebrow"), { y: 14, autoAlpha: 0, duration: 0.6 })
        .from(words, { yPercent: 60, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, "-=0.3")
        .from(hero.querySelector(".lead"), { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.45")
        .from(hero.querySelectorAll(".hero-actions .btn"), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(hero.querySelector(".hero-mark img"), { scale: 0.85, rotate: -8, autoAlpha: 0, duration: 1.2 }, 0.2)
        .from(hero.querySelectorAll(".stat"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.6");
      const mark = hero.querySelector(".hero-mark img");
      if (mark) gsap.to(mark, { y: -12, rotate: 2, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
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

    // Steps: the number circles pop in
    root.querySelectorAll(".steps .num").forEach((n) => {
      gsap.from(n, { scale: 0.4, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: n, start: "top 92%", once: true } });
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
