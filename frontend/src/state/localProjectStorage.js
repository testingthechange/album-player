// src/state/localProjectStorage.js

// Simple localStorage-based beta storage for project returns.
// Later we can swap these internals for real backend calls.

const META_KEY_PREFIX = "project_meta_return:";
const SONGS_KEY_PREFIX = "project_songs_return:";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// ---------- META RETURNS ---------------------------------------------

export function saveMetaReturn(projectId, metaData) {
  if (!projectId || typeof window === "undefined") return;
  const key = META_KEY_PREFIX + projectId;
  const payload = { ...metaData };
  window.localStorage.setItem(key, JSON.stringify(payload));
}

export function loadMetaReturn(projectId) {
  if (!projectId || typeof window === "undefined") return null;
  const key = META_KEY_PREFIX + projectId;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  return safeParse(raw);
}

export function hasMetaReturn(projectId) {
  if (!projectId || typeof window === "undefined") return false;
  const key = META_KEY_PREFIX + projectId;
  return !!window.localStorage.getItem(key);
}

// ---------- SONGS RETURNS (EXTENDED) ----------------------------------

export function saveSongsReturn(projectId, payload) {
  if (!projectId || typeof window === "undefined") return;
  const key = SONGS_KEY_PREFIX + projectId;
  const wrapped = { ...payload };
  window.localStorage.setItem(key, JSON.stringify(wrapped));
}

export function loadSongsReturn(projectId) {
  if (!projectId || typeof window === "undefined") return null;
  const key = SONGS_KEY_PREFIX + projectId;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  return safeParse(raw);
}

export function hasSongsReturn(projectId) {
  if (!projectId || typeof window === "undefined") return false;
  const key = SONGS_KEY_PREFIX + projectId;
  return !!window.localStorage.getItem(key);
}
