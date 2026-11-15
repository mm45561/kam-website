// Data layer. Works in two modes:
//  - Supabase mode (when config.js has a URL + key): real database, shared by everyone.
//  - Demo mode: everything is saved in this browser's localStorage, seeded with sample data.
import { CONFIG } from "./config.js?v=202611151955";
import { SEED } from "./seed.js?v=202611151955";

export const IS_DEMO = !(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
const DEMO_KEY = "kam_demo_db_v4";
const DEMO_PASSWORD = "kam-demo";

let sb = null;
async function client() {
  if (IS_DEMO) return null;
  if (!sb) {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm");
    sb = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }
  return sb;
}

// ---------- demo storage ----------
function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) || "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
function loadDemo() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  const db = JSON.parse(JSON.stringify(SEED));
  saveDemo(db);
  return db;
}
function saveDemo(db) {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(db)); }
  catch (e) { alert("Storage is full: use smaller images in demo mode."); throw e; }
}
export function resetDemo() {
  try { localStorage.removeItem(DEMO_KEY); } catch (e) { /* ignore */ }
}

const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0) || String(a.created_at || "").localeCompare(String(b.created_at || ""));

// ---------- content collections ----------
// Each row: { id, collection, data (object), sort, published }
// The API returns flat objects: { id, sort, published, ...data }
function flatten(row) {
  return { ...(row.data || {}), id: row.id, sort: row.sort ?? 0, published: row.published !== false, created_at: row.created_at, updated_at: row.updated_at };
}
function unflatten(collection, item) {
  const { id, sort, published, created_at, updated_at, ...data } = item;
  return { id, collection, data, sort: Number(sort) || 0, published: published !== false };
}

export async function list(collection, { all = false } = {}) {
  if (IS_DEMO) {
    const db = loadDemo();
    return (db.content[collection] || []).filter((x) => all || x.published !== false).sort(bySort);
  }
  const c = await client();
  let q = c.from("content").select("*").eq("collection", collection).order("sort", { ascending: true }).order("created_at", { ascending: true });
  if (!all) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(flatten);
}

export async function get(collection, id) {
  if (IS_DEMO) return (loadDemo().content[collection] || []).find((x) => x.id === id) || null;
  const c = await client();
  const { data, error } = await c.from("content").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? flatten(data) : null;
}

export async function save(collection, item) {
  if (IS_DEMO) {
    const db = loadDemo();
    const arr = (db.content[collection] = db.content[collection] || []);
    if (!item.id) {
      item = { ...item, id: uid(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      arr.push(item);
    } else {
      const i = arr.findIndex((x) => x.id === item.id);
      item = { ...item, updated_at: new Date().toISOString() };
      if (i >= 0) arr[i] = { ...arr[i], ...item }; else arr.push(item);
    }
    saveDemo(db);
    return item;
  }
  const c = await client();
  const row = unflatten(collection, item);
  if (!row.id) delete row.id;
  row.updated_at = new Date().toISOString();
  const { data, error } = await c.from("content").upsert(row).select().single();
  if (error) throw error;
  return flatten(data);
}

export async function remove(collection, id) {
  if (IS_DEMO) {
    const db = loadDemo();
    db.content[collection] = (db.content[collection] || []).filter((x) => x.id !== id);
    saveDemo(db);
    return;
  }
  const c = await client();
  const { error } = await c.from("content").delete().eq("id", id);
  if (error) throw error;
}

// ---------- settings (one object) ----------
export async function getSettings() {
  if (IS_DEMO) return loadDemo().settings;
  const c = await client();
  const { data, error } = await c.from("settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw error;
  return { ...SEED.settings, ...(data?.data || {}) };
}
export async function saveSettings(settings) {
  if (IS_DEMO) {
    const db = loadDemo();
    db.settings = settings;
    saveDemo(db);
    return settings;
  }
  const c = await client();
  const { error } = await c.from("settings").upsert({ id: 1, data: settings, updated_at: new Date().toISOString() });
  if (error) throw error;
  return settings;
}

// ---------- applications ----------
export async function submitApplication(app) {
  const rec = { ...app, status: "new" };
  if (IS_DEMO) {
    const db = loadDemo();
    db.applications.unshift({ ...rec, id: uid(), created_at: new Date().toISOString() });
    saveDemo(db);
    return;
  }
  const c = await client();
  // Insert only: the public is not allowed to read applications back.
  const { error } = await c.from("applications").insert({ data: app, status: "new" });
  if (error) throw error;
}
export async function listApplications() {
  if (IS_DEMO) return loadDemo().applications;
  const c = await client();
  const { data, error } = await c.from("applications").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({ ...(r.data || {}), id: r.id, status: r.status, notes: r.notes || "", created_at: r.created_at }));
}
export async function updateApplication(id, patch) {
  if (IS_DEMO) {
    const db = loadDemo();
    const a = db.applications.find((x) => x.id === id);
    if (a) Object.assign(a, patch);
    saveDemo(db);
    return;
  }
  const c = await client();
  const upd = {};
  if ("status" in patch) upd.status = patch.status;
  if ("notes" in patch) upd.notes = patch.notes;
  const { error } = await c.from("applications").update(upd).eq("id", id);
  if (error) throw error;
}
export async function deleteApplication(id) {
  if (IS_DEMO) {
    const db = loadDemo();
    db.applications = db.applications.filter((x) => x.id !== id);
    saveDemo(db);
    return;
  }
  const c = await client();
  const { error } = await c.from("applications").delete().eq("id", id);
  if (error) throw error;
}

// ---------- images ----------
function resizeToDataUrl(file, max = 1000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.width * s);
      cv.height = Math.round(img.height * s);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}
export async function uploadImage(file) {
  if (IS_DEMO) return resizeToDataUrl(file, 900);
  const c = await client();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `uploads/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const { error } = await c.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return c.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// ---------- admin auth ----------
const DEMO_SESSION = "kam_demo_admin";
export async function signIn(email, password) {
  if (IS_DEMO) {
    if (password !== DEMO_PASSWORD) throw new Error("wrong-password");
    sessionStorage.setItem(DEMO_SESSION, "1");
    return { email: email || "demo" };
  }
  const c = await client();
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}
export async function signOut() {
  if (IS_DEMO) { sessionStorage.removeItem(DEMO_SESSION); return; }
  const c = await client();
  await c.auth.signOut();
}
export async function currentUser() {
  if (IS_DEMO) return sessionStorage.getItem(DEMO_SESSION) ? { email: "demo" } : null;
  const c = await client();
  const { data } = await c.auth.getSession();
  return data.session?.user || null;
}
export async function changePassword(newPassword) {
  if (IS_DEMO) throw new Error("demo");
  const c = await client();
  const { error } = await c.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
export const DEMO_HINT = DEMO_PASSWORD;
