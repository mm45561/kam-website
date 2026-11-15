import * as Store from "./store.js?v=202611152048";
import { CONFIG } from "./config.js?v=202611152048";
import { getLang, setLang, makeT, UI } from "./i18n.js";
import { parseFees } from "./utils.js?v=202611152048";

const lang = getLang();
const t = makeT(lang);
const P = t.pick;
document.documentElement.lang = lang;
document.documentElement.dir = UI[lang].dir;

const app = document.getElementById("app");
let S = {}; // settings
const cache = {};
async function col(name) {
  if (!cache[name]) cache[name] = await Store.list(name);
  return cache[name];
}

// ---------- helpers ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const paras = (s) => esc(s).split(/\n\s*\n/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
const fmtDate = (d) => {
  if (!d) return "";
  try { return new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString(lang === "ar" ? "ar-EG" : lang === "tr" ? "tr-TR" : "en-GB", { year: "numeric", month: "long", day: "numeric" }); }
  catch (e) { return d; }
};
const money = (v, cur) => {
  const num = Number(String(v).replace(/[^\d.]/g, ""));
  if (!v || isNaN(num)) return "";
  if (num === 0) return t("free");
  try { return new Intl.NumberFormat(lang === "ar" ? "en-US" : lang === "tr" ? "tr-TR" : "en-US", { style: "currency", currency: cur || S.currency || "USD", maximumFractionDigits: 0 }).format(num); }
  catch (e) { return num + " " + (cur || S.currency || ""); }
};
const waLink = (text = "") => S.whatsapp ? `https://wa.me/${String(S.whatsapp).replace(/\D/g, "")}${text ? "?text=" + encodeURIComponent(text) : ""}` : "#/contact";
function uniThumb(u) {
  return u.image
    ? `<img src="${esc(u.image)}" alt="" loading="lazy">`
    : `<div class="thumb-ph"><img src="assets/mark-light.webp" alt=""></div>`;
}

// ---------- layout ----------
const icons = {
  search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  up: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.5 3.9 1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8Z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="m21.5 4.3-3 15c-.2 1-.9 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.7 13.4 2.2 12c-1-.3-1-1 .2-1.5l17.7-6.8c.8-.3 1.6.2 1.4 1.6Z"/></svg>',
  li: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-2 6h4v12H2V9Zm7 0h4v1.7A4.4 4.4 0 0 1 17 8.7c3.2 0 4 2 4 5V21h-4v-6.4c0-1.6-.3-2.8-1.9-2.8-1.7 0-2.1 1.2-2.1 2.8V21H9V9Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
};
function socials() {
  const list = [["instagram", icons.ig], ["facebook", icons.fb], ["telegram", icons.tg], ["linkedin", icons.li]];
  return list.filter(([k]) => S[k]).map(([k, ic]) => `<a href="${esc(S[k])}" target="_blank" rel="noopener" aria-label="${k}">${ic}</a>`).join("");
}

function shareBar(title) {
  const url = location.href;
  const enc = encodeURIComponent, text = enc(title);
  return `<div class="share"><span>${t("share")}:</span>
    <a href="https://wa.me/?text=${text}%20${enc(url)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icons.wa}</a>
    <a href="https://t.me/share/url?url=${enc(url)}&text=${text}" target="_blank" rel="noopener" aria-label="Telegram">${icons.tg}</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${enc(url)}" target="_blank" rel="noopener" aria-label="Facebook">${icons.fb}</a>
    <a href="https://x.com/intent/post?url=${enc(url)}&text=${text}" target="_blank" rel="noopener" aria-label="X">${icons.x}</a>
    <button type="button" class="copy-link" aria-label="${t("copy_link")}">${icons.link}</button></div>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".copy-link");
  if (!b) return;
  navigator.clipboard?.writeText(location.href).then(() => { b.classList.add("ok"); b.setAttribute("aria-label", t("copied")); setTimeout(() => b.classList.remove("ok"), 1500); });
});
const srH2 = (txt) => `<h2 class="sr-only">${txt}</h2>`;
const updatedLine = (x) => (x.updated_at ? `<p class="updated">${t("updated")}: ${fmtDate(String(x.updated_at).slice(0, 10))}</p>` : "");

function renderShell() {
  const logo = lang === "ar" ? "assets/logo-ar.webp" : "assets/logo.webp";
  document.getElementById("topbar").innerHTML = `
    <div class="wrap topbar-in">
      <div class="tb-contact">${S.phones ? `<a href="tel:${esc(String(S.phones).split("\n")[0].replace(/\s/g, ""))}">${icons.phone}<span dir="ltr">${esc(String(S.phones).split("\n")[0])}</span></a>` : ""}</div>
      <div class="tb-social">${socials()}</div>
      <div class="lang-switch">${CONFIG.languages.map((l) => `<button data-lang="${l}" class="${l === lang ? "on" : ""}">${UI[l].langName}</button>`).join("")}</div>
    </div>`;
  document.getElementById("header").innerHTML = `
    <div class="wrap header-in">
      <a href="#/" class="brand"><img src="${logo}" alt="KAM" class="brand-logo ${lang === "ar" ? "ar" : ""}" ${lang === "ar" ? 'width="500" height="193"' : 'width="600" height="133"'}></a>
      <div class="header-tools"><a href="#/search" class="search-btn" aria-label="${t("search_title")}">${icons.search}</a>
      <button class="menu-btn" aria-label="${t("menu")}" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button></div>
      <nav class="nav" id="main-nav" aria-label="${t("menu")}">
        <a href="#/">${t("nav_home")}</a>
        <div class="dd"><a href="#/universities">${t("nav_universities")} ▾</a>
          <div class="dd-menu"><a href="#/universities/gov">${t("nav_gov")}</a><a href="#/universities/private">${t("nav_private")}</a><a href="#/prices">${t("nav_prices")}</a></div></div>
        <a href="#/services">${t("nav_services")}</a>
        <a href="#/scholarships">${t("nav_scholarships")}</a>
        <a href="#/calendar">${t("nav_calendar")}</a>
        <div class="dd"><a href="#/articles">${t("nav_guides")} ▾</a>
          <div class="dd-menu"><a href="#/articles/exams">${t("cat_exams")}</a><a href="#/articles/openedu">${t("cat_openedu")}</a><a href="#/articles/rankings">${t("cat_rankings")}</a><a href="#/articles/recognition">${t("cat_recognition")}</a><a href="#/articles/guide">${t("cat_guide")}</a><a href="#/articles/news">${t("cat_news")}</a></div></div>
        <a href="#/about">${t("nav_about")}</a>
        <a href="#/contact">${t("nav_contact")}</a>
        <a href="#/apply" class="btn btn-gold nav-cta">${t("apply_now")}</a>
      </nav>
    </div>`;
  document.getElementById("footer").innerHTML = `
    <div class="wrap footer-grid">
      <div><img src="assets/logo-light.webp" alt="KAM" class="footer-logo" width="600" height="133" loading="lazy"><p class="muted-light">${esc(P(S.tagline))}</p><div class="footer-social">${socials()}</div></div>
      <div><h2 class="f-h">${t("nav_universities")}</h2><a href="#/universities/gov">${t("nav_gov")}</a><a href="#/universities/private">${t("nav_private")}</a><a href="#/prices">${t("nav_prices")}</a><a href="#/scholarships">${t("nav_scholarships")}</a></div>
      <div><h2 class="f-h">KAM</h2><a href="#/services">${t("nav_services")}</a><a href="#/articles">${t("nav_articles")}</a><a href="#/about">${t("nav_about")}</a><a href="#/search">${t("search_title")}</a><a href="#/privacy">KVKK</a></div>
      <div><h2 class="f-h">${t("contact_title")}</h2>${String(S.phones || "").split("\n").filter(Boolean).map((p) => `<a href="tel:${esc(p.replace(/\s/g, ""))}" dir="ltr">${esc(p)}</a>`).join("")}${S.email ? `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : ""}<span>${esc(P(S.address))}</span></div>
    </div>
    <div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} ${esc(S.companyLegalName || "KAM")}. ${t("footer_rights")}.</span><a href="admin.html">${t("admin")}</a></div>`;
  const fab = document.getElementById("wa-fab");
  fab.href = waLink();
  fab.innerHTML = icons.wa;
  fab.setAttribute("aria-label", t("whatsapp_us"));
  document.querySelector(".skip-link").textContent = t("skip");
  const top = document.getElementById("to-top");
  top.innerHTML = icons.up;
  top.setAttribute("aria-label", t("back_top"));
  top.addEventListener("click", () => (window.KAMMotion ? window.KAMMotion.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" })));
  window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 600), { passive: true });
  document.getElementById("topbar").setAttribute("aria-label", t("contact_title"));
  if (Store.IS_DEMO) {
    const b = document.getElementById("demo-banner");
    b.hidden = false;
    b.textContent = t("demo_banner");
  }

  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { setLang(b.dataset.lang); location.reload(); }));
  const btn = document.querySelector(".menu-btn");
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open);
  });
}

// ---------- pages ----------
async function ticker() {
  const news = (await col("articles")).filter((a) => a.category === "news").slice(0, 6);
  const el = document.getElementById("ticker");
  if (!news.length) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `<div class="wrap ticker-in"><span class="ticker-label">${t("cat_news")}</span><div class="ticker-track"><div class="ticker-move">${news.concat(news).map((a) => `<a href="#/article/${esc(a.id)}">${esc(P(a.title))}</a>`).join("<span class=dot>•</span>")}</div></div></div>`;
}

function uniCard(u) {
  return `<a class="card uni-card" href="#/university/${esc(u.id)}">
    <div class="thumb">${uniThumb(u)}<span class="tag ${u.type}">${t(u.type)}</span></div>
    <div class="card-body"><h3>${esc(P(u.name))}</h3><p class="meta">${esc(P(u.city))}${u.founded ? " · " + esc(u.founded) : ""}</p>
    ${u.type === "private" && u.priceFrom ? `<p class="price">${t("price_from")} <b>${money(u.priceFrom, u.currency)}</b> <small>${t("per_year")}</small></p>` : ""}</div></a>`;
}
function serviceCard(s) {
  const price = P(s.priceLabel) || (s.price !== "" && s.price != null ? money(s.price, s.currency) : "");
  return `<div class="card service-card"><div class="svc-icon">${s.image ? `<img src="${esc(s.image)}" alt="">` : esc(s.icon || "★")}</div>
    <h3>${esc(P(s.title))}</h3><p>${esc(P(s.description))}</p>
    <div class="svc-foot">${price ? `<span class="price-pill">${esc(price)}</span>` : `<span class="price-pill muted">${t("ask_price")}</span>`}
    <a class="link" href="#/apply?service=${encodeURIComponent(s.id)}">${t("apply_now")}</a></div></div>`;
}
function articleCard(a) {
  return `<a class="card article-card" href="#/article/${esc(a.id)}">
    ${a.image ? `<div class="thumb"><img src="${esc(a.image)}" alt="" loading="lazy"></div>` : ""}
    <div class="card-body"><span class="cat">${t("cat_" + (a.category || "news"))}</span><h3>${esc(P(a.title))}</h3><p class="meta">${fmtDate(a.date)}</p></div></a>`;
}
const sectionHead = (title, sub, link) => `<div class="sec-head"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${link ? `<a class="link" href="${link}">${t("view_all")}</a>` : ""}</div>`;

async function pageHome() {
  const [unis, services, articles, scholarships, faqs] = await Promise.all([col("universities"), col("services"), col("articles"), col("scholarships"), col("faqs")]);
  const featured = unis.filter((u) => u.featured).slice(0, 8);
  const heroBg = S.heroImage ? `style="--hero-img:url('${esc(S.heroImage)}')"` : "";
  return `
  <section class="hero ${S.heroImage ? "has-img" : ""}" ${heroBg}>
    <div class="hero-pattern" aria-hidden="true"></div>
    <div class="wrap hero-in">
      <div class="hero-text">
        <p class="eyebrow">${esc(P(S.tagline))}</p>
        <h1>${esc(P(S.heroTitle))}</h1>
        <p class="lead">${esc(P(S.heroSubtitle))}</p>
        <div class="hero-actions"><a href="#/apply" class="btn btn-gold btn-lg">${t("apply_now")}</a><a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-ghost btn-lg">${icons.wa} ${t("whatsapp_us")}</a></div>
      </div>
      <div class="hero-mark"><img src="assets/mark-light.webp" alt=""></div>
    </div>
    ${(S.stats || []).length ? `<div class="wrap stats">${S.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(P(s.label))}</span></div>`).join("")}</div>` : ""}
  </section>

  <section class="section"><div class="wrap">${sectionHead(t("sec_services"), t("sec_services_sub"), "#/services")}
    <div class="grid g3">${services.slice(0, 6).map(serviceCard).join("")}</div></div></section>

  <section class="section alt"><div class="wrap">${sectionHead(t("sec_unis"), t("sec_unis_sub"), "#/universities")}
    <div class="quick-links"><a href="#/universities/gov" class="ql">🏛️ ${t("nav_gov")}</a><a href="#/universities/private" class="ql">🏫 ${t("nav_private")}</a><a href="#/prices" class="ql">💲 ${t("nav_prices")}</a><a href="#/scholarships" class="ql">🏅 ${t("nav_scholarships")}</a><a href="#/calendar" class="ql">📅 ${t("nav_calendar")}</a></div>
    <div class="grid g4">${featured.map(uniCard).join("")}</div></div></section>

  <section class="section"><div class="wrap">${sectionHead(t("sec_steps"))}
    <ol class="steps">${[1, 2, 3, 4, 5].map((i) => `<li><span class="num">${i}</span><h3>${t("step" + i)}</h3><p>${t("step" + i + "d")}</p></li>`).join("")}</ol></div></section>

  ${scholarships.length ? `<section class="section alt"><div class="wrap">${sectionHead(t("sec_scholarships"), "", "#/scholarships")}
    <div class="grid g3">${scholarships.slice(0, 3).map((s) => `<a class="card sch-card" href="#/scholarships"><h3>🏅 ${esc(P(s.title))}</h3><p>${esc(P(s.body)).slice(0, 160)}…</p></a>`).join("")}</div></div></section>` : ""}

  ${articles.length ? `<section class="section"><div class="wrap">${sectionHead(t("sec_news"), "", "#/articles")}
    <div class="grid g4">${articles.slice(0, 4).map(articleCard).join("")}</div></div></section>` : ""}

  ${faqs.length ? `<section class="section alt"><div class="wrap narrow">${sectionHead(t("sec_faq"))}${faqHtml(faqs)}</div></section>` : ""}
  ${ctaBand()}`;
}
const faqHtml = (faqs) => `<div class="faq">${faqs.map((f) => `<details><summary>${esc(P(f.q))}</summary><div>${paras(P(f.a))}</div></details>`).join("")}</div>`;
const ctaBand = () => `<section class="cta-band"><div class="wrap cta-in"><div><h2>${t("cta_title")}</h2><p>${t("cta_text")}</p></div><div class="hero-actions"><a href="#/apply" class="btn btn-gold btn-lg">${t("apply_now")}</a><a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-ghost btn-lg">${icons.wa} ${t("whatsapp_us")}</a></div></div></section>`;
const pageHead = (title, sub = "") => `<section class="page-head"><div class="wrap"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div></section>`;

async function pageUniversities(type) {
  const unis = await col("universities");
  const title = type === "gov" ? t("nav_gov") : type === "private" ? t("nav_private") : t("nav_universities");
  const cities = [...new Set(unis.map((u) => P(u.city)).filter(Boolean))].sort();
  setTimeout(() => {
    const q = document.getElementById("uq"), c = document.getElementById("ucity"), grid = document.getElementById("ugrid");
    const draw = () => {
      const qs = q.value.trim().toLowerCase();
      const list = unis.filter((u) => (!type || u.type === type) && (!c.value || P(u.city) === c.value) &&
        (!qs || [u.name?.ar, u.name?.en, u.name?.tr].join(" ").toLowerCase().includes(qs)));
      grid.innerHTML = list.length ? list.map(uniCard).join("") : `<p class="empty">${t("no_results")}</p>`;
    };
    q.addEventListener("input", draw); c.addEventListener("change", draw); draw();
  });
  return `${pageHead(title)}
  <section class="section"><div class="wrap">
    <div class="filters">
      <div class="tabs"><a href="#/universities" class="${!type ? "on" : ""}">${t("all")}</a><a href="#/universities/gov" class="${type === "gov" ? "on" : ""}">${t("gov")}</a><a href="#/universities/private" class="${type === "private" ? "on" : ""}">${t("private")}</a></div>
      <input id="uq" type="search" placeholder="${t("search")}" aria-label="${t("search")}">
      <select id="ucity" aria-label="${t("city")}"><option value="">${t("city")}: ${t("all")}</option>${cities.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
    </div>
    ${srH2(t("sr_results"))}<div class="grid g4" id="ugrid"></div></div></section>`;
}

const lines = (txt) => String(txt || "").split("\n").map((x) => x.replace(/^[\s•\-–*\d.)]+/, "").trim()).filter(Boolean);
async function pageUniversity(id) {
  const u = (await col("universities")).find((x) => x.id === id);
  if (!u) return notFound();
  const fees = parseFees(u.fees);
  const programs = lines(P(u.programs)), reqs = lines(P(u.requirements));
  const today = new Date().toISOString().slice(0, 10);
  const dates = (await col("calendar")).filter((e) => e.universityId === u.id || (!e.universityId && e.university?.en && e.university.en === u.name?.en));
  const otherName = lang === "tr" ? u.name?.en : u.name?.tr;
  const sections = [
    ["about", t("uni_about"), P(u.description) ? paras(P(u.description)) : ""],
    ["dates", t("uni_dates"), dates.length ? `<div class="uni-dates">${dates.map((e) => { const st = calStatus(e, today); return `<div class="ud st-${st}"><span class="st-badge">${t("cal_" + st)}</span>
        <dl><div><dt>${t("cal_start")}</dt><dd dir="ltr">${esc(dmy(e.regStart)) || "—"}</dd></div><div><dt>${t("cal_end")}</dt><dd dir="ltr">${esc(dmy(e.regEnd)) || "—"}</dd></div>
        <div><dt>${t("cal_results")}</dt><dd>${esc(dmy(P(e.results))) || "—"}</dd></div><div><dt>${t("cal_certs")}</dt><dd>${esc(P(e.certificates)) || "—"}</dd></div></dl></div>`; }).join("")}</div>` : ""],
    ["programs", t("uni_programs"), programs.length ? `<ul class="chips">${programs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""],
    ["fees", t("annual_fee"), fees.length ? `<table class="table"><thead><tr><th>${t("program")}</th><th>${t("annual_fee")}</th></tr></thead><tbody>${fees.map((f) => `<tr><td>${esc(P(f.name))}</td><td>${money(f.price, u.currency) || esc(f.price) || t("ask_price")}</td></tr>`).join("")}</tbody></table><p class="note">${esc(P(S.priceNote))}</p>` : ""],
    ["requirements", t("uni_requirements"), reqs.length ? `<ul class="checks">${reqs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""],
  ].filter((x) => x[2]);
  const facts = [[t("city"), P(u.city)], [t("founded"), u.founded], [t("uni_type"), t(u.type)], [t("uni_lang"), P(u.teachingLang)], [t("uni_rank"), u.ranking]].filter((x) => x[1]);
  const faqs = lines(P(u.faq)).map((l) => l.split("|").map((x) => x.trim())).filter((x) => x.length >= 2 && x[0] && x[1]);
  if (faqs.length) sections.push(["faq", t("uni_faq"), `<div class="faq">${faqs.map(([q, ...a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a.join(" | "))}</p></div></details>`).join("")}</div>`]);
  const relatedUnis = (await col("universities")).filter((x) => x.id !== u.id && (x.type === u.type || P(x.city) === P(u.city))).sort((a, b) => (P(b.city) === P(u.city)) - (P(a.city) === P(u.city))).slice(0, 4);
  return `<section class="uni-hero ${u.cover ? "has-img" : ""}" ${u.cover ? `style="--cover:url('${esc(u.cover)}')"` : ""}>
    ${u.cover ? "" : '<div class="hero-pattern" aria-hidden="true"></div><img class="uni-hero-mark" src="assets/mark-light.webp" alt="">'}
    <div class="wrap uni-hero-in">
      <nav class="crumbs" aria-label="${t("breadcrumb")}"><a href="#/">${t("nav_home")}</a> / <a href="#/universities/${u.type}">${t(u.type === "gov" ? "nav_gov" : "nav_private")}</a></nav>
      <div class="uni-hero-title">${u.image ? `<div class="uni-logo"><img src="${esc(u.image)}" alt=""></div>` : ""}
        <div><span class="tag ${u.type}">${t(u.type === "gov" ? "nav_gov" : "nav_private")}</span>
        <h1>${esc(P(u.name))}${otherName && otherName !== P(u.name) ? ` <span class="alt-name" dir="ltr">${esc(otherName)}</span>` : ""}</h1>
        <p>${esc(P(u.city))}${u.founded ? ` · ${t("founded")} ${esc(u.founded)}` : ""}</p></div></div>
    </div></section>
  ${sections.length > 1 ? `<nav class="uni-tabs" aria-label="${t("on_this_page")}"><div class="wrap">${sections.map(([k, l]) => `<a href="#/university/${esc(u.id)}?s=${k}" data-sec="${k}">${l}</a>`).join("")}</div></nav>` : ""}
  <section class="section"><div class="wrap two-col">
    <article class="uni-body">${sections.map(([k, l, h]) => `<div class="uni-sec" id="sec-${k}"><h2>${l}</h2>${h}</div>`).join("") || `<p class="muted">${t("uni_soon")}</p>`}
      ${updatedLine(u)}${shareBar(P(u.name))}
      <div class="uni-cta card"><div><h3>${t("uni_cta_title")}</h3><p>${t("uni_cta_text")}</p></div><a href="#/apply?university=${encodeURIComponent(u.id)}" class="btn btn-gold btn-lg">${t("apply_now")}</a></div>
    </article>
    <div class="uni-side">
      <div class="side-card">
        ${u.type === "private" && u.priceFrom ? `<p class="price big">${t("price_from")} <b>${money(u.priceFrom, u.currency)}</b> <small>${t("per_year")}</small></p>` : ""}
        ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
        <a href="#/apply?university=${encodeURIComponent(u.id)}" class="btn btn-gold btn-block">${t("apply_now")}</a>
        ${u.website ? `<a href="${esc(u.website)}" target="_blank" rel="noopener" class="link">${t("website")} ↗</a>` : ""}
      </div>
      <div class="side-card contact-box">
        <h3>${t("uni_help")}</h3><p>${t("uni_help_text")}</p>
        ${S.whatsapp ? `<a href="${waLink(P(u.name))}" target="_blank" rel="noopener" class="btn btn-wa btn-block">${icons.wa} WhatsApp</a>` : ""}
        ${S.telegram ? `<a href="${esc(S.telegram)}" target="_blank" rel="noopener" class="btn btn-tg btn-block">${icons.tg} ${t("uni_telegram")}</a>` : ""}
      </div>
    </div></div></section>
  ${relatedUnis.length ? `<section class="section alt"><div class="wrap">${sectionHead(t("related_unis"), "", "#/universities/" + u.type)}<div class="grid g4">${relatedUnis.map(uniCard).join("")}</div></div></section>` : ""}`;
}

async function pagePrices() {
  const unis = (await col("universities")).filter((u) => u.type === "private");
  return `${pageHead(t("nav_prices"), esc(P(S.priceNote)))}
  <section class="section"><div class="wrap">
    <input id="pq" type="search" placeholder="${t("search")}" aria-label="${t("search")}" class="wide-search">
    <div id="plist">${unis.map((u) => {
      const fees = parseFees(u.fees);
      return `<div class="price-block" data-s="${esc([u.name?.ar, u.name?.en, u.name?.tr, ...fees.map((f) => [f.name.ar, f.name.en, f.name.tr].join(" "))].join(" ").toLowerCase())}">
        <div class="pb-head"><a href="#/university/${esc(u.id)}"><h2>${esc(P(u.name))}</h2></a><span class="meta">${esc(P(u.city))}</span>${u.priceFrom ? `<span class="price-pill">${t("price_from")} ${money(u.priceFrom, u.currency)}</span>` : ""}</div>
        ${fees.length ? `<table class="table"><thead><tr><th>${t("program")}</th><th>${t("annual_fee")}</th></tr></thead><tbody>${fees.map((f) => `<tr><td>${esc(P(f.name))}</td><td>${money(f.price, u.currency) || esc(f.price) || t("ask_price")}</td></tr>`).join("")}</tbody></table>` : `<p class="muted">${t("ask_price")}</p>`}
      </div>`;
    }).join("") || `<p class="empty">${t("no_results")}</p>`}</div></div></section>`;
}

async function pageServices() {
  const services = await col("services");
  return `${pageHead(t("sec_services"), t("sec_services_sub"))}<section class="section"><div class="wrap">${srH2(t("sec_services"))}<div class="grid g3">${services.map(serviceCard).join("")}</div></div></section>${ctaBand()}`;
}

async function pageScholarships() {
  const list = await col("scholarships");
  return `${pageHead(t("nav_scholarships"))}<section class="section"><div class="wrap narrow">${list.map((s) => `
    <div class="card sch-full">${s.image ? `<img src="${esc(s.image)}" alt="" class="sch-img">` : ""}<h2>🏅 ${esc(P(s.title))}</h2>${paras(P(s.body))}
    <div class="row-gap">${s.deadline ? `<span class="price-pill">${t("deadline")}: ${fmtDate(s.deadline)}</span>` : ""}${s.link ? `<a class="link" href="${esc(s.link)}" target="_blank" rel="noopener">${t("official_link")} ↗</a>` : ""}<a class="btn btn-gold" href="#/apply">${t("apply_now")}</a></div></div>`).join("") || `<p class="empty">${t("no_results")}</p>`}</div></section>`;
}

const dmy = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d || "") ? d.split("-").reverse().join(".") : d || "");
function calStatus(e, today) {
  if (e.regEnd && e.regEnd < today) return "closed";
  if (e.regStart && e.regStart > today) return "soon";
  return "open";
}
async function pageCalendar(level) {
  const today = new Date().toISOString().slice(0, 10);
  const order = { open: 0, soon: 1, closed: 2 };
  const unis = await col("universities");
  const all = await col("calendar");
  const levels = ["bachelor", "graduate", "yos"].filter((l) => all.some((e) => (e.level || "bachelor") === l));
  const list = all.filter((e) => !level || (e.level || "bachelor") === level).map((e) => ({ ...e, st: calStatus(e, today) }))
    .sort((a, b) => order[a.st] - order[b.st] || String(a.st === "closed" ? b.regEnd : a.regEnd || a.regStart).localeCompare(String(a.st === "closed" ? a.regEnd : b.regEnd || b.regStart)));
  setTimeout(() => {
    const q = document.getElementById("cq"), clr = document.getElementById("cclear"), sel = document.getElementById("cst");
    const draw = () => {
      const v = q.value.trim().toLowerCase();
      let shown = 0;
      document.querySelectorAll("#ctable tbody tr[data-s]").forEach((tr) => {
        const ok = (!v || tr.dataset.s.includes(v)) && (!sel.value || tr.dataset.st === sel.value);
        tr.hidden = !ok; if (ok) shown++;
      });
      document.getElementById("cempty").hidden = shown > 0;
    };
    q.addEventListener("input", draw); sel.addEventListener("change", draw);
    clr.addEventListener("click", () => { q.value = ""; sel.value = ""; draw(); q.focus(); });
    draw();
  });
  const rows = list.map((e) => {
    const uni = e.universityId ? unis.find((u) => u.id === e.universityId) : unis.find((u) => u.name?.en && u.name.en === e.university?.en);
    const link = uni ? `#/university/${uni.id}` : e.link || "#/apply";
    const ext = /^https?:/.test(link);
    return `<tr class="st-${e.st}" data-st="${e.st}" data-s="${esc([e.university?.ar, e.university?.en, e.university?.tr, e.city?.ar, e.city?.en, e.city?.tr].join(" ").toLowerCase())}">
      <td data-l="${t("cal_university")}"><b>${esc(P(e.university))}</b><span class="st-badge">${t("cal_" + e.st)}</span></td>
      <td data-l="${t("city")}">${esc(P(e.city))}</td>
      <td data-l="${t("cal_start")}" dir="ltr">${esc(dmy(e.regStart)) || "—"}</td>
      <td data-l="${t("cal_end")}" dir="ltr">${esc(dmy(e.regEnd)) || "—"}</td>
      <td data-l="${t("cal_results")}">${esc(dmy(P(e.results))) || "—"}</td>
      <td data-l="${t("cal_certs")}">${esc(P(e.certificates)) || "—"}</td>
      <td class="cal-act"><a class="btn btn-reg" href="${esc(link)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t("cal_register")}</a></td></tr>`;
  }).join("");
  return `${pageHead(t("cal_title"), t("cal_sub"))}<section class="section"><div class="wrap">
    <div class="cal-search card"><label for="cq">🔍 ${t("cal_search_label")}</label>
      <div class="cal-search-row"><input id="cq" type="search" placeholder="${t("cal_search_ph")}">
      <select id="cst" aria-label="${t("cal_status")}"><option value="">${t("all")}</option><option value="open">${t("cal_open")}</option><option value="soon">${t("cal_soon")}</option><option value="closed">${t("cal_closed")}</option></select>
      <button class="btn btn-clear" id="cclear" type="button">${t("cal_clear")}</button></div></div>
    ${levels.length > 1 ? `<div class="tabs cal-levels"><a href="#/calendar" class="${!level ? "on" : ""}">${t("lvl_all")}</a>${levels.map((l) => `<a href="#/calendar/${l}" class="${level === l ? "on" : ""}">${t("lvl_" + l)}</a>`).join("")}</div>` : ""}
    <div class="cal-legend"><span class="lg open">${t("cal_open")}</span><span class="lg soon">${t("cal_soon")}</span><span class="lg closed">${t("cal_closed")}</span></div>
    <div class="cal-wrap"><table class="cal-table" id="ctable"><thead><tr><th>${t("cal_university")}</th><th>${t("city")}</th><th>${t("cal_start")}</th><th>${t("cal_end")}</th><th>${t("cal_results")}</th><th>${t("cal_certs")}</th><th>${t("cal_link")}</th></tr></thead>
    <tbody>${rows}</tbody></table><p class="empty" id="cempty" hidden>${t("no_results")}</p></div>
    <p class="note">${t("cal_note")}</p></div></section>${ctaBand()}`;
}

async function pageArticles(cat) {
  const list = await col("articles");
  const cats = ["news", "guide", "exams", "openedu", "rankings", "recognition"].filter((c) => list.some((a) => a.category === c));
  const shown = cat ? list.filter((a) => a.category === cat) : list;
  return `${pageHead(cat ? t("cat_" + cat) : t("nav_articles"))}<section class="section"><div class="wrap">
    <div class="tabs"><a href="#/articles" class="${!cat ? "on" : ""}">${t("cat_all")}</a>${cats.map((c) => `<a href="#/articles/${c}" class="${cat === c ? "on" : ""}">${t("cat_" + c)}</a>`).join("")}</div>
    ${srH2(t("sr_results"))}<div class="grid g4">${[...shown].sort((a, b) => String(b.date).localeCompare(String(a.date))).map(articleCard).join("") || `<p class="empty">${t("no_results")}</p>`}</div></div></section>`;
}

async function pageArticle(id) {
  const a = (await col("articles")).find((x) => x.id === id);
  if (!a) return notFound();
  const related = (await col("articles")).filter((x) => x.id !== a.id && x.category === a.category).slice(0, 4);
  return `${pageHead(esc(P(a.title)), `${t("cat_" + (a.category || "news"))} · ${fmtDate(a.date)}`)}
  <section class="section"><div class="wrap narrow"><div class="prose">${a.image ? `<img src="${esc(a.image)}" alt="" class="article-img">` : ""}${paras(P(a.body))}</div>
  ${updatedLine(a)}${shareBar(P(a.title))}
  <p class="mt"><a href="#/articles/${esc(a.category || "")}" class="link">${t("back")}</a></p></div></section>
  ${related.length ? `<section class="section alt"><div class="wrap">${sectionHead(t("related_articles"))}<div class="grid g4">${related.map(articleCard).join("")}</div></div></section>` : ""}${ctaBand()}`;
}

async function pageAbout() {
  return `${pageHead(t("nav_about"))}<section class="section"><div class="wrap two-col">
    <article class="prose">${paras(P(S.about))}</article>
    <div class="side-card center"><img src="assets/logo-ar.webp" alt="" class="about-logo" width="500" height="193" loading="lazy"><img src="assets/logo.webp" alt="" class="about-logo" width="600" height="133" loading="lazy"></div></div></section>
    ${(S.stats || []).length ? `<section class="section alt"><div class="wrap stats dark">${S.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(P(s.label))}</span></div>`).join("")}</div></section>` : ""}${ctaBand()}`;
}

async function pageContact() {
  return `${pageHead(t("contact_title"))}<section class="section"><div class="wrap two-col">
    <div class="contact-list">
      ${S.phones ? `<div><h2>${t("phones")}</h2>${String(S.phones).split("\n").filter(Boolean).map((p) => `<a href="tel:${esc(p.replace(/\s/g, ""))}" dir="ltr">${esc(p)}</a>`).join("<br>")}</div>` : ""}
      ${S.whatsapp ? `<div><h2>WhatsApp</h2><a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-gold">${icons.wa} ${t("whatsapp_us")}</a></div>` : ""}
      ${S.email ? `<div><h2>${t("email")}</h2><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></div>` : ""}
      ${P(S.address) ? `<div><h2>${t("address")}</h2><p>${esc(P(S.address))}</p></div>` : ""}
      ${P(S.workingHours) ? `<div><h2>${t("hours")}</h2><p>${esc(P(S.workingHours))}</p></div>` : ""}
      <div><h2>${t("follow")}</h2><div class="footer-social dark">${socials()}</div></div>
    </div>
    <div>${S.mapEmbed && /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(S.mapEmbed) ? `<iframe class="map" src="${esc(S.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="map"></iframe>` : `<div class="side-card center"><img src="assets/mark.webp" alt="" style="width:120px"></div>`}</div>
  </div></section>`;
}

async function pageApply(params) {
  const [unis, services] = await Promise.all([col("universities"), col("services")]);
  const preUni = params.get("university") || "", preSvc = params.get("service") || "";
  setTimeout(() => bindApplyForm(unis, services));
  const req = '<span class="req">*</span>';
  return `${pageHead(t("form_title"), t("form_sub"))}<section class="section"><div class="wrap narrow">
  <form id="apply" class="form card" novalidate>
    <div class="form-grid">
      <label>${t("f_name")} ${req}<input name="name" required autocomplete="name"></label>
      <label>${t("f_phone")} ${req}<input name="phone" required type="tel" dir="ltr" autocomplete="tel" placeholder="+90 5xx xxx xx xx"></label>
      <label>${t("f_email")}<input name="email" type="email" dir="ltr" autocomplete="email"></label>
      <label>${t("f_nationality")} ${req}<input name="nationality" required></label>
      <label>${t("f_country")}<input name="country"></label>
      <label>${t("f_degree")} ${req}<select name="degree" required><option value=""></option>${["bachelor", "master", "phd", "associate", "language"].map((d) => `<option value="${d}">${t("deg_" + d)}</option>`).join("")}</select></label>
      <label>${t("f_major")}<input name="major"></label>
      <label>${t("f_gpa")}<input name="gpa"></label>
      <label>${t("f_unitype")}<select name="unitype"><option value="any">${t("any")}</option><option value="gov">${t("gov")}</option><option value="private">${t("private")}</option></select></label>
      <label>${t("f_university")}<select name="university"><option value="">${t("undecided")}</option>${unis.map((u) => `<option value="${esc(u.id)}" ${u.id === preUni ? "selected" : ""}>${esc(P(u.name))}</option>`).join("")}</select></label>
      <label class="full">${t("f_service")}<select name="service"><option value="">—</option>${services.map((s) => `<option value="${esc(s.id)}" ${s.id === preSvc ? "selected" : ""}>${esc(P(s.title))}</option>`).join("")}</select></label>
      <label class="full">${t("f_message")}<textarea name="message" rows="4"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="check full"><input type="checkbox" name="consent" required> <span>${t("f_consent")} ${req}</span></label>
    </div>
    <p class="form-error" hidden></p>
    <button class="btn btn-gold btn-lg" type="submit">${t("submit")}</button>
  </form>
  <div id="apply-done" class="card done" hidden><h2>${t("sent_title")}</h2><p>${t("sent_text")}</p><a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-gold">${icons.wa} ${t("whatsapp_us")}</a></div>
  </div></section>`;
}
function bindApplyForm(unis, services) {
  const f = document.getElementById("apply");
  if (!f) return;
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = f.querySelector(".form-error");
    err.hidden = true;
    f.querySelectorAll(".invalid").forEach((x) => x.classList.remove("invalid"));
    const bad = [...f.querySelectorAll("[required]")].filter((x) => (x.type === "checkbox" ? !x.checked : !x.value.trim()));
    if (bad.length) {
      bad.forEach((x) => x.closest("label").classList.add("invalid"));
      err.textContent = t("required");
      err.hidden = false;
      bad[0].focus();
      return;
    }
    const fd = Object.fromEntries(new FormData(f).entries());
    if (fd.website) return; // spam bot
    const u = unis.find((x) => x.id === fd.university), s = services.find((x) => x.id === fd.service);
    const app = {
      name: fd.name.trim().slice(0, 200), phone: fd.phone.trim().slice(0, 50), email: (fd.email || "").trim().slice(0, 200),
      nationality: fd.nationality.slice(0, 100), country: (fd.country || "").slice(0, 100), degree: fd.degree, major: (fd.major || "").slice(0, 200),
      gpa: (fd.gpa || "").slice(0, 50), unitype: fd.unitype, university: u ? (u.name.en || P(u.name)) : "", service: s ? (s.title.en || P(s.title)) : "",
      message: (fd.message || "").slice(0, 3000), lang, consent: true, consent_at: new Date().toISOString(),
    };
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = t("sending");
    try {
      await Store.submitApplication(app);
      f.hidden = true;
      document.getElementById("apply-done").hidden = false;
      if (window.KAMMotion) window.KAMMotion.scrollTo(0); else window.scrollTo(0, 0);
    } catch (ex) {
      console.error(ex);
      err.textContent = t("send_error"); err.hidden = false;
      btn.disabled = false; btn.textContent = t("submit");
    }
  });
}

function pagePrivacy() {
  const co = esc(S.companyLegalName || "KAM");
  const contact = [S.email, String(S.phones || "").split("\n")[0]].filter(Boolean).map(esc).join(" · ");
  const body = {
    ar: `<p>يوضح هذا النص كيف يعالج ${co} ("المكتب") بياناتك الشخصية وفقاً لقانون حماية البيانات الشخصية التركي رقم 6698 (KVKK).</p>
      <h2 class="ph">١. البيانات التي نجمعها</h2><p>الاسم، رقم الهاتف، البريد الإلكتروني، الجنسية وبلد الإقامة، المعلومات الدراسية (المرحلة، التخصص، المعدل، الجامعة المفضلة) وأي ملاحظات ترسلها لنا عبر نموذج التسجيل.</p>
      <h2 class="ph">٢. سبب المعالجة</h2><p>للتواصل معك بخصوص طلبك، وتقديم الاستشارة، والتقديم على الجامعات والخدمات التي تطلبها، وتنفيذ الالتزامات القانونية.</p>
      <h2 class="ph">٣. الأساس القانوني</h2><p>موافقتك الصريحة، وضرورة المعالجة لإبرام العقد وتنفيذه (المادة 5 من القانون).</p>
      <h2 class="ph">٤. نقل البيانات</h2><p>تُنقل بياناتك فقط إلى الجامعات والجهات الرسمية التي تطلب التقديم عليها، وإلى مزودي الخدمات التقنية الذين نستخدمهم لحفظ البيانات، وبالقدر اللازم فقط.</p>
      <h2 class="ph">٥. مدة الحفظ</h2><p>نحفظ بياناتك طوال فترة تقديم الخدمة والمدة التي يفرضها القانون، ثم نحذفها أو نجعلها مجهولة الهوية.</p>
      <h2 class="ph">٦. حقوقك</h2><p>يحق لك وفق المادة 11 معرفة ما إذا كانت بياناتك تُعالج، وطلب معلومات عنها، وتصحيحها أو حذفها، والاعتراض على معالجتها. للتواصل: ${contact}</p>`,
    en: `<p>This notice explains how ${co} ("the Office") processes your personal data under Turkish Personal Data Protection Law No. 6698 (KVKK).</p>
      <h2 class="ph">1. Data we collect</h2><p>Name, phone number, email, nationality and country of residence, education details (degree level, program, grade, preferred university) and any notes you send through the application form.</p>
      <h2 class="ph">2. Purpose</h2><p>To contact you about your application, provide advice, apply to the universities and services you request, and meet legal obligations.</p>
      <h2 class="ph">3. Legal basis</h2><p>Your explicit consent, and processing necessary to enter into and perform a contract (Article 5 of the Law).</p>
      <h2 class="ph">4. Transfers</h2><p>Your data is shared only with the universities and authorities you ask us to apply to, and with the technical service providers we use to store data, only as far as necessary.</p>
      <h2 class="ph">5. Retention</h2><p>We keep your data while providing the service and for the period required by law, then delete or anonymise it.</p>
      <h2 class="ph">6. Your rights</h2><p>Under Article 11 you may learn whether your data is processed, request information, ask for correction or deletion, and object to processing. Contact: ${contact}</p>`,
    tr: `<p>Bu aydınlatma metni, ${co} ("Ofis") tarafından kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında nasıl işlendiğini açıklar.</p>
      <h2 class="ph">1. Toplanan veriler</h2><p>Ad soyad, telefon, e-posta, uyruk ve ikamet ülkesi, eğitim bilgileri (seviye, bölüm, not ortalaması, tercih edilen üniversite) ve başvuru formuyla ilettiğiniz notlar.</p>
      <h2 class="ph">2. İşleme amacı</h2><p>Başvurunuzla ilgili sizinle iletişime geçmek, danışmanlık vermek, talep ettiğiniz üniversite ve hizmetlere başvurmak ve yasal yükümlülükleri yerine getirmek.</p>
      <h2 class="ph">3. Hukuki sebep</h2><p>Açık rızanız ve bir sözleşmenin kurulması ile ifası için gerekli olması (Kanun md. 5).</p>
      <h2 class="ph">4. Aktarım</h2><p>Verileriniz yalnızca başvurmamızı istediğiniz üniversitelere ve resmî kurumlara, ayrıca verileri saklamak için kullandığımız teknik hizmet sağlayıcılara, gerekli ölçüde aktarılır.</p>
      <h2 class="ph">5. Saklama süresi</h2><p>Verileriniz hizmet süresince ve kanunun öngördüğü süre boyunca saklanır, ardından silinir veya anonim hâle getirilir.</p>
      <h2 class="ph">6. Haklarınız</h2><p>Kanunun 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme veya silme isteme ve işlemeye itiraz etme haklarına sahipsiniz. İletişim: ${contact}</p>`,
  };
  return `${pageHead(t("privacy_title"))}<section class="section"><div class="wrap narrow prose">${body[lang] || body.en}</div></section>`;
}

async function pageSearch(q) {
  const norm = (x) => String(x || "").toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0300-\u036f]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ı/g, "i");
  const all3 = (o) => (o && typeof o === "object" ? [o.ar, o.en, o.tr].join(" ") : String(o || ""));
  setTimeout(() => {
    const f = document.getElementById("sform");
    f?.addEventListener("submit", (e) => { e.preventDefault(); location.hash = "#/search?q=" + encodeURIComponent(f.q.value.trim()); });
    if (!q) f?.q.focus();
  });
  let body = "";
  if (q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    const match = (txt) => { const n = norm(txt); return words.every((w) => n.includes(w)); };
    const [unis, arts, schs, cals, svcs] = await Promise.all([col("universities"), col("articles"), col("scholarships"), col("calendar"), col("services")]);
    const groups = [
      [t("nav_universities"), unis.filter((u) => match([all3(u.name), all3(u.city), all3(u.description), all3(u.programs), u.fees].join(" "))).map((u) => [`#/university/${u.id}`, P(u.name), `${t(u.type)} · ${P(u.city)}`])],
      [t("nav_calendar"), cals.filter((e) => match(all3(e.university) + " " + all3(e.city))).map((e) => [`#/calendar`, P(e.university), `${t("cal_start")} ${dmy(e.regStart)} · ${t("cal_end")} ${dmy(e.regEnd)}`])],
      [t("nav_scholarships"), schs.filter((x) => match(all3(x.title) + " " + all3(x.body))).map((x) => [`#/scholarships`, P(x.title), ""])],
      [t("nav_services"), svcs.filter((x) => match(all3(x.title) + " " + all3(x.description))).map((x) => [`#/services`, P(x.title), ""])],
      [t("nav_articles"), arts.filter((a) => match(all3(a.title) + " " + all3(a.body))).map((a) => [`#/article/${a.id}`, P(a.title), t("cat_" + (a.category || "news"))])],
    ].filter((g) => g[1].length);
    const total = groups.reduce((n, g) => n + g[1].length, 0);
    body = `<p class="muted">${total} ${t("results_for")} «${esc(q)}»</p>` + (groups.map(([title, items]) => `<h2 class="search-h">${title} <small>(${items.length})</small></h2><ul class="search-list">${items.slice(0, 30).map(([href, name, meta]) => `<li><a href="${esc(href)}"><b>${esc(name)}</b>${meta ? `<span>${esc(meta)}</span>` : ""}</a></li>`).join("")}</ul>`).join("") || `<p class="empty">${t("search_none")}</p><a class="btn btn-gold" href="${waLink(q)}" target="_blank" rel="noopener">${icons.wa} ${t("whatsapp_us")}</a>`);
  }
  return `${pageHead(t("search_title"))}<section class="section"><div class="wrap narrow">
    <form id="sform" class="search-form" role="search"><input name="q" type="search" value="${esc(q)}" placeholder="${t("search_ph")}" aria-label="${t("search_ph")}"><button class="btn btn-gold" type="submit">${icons.search} ${t("search_title")}</button></form>
    ${body}</div></section>`;
}

const notFound = () => `${pageHead(t("not_found"))}<section class="section"><div class="wrap"><a class="btn btn-gold" href="#/">${t("nav_home")}</a></div></section>`;

// ---------- router ----------
async function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, qs] = hash.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(qs || "");
  document.body.classList.remove("nav-open");
  let html;
  app.setAttribute("aria-busy", "true");
  try {
    switch (parts[0]) {
      case undefined: html = await pageHome(); break;
      case "universities": html = await pageUniversities(parts[1]); break;
      case "university": html = await pageUniversity(parts[1]); break;
      case "prices": html = await pagePrices(); break;
      case "services": html = await pageServices(); break;
      case "scholarships": html = await pageScholarships(); break;
      case "calendar": html = await pageCalendar(parts[1]); break;
      case "search": html = await pageSearch(params.get("q") || ""); break;
      case "articles": html = await pageArticles(parts[1]); break;
      case "article": html = await pageArticle(parts[1]); break;
      case "about": html = await pageAbout(); break;
      case "contact": html = await pageContact(); break;
      case "apply": html = await pageApply(params); break;
      case "privacy": html = pagePrivacy(); break;
      default: html = notFound();
    }
  } catch (e) {
    console.error(e);
    html = `<section class="section"><div class="wrap"><p class="empty">${t("send_error")}</p></div></section>`;
  }
  app.innerHTML = html;
  app.removeAttribute("aria-busy");
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + path || (path === "/" && a.getAttribute("href") === "#/")));
  const h1 = app.querySelector("h1");
  document.title = (path === "/" ? "" : (h1 ? h1.textContent + " | " : "")) + (P(S.siteName) || "KAM");
  const desc = (app.querySelector(".page-head p, .uni-sec p, .lead, .prose p")?.textContent || P(S.heroSubtitle) || "").trim().slice(0, 160);
  for (const [sel, attr, val] of [['meta[name="description"]', "content", desc], ['meta[property="og:title"]', "content", document.title], ['meta[property="og:description"]', "content", desc]]) {
    const m = document.querySelector(sel); if (m) m.setAttribute(attr, val);
  }
  const sec = params.get("s") && document.getElementById("sec-" + params.get("s"));
  if (window.KAMMotion) window.KAMMotion.onPage({ target: sec || null });
  else if (sec) sec.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);
  if (path === "/prices") {
    const q = document.getElementById("pq");
    q?.addEventListener("input", () => {
      const v = q.value.trim().toLowerCase();
      document.querySelectorAll(".price-block").forEach((b) => (b.hidden = v && !b.dataset.s.includes(v)));
    });
  }
}

(async function init() {
  try { S = await Store.getSettings(); } catch (e) { console.error(e); S = {}; }
  renderShell();
  ticker().catch(console.error);
  window.addEventListener("hashchange", route);
  await route();
})();
