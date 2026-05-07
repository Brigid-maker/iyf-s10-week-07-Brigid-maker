// storage.js — All localStorage interactions live here.
// A prefix keeps our keys from clashing with other apps.

const STORAGE_PREFIX = 'todo14_';

/**
 * Saves any serialisable value to localStorage.
 */
export function save(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

/**
 * Loads a value from localStorage.
 * Returns `defaultValue` if the key doesn't exist.
 */
export function load(key, defaultValue = null) {
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  return raw !== null ? JSON.parse(raw) : defaultValue;
}

/**
 * Removes a single key from localStorage.
 */
export function remove(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Clears ALL keys that belong to this app (prefixed keys only).
 */
export function clearAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}