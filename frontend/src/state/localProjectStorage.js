// src/state/localProjectStorage.js

const STORAGE_KEY = "devProjectsStateV1";

export function saveProjectsDraft(projectState) {
  try {
    const serialized = JSON.stringify(projectState);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Failed to save projects draft:", err);
  }
}

export function loadProjectsDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load projects draft:", err);
    return null;
  }
}

export function clearProjectsDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear projects draft:", err);
  }
}
