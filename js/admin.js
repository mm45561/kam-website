import * as Store from "./store.js?v=202611152110";
import { SCHEMAS, SETTINGS_FIELDS } from "./schemas.js?v=202611152110";
import { SEED } from "./seed.js?v=202611152110";
import { parseFees } from "./utils.js?v=202611152110";

const LANGS = [["ar", "عربي"], ["en", "English"], ["tr", "Türkçe"]];
const P = (o) => (o && typeof o === "object" ? o.ar || o.en || o.tr || "" : o ?? "");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, r = document) => r.querySelector(s);
const root = document.getElementById("admin");

const STATUSES = [["new", "جديد", "#2563eb"], ["contacted", "تم التواصل", "#a16207"], ["in_progress", "قيد المعالجة", "#7c3aed"], ["accepted", "مقبول", "#15803d"], ["rejected", "مرفوض / ملغي", "#6b7280"]];
const DEGREES = { bachelor: "بكالوريوس", master: "ماجستير", phd: "دكتوراه", language: "سنة لغة", associate: "دبلوم" };

function toast(msg, bad = false) {
  const el = document.createElement("div");
  el.className = "toast" + (bad ? " bad" : "");
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
const errMsg = (e) => (e?.message || String(e));

// ---------------- login ----------------
async function showLogin() {
  root.innerHTML = `<div class="login-wrap"><form class="login card" id="login">
    <img src="assets/logo-ar.png" alt="KAM" class="login-logo">
    <h1>لوحة الإدارة</h1>
    ${Store.IS_DEMO ? `<p class="demo-note">نسخة تجريبية: كلمة السر هي <b dir="ltr">${Store.DEMO_HINT}</b></p>` : ""}
    <label>البريد الإلكتروني<input name="email" type="email" dir="ltr" autocomplete="username" ${Store.IS_DEMO ? "" : "required"}></label>
    <label>كلمة السر<input name="password" type="password" dir="ltr" autocomplete="current-password" required></label>
    <p class="err" hidden></p>
    <button class="btn btn-primary btn-block">دخول</button>
    <a href="index.html" class="back-link">← العودة إلى الموقع</a>
  </form></div>`;
  $("#login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, err = $(".err", f);
    err.hidden = true;
    try {
      await Store.signIn(f.email.value.trim(), f.password.value);
      start();
    } catch (ex) {
      err.textContent = "البريد أو كلمة السر غير صحيحة";
      err.hidden = false;
    }
  });
}

// ---------------- shell ----------------
const VIEWS = [
  ["dashboard", "🏠", "الرئيسية"],
  ["applications", "📥", "طلبات الطلاب"],
  ...Object.entries(SCHEMAS).map(([k, s]) => [k, s.icon, s.title]),
  ["settings", "⚙️", "إعدادات الموقع"],
  ["help", "❔", "طريقة الاستخدام"],
];
// ---------------- two-step login (authenticator app) ----------------
async function showMfa(mode) {
  let enroll = null;
  if (mode === "enroll") {
    try { enroll = await Store.mfaEnroll(); } catch (e) { console.error(e); }
  }
  root.innerHTML = `<div class="login-wrap"><form class="login card" id="mfa">
    <img src="assets/logo-ar.png" alt="KAM" class="login-logo">
    <h1>التحقق بخطوتين</h1>
    ${mode === "enroll" ? `<p class="muted">لحماية لوحة الإدارة، أضف هذا الحساب إلى تطبيق مصادقة على هاتفك (Google Authenticator أو Microsoft Authenticator): افتح التطبيق، اضغط +، ثم امسح الرمز.</p>
      ${enroll ? `<img class="mfa-qr" alt="QR" src="${esc(enroll.qr)}"><p class="muted small">أو اكتب هذا المفتاح يدوياً:</p><code class="mfa-secret" dir="ltr">${esc(enroll.secret)}</code>` : `<p class="err">تعذّر إنشاء الرمز. حدّث الصفحة وحاول مرة أخرى.</p>`}` :
      `<p class="muted">افتح تطبيق المصادقة على هاتفك واكتب الرمز المكوّن من 6 أرقام.</p>`}
    <label>الرمز<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" maxlength="7" dir="ltr" required></label>
    <p class="err" hidden></p>
    <button class="btn btn-primary btn-block">تأكيد</button>
    <button type="button" class="linkbtn back-link" id="mfa-out">تسجيل الخروج</button>
  </form></div>`;
  $("#mfa-out").onclick = async () => { await Store.signOut(); showLogin(); };
  $("#mfa").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, err = $(".err", f);
    err.hidden = true;
    try {
      await Store.mfaVerify(f.code.value, enroll?.factorId);
      start();
    } catch (ex) {
      err.textContent = "الرمز غير صحيح أو انتهت صلاحيته. جرّب الرمز الجديد.";
      err.hidden = false;
    }
  });
}

// Sign out automatically after 30 minutes without any activity in the admin panel.
const IDLE_MS = 30 * 60 * 1000;
let idleTimer = null, idleArmed = false;
function armIdleLogout() {
  if (Store.IS_DEMO || idleArmed) return;
  idleArmed = true;
  const reset = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(async () => { await Store.signOut(); location.hash = ""; showLogin(); }, IDLE_MS);
  };
  ["click", "keydown", "pointermove", "scroll"].forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
  reset();
}

async function start() {
  const user = await Store.currentUser();
  if (!user) return showLogin();
  const mfa = await Store.mfaStatus();
  if (mfa !== "ok") return showMfa(mfa);
  armIdleLogout();
  root.innerHTML = `
  <div class="layout">
    <aside class="side"><img src="assets/logo-light.png" class="side-logo" alt="KAM">
      <nav>${VIEWS.map(([k, ic, label]) => `<a href="#${k}" data-view="${k}"><span>${ic}</span>${label}</a>`).join("")}</nav>
      <div class="side-foot"><a href="index.html" target="_blank">↗ فتح الموقع</a><button id="logout" class="linkbtn">تسجيل الخروج</button></div>
    </aside>
    <div class="main"><header class="topbar"><button class="menu-btn" id="menu">☰</button><h1 id="view-title"></h1>${Store.IS_DEMO ? '<span class="badge-demo">نسخة تجريبية</span>' : ""}</header>
    <div id="view" class="view"></div></div>
  </div>`;
  $("#logout").onclick = async () => { await Store.signOut(); showLogin(); };
  $("#menu").onclick = () => document.body.classList.toggle("side-open");
  window.onhashchange = render;
  render();
}

async function render() {
  const key = (location.hash.slice(1) || "dashboard").split("/")[0];
  const v = VIEWS.find((x) => x[0] === key) || VIEWS[0];
  document.querySelectorAll("[data-view]").forEach((a) => a.classList.toggle("on", a.dataset.view === v[0]));
  document.body.classList.remove("side-open");
  $("#view-title").textContent = v[2];
  const view = $("#view");
  view.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;
  try {
    if (v[0] === "dashboard") await viewDashboard(view);
    else if (v[0] === "applications") await viewApplications(view);
    else if (v[0] === "settings") await viewSettings(view);
    else if (v[0] === "help") viewHelp(view);
    else await viewCollection(view, v[0]);
  } catch (e) {
    console.error(e);
    view.innerHTML = `<div class="card err-card"><b>حدث خطأ:</b> ${esc(errMsg(e))}</div>`;
  }
}

// ---------------- dashboard ----------------
async function viewDashboard(view) {
  const apps = await Store.listApplications();
  const counts = Object.fromEntries(STATUSES.map(([k]) => [k, apps.filter((a) => a.status === k).length]));
  const lists = await Promise.all(Object.keys(SCHEMAS).map((k) => Store.list(k, { all: true })));
  const empty = lists.every((l) => l.length === 0);
  view.innerHTML = `
    ${Store.IS_DEMO ? `<div class="card warn">هذه نسخة تجريبية. كل التعديلات محفوظة في هذا المتصفح فقط ولا يراها أحد غيرك. الأسعار والمواعيد الموجودة أمثلة، غيّرها قبل النشر الحقيقي.
      <button class="btn btn-small" id="reset-demo">إرجاع البيانات التجريبية الأصلية</button></div>` : ""}
    ${!Store.IS_DEMO && empty ? `<div class="card warn">قاعدة البيانات فارغة. هل تريد إضافة المحتوى الأولي (جامعات، خدمات، مقالات) لتعدّل عليه؟ <button class="btn btn-small" id="import-seed">إضافة المحتوى الأولي</button></div>` : ""}
    <div class="kpis">${STATUSES.map(([k, l, c]) => `<a class="kpi" href="#applications" data-st="${k}" style="--c:${c}"><b>${counts[k]}</b><span>${l}</span></a>`).join("")}</div>
    <div class="card"><h2>آخر الطلبات</h2>${apps.length ? appTable(apps.slice(0, 6)) : '<p class="muted">لا توجد طلبات بعد. الطلبات التي يرسلها الطلاب من صفحة "سجّل الآن" تظهر هنا.</p>'}</div>
    <div class="quick">${Object.entries(SCHEMAS).map(([k, s], i) => `<a class="card q" href="#${k}"><span>${s.icon}</span><b>${s.title}</b><small>${lists[i].length} عنصر</small></a>`).join("")}</div>`;
  $("#reset-demo")?.addEventListener("click", () => { if (confirm("سيتم حذف كل تعديلاتك التجريبية. متأكد؟")) { Store.resetDemo(); location.reload(); } });
  $("#import-seed")?.addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      for (const [k, arr] of Object.entries(SEED.content)) for (const it of arr) { const { id, created_at, ...rest } = it; await Store.save(k, rest); }
      await Store.saveSettings(SEED.settings);
      toast("تمت إضافة المحتوى");
      render();
    } catch (ex) { toast(errMsg(ex), true); e.target.disabled = false; }
  });
  bindAppRows(view, apps);
}

// ---------------- applications ----------------
const stLabel = (s) => (STATUSES.find((x) => x[0] === s) || STATUSES[0]);
function appTable(list) {
  return `<div class="table-wrap"><table class="tbl"><thead><tr><th>التاريخ</th><th>الاسم</th><th>الهاتف</th><th>الجنسية</th><th>المرحلة</th><th>الجامعة / الخدمة</th><th>الحالة</th></tr></thead><tbody>
  ${list.map((a) => { const [, l, c] = stLabel(a.status); return `<tr data-id="${esc(a.id)}" class="clickable">
    <td>${esc(new Date(a.created_at).toLocaleDateString("en-GB"))}</td><td><b>${esc(a.name)}</b></td><td dir="ltr">${esc(a.phone)}</td><td>${esc(a.nationality)}</td>
    <td>${esc(DEGREES[a.degree] || a.degree || "")}</td><td>${esc(a.university || a.service || "—")}</td><td><span class="pill" style="--c:${c}">${l}</span></td></tr>`; }).join("")}
  </tbody></table></div>`;
}
function bindAppRows(view, apps) {
  view.querySelectorAll("tr[data-id]").forEach((tr) => tr.addEventListener("click", () => openApp(apps.find((a) => a.id === tr.dataset.id))));
}
async function viewApplications(view) {
  const apps = await Store.listApplications();
  view.innerHTML = `<div class="toolbar"><input type="search" id="aq" placeholder="ابحث بالاسم أو الهاتف…">
    <select id="ast"><option value="">كل الحالات</option>${STATUSES.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select>
    <button class="btn" id="csv">تنزيل Excel (CSV)</button></div><div id="alist" class="card"></div>`;
  const draw = () => {
    const q = $("#aq").value.trim().toLowerCase(), st = $("#ast").value;
    const list = apps.filter((a) => (!st || a.status === st) && (!q || [a.name, a.phone, a.email, a.nationality].join(" ").toLowerCase().includes(q)));
    $("#alist").innerHTML = list.length ? appTable(list) : '<p class="muted">لا توجد طلبات.</p>';
    bindAppRows($("#alist"), apps);
  };
  $("#aq").oninput = draw; $("#ast").onchange = draw; draw();
  $("#csv").onclick = () => {
    const cols = ["created_at", "status", "name", "phone", "email", "nationality", "country", "degree", "major", "gpa", "unitype", "university", "service", "message", "notes"];
    const csv = "﻿" + [cols.join(","), ...apps.map((a) => cols.map((c) => csvCell(a[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: `kam-applications-${new Date().toISOString().slice(0, 10)}.csv` });
    link.click(); URL.revokeObjectURL(url);
  };
}
// Quote a CSV cell. A leading = + - @ is neutralised so Excel never runs a student's text as a formula.
function csvCell(v) {
  let x = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(x)) x = "'" + x;
  return `"${x.replace(/"/g, '""')}"`;
}
function openApp(a) {
  if (!a) return;
  const rows = [["الاسم", a.name], ["الهاتف", `<a href="tel:${esc(a.phone)}" dir="ltr">${esc(a.phone)}</a> · <a href="https://wa.me/${esc(String(a.phone).replace(/\D/g, ""))}" target="_blank">واتساب ↗</a>`, true],
    ["البريد", a.email], ["الجنسية", a.nationality], ["بلد الإقامة", a.country], ["المرحلة", DEGREES[a.degree] || a.degree], ["التخصص", a.major], ["المعدل", a.gpa],
    ["نوع الجامعة", { gov: "حكومية", private: "خاصة", any: "لا فرق" }[a.unitype] || a.unitype], ["الجامعة المفضلة", a.university], ["الخدمة", a.service], ["لغة الموقع", a.lang],
    ["ملاحظات الطالب", a.message], ["تاريخ الإرسال", new Date(a.created_at).toLocaleString("en-GB")], ["موافقة KVKK", a.consent ? "نعم ✓" : "لا"]];
  const m = modal(`<h2>طلب: ${esc(a.name)}</h2>
    <dl class="dl">${rows.filter((r) => r[1]).map(([k, v, raw]) => `<dt>${k}</dt><dd>${raw ? v : esc(v).replace(/\n/g, "<br>")}</dd>`).join("")}</dl>
    <label class="fld">الحالة<select id="m-status">${STATUSES.map(([k, l]) => `<option value="${k}" ${a.status === k ? "selected" : ""}>${l}</option>`).join("")}</select></label>
    <label class="fld">ملاحظات داخلية (لا يراها الطالب)<textarea id="m-notes" rows="3">${esc(a.notes || "")}</textarea></label>
    <div class="actions"><button class="btn btn-primary" id="m-save">حفظ</button><button class="btn btn-danger" id="m-del">حذف الطلب</button></div>`);
  $("#m-save", m).onclick = async () => {
    try { await Store.updateApplication(a.id, { status: $("#m-status", m).value, notes: $("#m-notes", m).value }); toast("تم الحفظ"); closeModal(); render(); }
    catch (e) { toast(errMsg(e), true); }
  };
  $("#m-del", m).onclick = async () => {
    if (!confirm("حذف هذا الطلب نهائياً؟")) return;
    try { await Store.deleteApplication(a.id); toast("تم الحذف"); closeModal(); render(); } catch (e) { toast(errMsg(e), true); }
  };
}

// ---------------- modal ----------------
function modal(html) {
  closeModal();
  const m = document.createElement("div");
  m.className = "modal-bg";
  m.innerHTML = `<div class="modal card"><button class="x" aria-label="إغلاق">×</button>${html}</div>`;
  document.body.appendChild(m);
  m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
  $(".x", m).onclick = closeModal;
  return m;
}
function closeModal() { document.querySelector(".modal-bg")?.remove(); }

// ---------------- generic form fields ----------------
function fieldHtml(f, val) {
  const help = f.help ? `<small class="help">${esc(f.help).replace(/\n/g, "<br>")}</small>` : "";
  const req = f.required ? ' <span class="req">*</span>' : "";
  const dir = f.dir ? ` dir="${f.dir}"` : "";
  switch (f.type) {
    case "i18n": case "i18n-long": {
      const v = val && typeof val === "object" ? val : { ar: val || "" };
      return `<fieldset class="fld i18n" data-name="${f.name}" data-type="${f.type}"><legend>${f.label}${req}</legend>
        ${LANGS.map(([l, ln]) => `<label><span class="lng">${ln}</span>${f.type === "i18n" ? `<input data-lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}" value="${esc(v[l] || "")}">` : `<textarea data-lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}" rows="${f.rows || 4}">${esc(v[l] || "")}</textarea>`}</label>`).join("")}
        ${l10nNote(f)}${help}</fieldset>`;
    }
    case "long": return `<label class="fld">${f.label}${req}<textarea name="${f.name}" rows="${f.rows || 4}"${dir}>${esc(val || "")}</textarea>${help}</label>`;
    case "number": return `<label class="fld">${f.label}${req}<input name="${f.name}" type="number" min="0" step="any" dir="ltr" value="${esc(val ?? "")}">${help}</label>`;
    case "date": return `<label class="fld">${f.label}${req}<input name="${f.name}" type="date" dir="ltr" value="${esc(val || "")}">${help}</label>`;
    case "url": return `<label class="fld">${f.label}${req}<input name="${f.name}" type="url" dir="ltr" placeholder="https://" value="${esc(val || "")}">${help}</label>`;
    case "bool": return `<label class="fld check"><input name="${f.name}" type="checkbox" ${val ? "checked" : ""}> ${f.label}</label>`;
    case "uniref": return `<label class="fld">${f.label}${req}<select name="${f.name}"><option value="">— بدون —</option>${(f.unis || []).map((u) => `<option value="${esc(u.id)}" ${String(val ?? "") === u.id ? "selected" : ""}>${esc(P(u.name))}</option>`).join("")}</select>${help}</label>`;
    case "select": return `<label class="fld">${f.label}${req}<select name="${f.name}">${f.options.map(([k, l]) => `<option value="${esc(k)}" ${String(val ?? "") === k ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>${help}</label>`;
    case "image": return `<div class="fld img-fld" data-name="${f.name}"><span>${f.label}</span>
        <div class="img-row"><div class="img-prev">${val ? `<img src="${esc(val)}">` : "<em>لا توجد صورة</em>"}</div>
        <div><input type="file" accept="image/*"><button type="button" class="btn btn-small rm-img" ${val ? "" : "hidden"}>إزالة الصورة</button></div></div>
        <input type="hidden" name="${f.name}" value="${esc(val || "")}">${help}</div>`;
    case "stats": {
      const arr = Array.isArray(val) ? val : [];
      return `<div class="fld stats-fld" data-name="${f.name}"><div class="stats-rows">${arr.map(statRow).join("")}</div><button type="button" class="btn btn-small add-stat">+ إضافة رقم</button></div>`;
    }
    default: return `<label class="fld">${f.label}${req}<input name="${f.name}" value="${esc(val ?? "")}"${dir}>${help}</label>`;
  }
}
const l10nNote = () => "";
const statRow = (s = {}) => `<div class="stat-row"><input class="s-val" placeholder="+100" dir="ltr" value="${esc(s.value || "")}">
  ${LANGS.map(([l, ln]) => `<input class="s-lbl" data-lang="${l}" placeholder="${ln}" dir="${l === "ar" ? "rtl" : "ltr"}" value="${esc(s.label?.[l] || "")}">`).join("")}<button type="button" class="btn btn-small rm-stat">×</button></div>`;

function bindFields(form) {
  form.querySelectorAll(".img-fld").forEach((box) => {
    const file = $("input[type=file]", box), hidden = $("input[type=hidden]", box), prev = $(".img-prev", box), rm = $(".rm-img", box);
    file.onchange = async () => {
      if (!file.files[0]) return;
      prev.innerHTML = "<em>جارٍ الرفع…</em>";
      try {
        const url = await Store.uploadImage(file.files[0]);
        hidden.value = url; prev.innerHTML = `<img src="${esc(url)}">`; rm.hidden = false;
      } catch (e) { prev.innerHTML = "<em>فشل الرفع</em>"; toast(errMsg(e), true); }
    };
    rm.onclick = () => { hidden.value = ""; prev.innerHTML = "<em>لا توجد صورة</em>"; rm.hidden = true; file.value = ""; };
  });
  form.querySelectorAll(".stats-fld").forEach((box) => {
    $(".add-stat", box).onclick = () => $(".stats-rows", box).insertAdjacentHTML("beforeend", statRow());
    box.addEventListener("click", (e) => { if (e.target.classList.contains("rm-stat")) e.target.closest(".stat-row").remove(); });
  });
}
function readFields(form, fields) {
  const out = {};
  for (const f of fields) {
    if (!f.name) continue;
    if (f.type === "i18n" || f.type === "i18n-long") {
      const fs = form.querySelector(`fieldset[data-name="${f.name}"]`);
      out[f.name] = Object.fromEntries(LANGS.map(([l]) => [l, $(`[data-lang="${l}"]`, fs).value.trim()]));
    } else if (f.type === "bool") out[f.name] = form.elements[f.name].checked;
    else if (f.type === "stats") {
      out[f.name] = [...form.querySelectorAll(".stat-row")].map((r) => ({ value: $(".s-val", r).value.trim(), label: Object.fromEntries([...r.querySelectorAll(".s-lbl")].map((i) => [i.dataset.lang, i.value.trim()])) })).filter((s) => s.value);
    } else out[f.name] = (form.elements[f.name]?.value ?? "").trim();
  }
  return out;
}
function missingRequired(data, fields) {
  return fields.filter((f) => f.required && (typeof data[f.name] === "object" ? !Object.values(data[f.name]).some(Boolean) : !data[f.name])).map((f) => f.label);
}

// ---------------- collections ----------------
async function viewCollection(view, key) {
  const sc = SCHEMAS[key];
  const items = await Store.list(key, { all: true });
  view.innerHTML = `<div class="toolbar"><button class="btn btn-primary" id="add">+ إضافة ${sc.single}</button><input type="search" id="cq" placeholder="ابحث…"></div>
    <div class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th class="w-ord">الترتيب</th>${sc.headers.map((h) => `<th>${h}</th>`).join("")}<th>ظاهر؟</th><th></th></tr></thead>
    <tbody id="crows"></tbody></table></div></div>
    ${key === "universities" ? '<p class="muted">نصيحة: الأسعار تظهر تلقائياً في صفحة "أسعار الجامعات الخاصة" في الموقع.</p>' : ""}`;
  const draw = () => {
    const q = $("#cq").value.trim().toLowerCase();
    const list = items.filter((x) => !q || JSON.stringify(x).toLowerCase().includes(q));
    $("#crows").innerHTML = list.map((x) => `<tr data-id="${esc(x.id)}">
      <td class="w-ord"><button class="ord" data-dir="-1" title="لأعلى">▲</button><button class="ord" data-dir="1" title="لأسفل">▼</button></td>
      ${sc.columns(x, P).map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : esc(c)}</td>`).join("")}
      <td><label class="switch"><input type="checkbox" class="pub" ${x.published !== false ? "checked" : ""}><span></span><em></em></label></td>
      <td class="row-act"><button class="btn btn-small edit">تعديل</button><button class="btn btn-small btn-danger del">حذف</button></td></tr>`).join("") || `<tr><td colspan="9" class="muted">لا يوجد شيء بعد.</td></tr>`;
  };
  $("#cq").oninput = draw; draw();
  $("#add").onclick = () => editItem(key, null);
  $("#crows").addEventListener("click", async (e) => {
    const tr = e.target.closest("tr[data-id]"); if (!tr) return;
    const it = items.find((x) => x.id === tr.dataset.id);
    try {
      if (e.target.classList.contains("edit")) return editItem(key, it);
      if (e.target.classList.contains("del")) {
        if (!confirm(`حذف "${P(sc.columns(it, P)[0]) || ""}" نهائياً؟`)) return;
        await Store.remove(key, it.id); toast("تم الحذف"); return render();
      }
      if (e.target.classList.contains("ord")) {
        const i = items.indexOf(it), j = i + Number(e.target.dataset.dir);
        if (j < 0 || j >= items.length) return;
        [items[i], items[j]] = [items[j], items[i]];
        items.forEach((x, k) => (x.sort = k + 1));
        await Promise.all([items[i], items[j]].map((x) => Store.save(key, x)));
        draw();
      }
    } catch (ex) { toast(errMsg(ex), true); }
  });
  $("#crows").addEventListener("change", async (e) => {
    if (!e.target.classList.contains("pub")) return;
    const it = items.find((x) => x.id === e.target.closest("tr").dataset.id);
    it.published = e.target.checked;
    try { await Store.save(key, it); toast(it.published ? "أصبح ظاهراً في الموقع" : "تم إخفاؤه من الموقع"); } catch (ex) { toast(errMsg(ex), true); }
  });
}

async function editItem(key, item) {
  const sc0 = SCHEMAS[key];
  let unis = [];
  if (sc0.fields.some((f) => f.type === "uniref")) unis = await Store.list("universities", { all: true });
  const sc = { ...sc0, fields: sc0.fields.map((f) => (f.type === "uniref" ? { ...f, unis } : f)) };
  const isNew = !item;
  item = item || { published: true };
  const m = modal(`<h2>${isNew ? "إضافة" : "تعديل"} ${sc.single}</h2>
    <p class="muted small">اكتب النص بالعربي على الأقل. إذا تركت الإنكليزي أو التركي فارغاً يظهر النص العربي مكانه.</p>
    <form id="ed" class="ed-form">${sc.fields.map((f) => fieldHtml(f, item[f.name])).join("")}
    <label class="fld check"><input name="published" type="checkbox" ${item.published !== false ? "checked" : ""}> ظاهر في الموقع</label>
    ${key === "universities" ? '<div id="fees-prev"></div>' : ""}
    <div class="actions sticky"><button class="btn btn-primary">حفظ</button><button type="button" class="btn" id="cancel">إلغاء</button></div></form>`);
  const form = $("#ed", m);
  bindFields(form);
  $("#cancel", m).onclick = closeModal;
  if (form.elements.universityId) {
    form.elements.universityId.addEventListener("change", () => {
      const u = unis.find((x) => x.id === form.elements.universityId.value);
      if (!u) return;
      for (const [fname, src] of [["university", u.name], ["city", u.city]]) {
        const fs = form.querySelector(`fieldset[data-name="${fname}"]`);
        if (fs && src) fs.querySelectorAll("[data-lang]").forEach((i) => { i.value = src[i.dataset.lang] || ""; });
      }
    });
  }
  if (key === "universities") {
    const ta = form.elements.fees, pv = $("#fees-prev", m);
    const upd = () => {
      const rows = parseFees(ta.value);
      pv.innerHTML = rows.length ? `<p class="muted small">معاينة الجدول:</p><table class="tbl mini"><tr><th>عربي</th><th>English</th><th>Türkçe</th><th>السعر</th></tr>${rows.map((r) => `<tr><td>${esc(r.name.ar)}</td><td>${esc(r.name.en)}</td><td>${esc(r.name.tr)}</td><td dir="ltr">${esc(r.price)}</td></tr>`).join("")}</table>` : "";
    };
    ta.addEventListener("input", upd); upd();
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = readFields(form, sc.fields);
    const miss = missingRequired(data, sc.fields);
    if (miss.length) return toast("حقول مطلوبة: " + miss.join("، "), true);
    const all = await Store.list(key, { all: true });
    const rec = { ...item, ...data, published: form.elements.published.checked };
    if (isNew) rec.sort = (Math.max(0, ...all.map((x) => x.sort || 0)) + 1);
    const btn = $("button.btn-primary", form);
    btn.disabled = true;
    try { await Store.save(key, rec); toast("تم الحفظ ✓"); closeModal(); render(); }
    catch (ex) { toast(errMsg(ex), true); btn.disabled = false; }
  });
}

// ---------------- settings ----------------
async function viewSettings(view) {
  const s = await Store.getSettings();
  const fields = SETTINGS_FIELDS.filter((f) => f.name);
  view.innerHTML = `<form id="sf" class="card ed-form">${SETTINGS_FIELDS.map((f) => (f.group ? `<h2 class="grp">${f.group}</h2>` : fieldHtml(f, s[f.name]))).join("")}
    <div class="actions sticky"><button class="btn btn-primary">حفظ الإعدادات</button></div></form>
    ${Store.IS_DEMO ? "" : `<form id="pw" class="card ed-form"><h2 class="grp">تغيير كلمة السر</h2><label class="fld">كلمة السر الجديدة<input type="password" name="p1" minlength="8" dir="ltr" required></label><label class="fld">أعد كتابتها<input type="password" name="p2" minlength="8" dir="ltr" required></label><div class="actions"><button class="btn btn-primary">تغيير</button></div></form>`}`;
  const form = $("#sf");
  bindFields(form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = { ...s, ...readFields(form, fields) };
    data.whatsapp = String(data.whatsapp || "").replace(/\D/g, "");
    try { await Store.saveSettings(data); toast("تم حفظ الإعدادات ✓"); } catch (ex) { toast(errMsg(ex), true); }
  });
  $("#pw")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.p1.value !== f.p2.value) return toast("كلمتا السر غير متطابقتين", true);
    try { await Store.changePassword(f.p1.value); toast("تم تغيير كلمة السر"); f.reset(); } catch (ex) { toast(errMsg(ex), true); }
  });
}

// ---------------- help ----------------
function viewHelp(view) {
  view.innerHTML = `<div class="card prose-a">
  <h2>كيف أعدّل الموقع؟</h2>
  <ol>
    <li><b>الأسعار:</b> من "الجامعات" اضغط "تعديل" على الجامعة، وغيّر "السعر يبدأ من" و"جدول أسعار التخصصات". أسعار خدمات المكتب من "الخدمات والأسعار".</li>
    <li><b>إضافة جامعة:</b> "الجامعات" ← "+ إضافة جامعة"، اختر حكومية أو خاصة، واكتب الاسم بالعربي (والإنكليزي والتركي إن أمكن)، وارفع صورة.</li>
    <li><b>إخفاء شيء مؤقتاً:</b> أطفئ زر "ظاهر؟" بجانبه بدل حذفه.</li>
    <li><b>الترتيب:</b> استخدم الأسهم ▲▼ لتغيير ترتيب الظهور في الموقع.</li>
    <li><b>خبر في الشريط المتحرك:</b> أضف مقالاً تصنيفه "خبر".</li>
    <li><b>طلبات الطلاب:</b> تظهر في "طلبات الطلاب". اضغط على الطلب لترى التفاصيل وتغيّر حالته وتكتب ملاحظاتك، أو راسل الطالب على واتساب مباشرة. يمكنك تنزيل كل الطلبات كملف Excel.</li>
    <li><b>أرقام الهاتف والواتساب والنصوص العامة:</b> من "إعدادات الموقع".</li>
  </ol>
  <p class="muted">كل تعديل يظهر في الموقع فوراً بعد الضغط على "حفظ" (حدّث صفحة الموقع لتراه).</p></div>`;
}

start();
