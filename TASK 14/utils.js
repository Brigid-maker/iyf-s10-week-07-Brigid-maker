// utils.js — Pure utility functions (no side effects)

/**
 * Formats an ISO date string into a human-readable relative time.
 * e.g. "just now", "5m ago", "2h ago"
 */
export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/**
 * Generates a unique ID using timestamp + random suffix.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Debounces a function — delays execution until after `wait` ms of inactivity.
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}