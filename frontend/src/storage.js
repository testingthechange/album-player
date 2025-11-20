// src/storage.js

const META_KEY_PREFIX = "project_meta_return:";

export function saveMetaReturn(projectId, metaData) {
  try {
    const key = META_KEY_PREFIX + projectId;
    const value = JSON.stringify(metaData);
    window.localStorage.setItem(key, value);
    console.log("Saved Meta return to localStorage:", key, metaData);
  } catch (err) {
    console.error("Failed to save Meta return", err);
  }
}

export function loadMetaReturn(projectId) {
  try {
    const key = META_KEY_PREFIX + projectId;
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Failed to load Meta return", err);
    return null;
  }
}
