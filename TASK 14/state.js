// state.js — Single source of truth for all app data.
// No UI logic here — state only knows about data.

import { save, load } from './storage.js';

const TODOS_KEY  = 'todos';
const FILTER_KEY = 'filter';

// The centralized state object
const state = {
  todos:  load(TODOS_KEY,  []),
  filter: load(FILTER_KEY, 'all'),
};

// Registered UI listeners — notified on every state change
const listeners = [];

/**
 * Subscribe to state changes.
 * Returns an unsubscribe function.
 */
export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Notify all subscribers with the current state. */
function notify() {
  listeners.forEach(fn => fn({ ...state }));
}

/** Persist state and notify subscribers. */
function commit() {
  save(TODOS_KEY,  state.todos);
  save(FILTER_KEY, state.filter);
  notify();
}

// ── Selectors (read-only) ─────────────────────────────────────────

export function getAllTodos()       { return [...state.todos]; }
export function getFilter()        { return state.filter; }
export function getDoneTodos()     { return state.todos.filter(t => t.completed); }
export function getActiveTodos()   { return state.todos.filter(t => !t.completed); }

export function getFilteredTodos() {
  if (state.filter === 'active')    return getActiveTodos();
  if (state.filter === 'completed') return getDoneTodos();
  return getAllTodos();
}

// ── Actions (write) ───────────────────────────────────────────────

export function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  state.todos.push({
    id:          Date.now(),
    text:        trimmed,
    completed:   false,
    createdAt:   new Date().toISOString(),
    priority:    'normal',
  });

  commit();
}

export function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    commit();
  }
}

export function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  commit();
}

export function editTodo(id, newText) {
  const todo = state.todos.find(t => t.id === id);
  if (todo && newText.trim()) {
    todo.text = newText.trim();
    commit();
  }
}

export function setPriority(id, priority) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.priority = priority;
    commit();
  }
}

export function clearCompleted() {
  state.todos = state.todos.filter(t => !t.completed);
  commit();
}

export function setFilter(filter) {
  state.filter = filter;
  commit();
}