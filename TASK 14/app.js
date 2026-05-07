// app.js — Entry point. Wires state → UI and sets up event handlers.
// This is the only file allowed to import from all other modules.

import {
  subscribe, addTodo, toggleTodo, deleteTodo,
  setPriority, clearCompleted, setFilter,
  getFilteredTodos, getAllTodos, getFilter,
} from './state.js';

import { renderTodos, renderFilters, showToast } from './ui.js';
import { debounce } from './utils.js';

// ── Expose actions globally so inline onclick handlers can reach them ──
window.app = {
  toggle:      (id)           => { toggleTodo(id); },
  remove:      (id)           => { deleteTodo(id); showToast('Task deleted'); },
  setPriority: (id, priority) => { setPriority(id, priority); },
};

// ── Subscribe: re-render whenever state changes ───────────────────
subscribe(state => {
  renderTodos(getFilteredTodos(), getAllTodos());
  renderFilters(getFilter());
});

// ── Input handling ────────────────────────────────────────────────
const input = document.getElementById('todoInput');

function handleAdd() {
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = '';
  showToast('Task added ✓');
}

document.getElementById('addBtn').addEventListener('click', handleAdd);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAdd();
});

// Debounced character counter
const charCount = document.getElementById('charCount');
input.addEventListener('input', debounce(() => {
  charCount.textContent = input.value.length > 0 ? `${input.value.length}/120` : '';
}, 100));

// ── Filter buttons ────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// ── Clear completed ───────────────────────────────────────────────
document.getElementById('clearDoneBtn').addEventListener('click', () => {
  clearCompleted();
  showToast('Completed tasks cleared');
});

// ── Initial render ────────────────────────────────────────────────
renderTodos(getFilteredTodos(), getAllTodos());
renderFilters(getFilter());