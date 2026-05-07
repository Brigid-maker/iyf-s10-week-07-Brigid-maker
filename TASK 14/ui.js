// ui.js — All DOM manipulation lives here.
// This module only reads state; it never changes it directly.

import { escapeHtml, timeAgo } from './utils.js';

// ── Cached DOM references (query once, reuse everywhere) ──────────
const todoListEl   = document.getElementById('todoList');
const statsEl      = document.getElementById('stats');
const progressEl   = document.getElementById('progressFill');
const emptyStateEl = document.getElementById('emptyState');

// ── Public render functions ───────────────────────────────────────

/**
 * Re-renders the entire todo list based on current filtered todos.
 */
export function renderTodos(filteredTodos, allTodos) {
  updateStats(allTodos);
  updateProgress(allTodos);

  if (!filteredTodos.length) {
    todoListEl.innerHTML   = '';
    emptyStateEl.hidden    = false;
    return;
  }

  emptyStateEl.hidden  = true;
  todoListEl.innerHTML = filteredTodos.map(buildTodoHTML).join('');
}

/**
 * Updates the filter tab UI to highlight the active filter.
 */
export function renderFilters(activeFilter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

/**
 * Flashes a toast notification at the bottom of the screen.
 */
export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

// ── Private helpers ───────────────────────────────────────────────

function buildTodoHTML(todo) {
  const priorityColour = { high: '#ef4444', normal: '#6366f1', low: '#22c55e' };
  const colour = priorityColour[todo.priority] || priorityColour.normal;

  return `
    <li class="todo-item ${todo.completed ? 'done' : ''}"
        data-id="${todo.id}"
        style="--priority-colour: ${colour}">

      <button class="check-btn" onclick="window.app.toggle(${todo.id})"
              aria-label="${todo.completed ? 'Mark incomplete' : 'Mark complete'}">
        ${todo.completed ? '✓' : ''}
      </button>

      <span class="todo-text">${escapeHtml(todo.text)}</span>

      <span class="todo-meta">${timeAgo(todo.createdAt)}</span>

      <select class="priority-select"
              onchange="window.app.setPriority(${todo.id}, this.value)"
              title="Set priority">
        <option value="low"    ${todo.priority === 'low'    ? 'selected' : ''}>↓ Low</option>
        <option value="normal" ${todo.priority === 'normal' ? 'selected' : ''}>· Normal</option>
        <option value="high"   ${todo.priority === 'high'   ? 'selected' : ''}>↑ High</option>
      </select>

      <button class="del-btn" onclick="window.app.remove(${todo.id})"
              aria-label="Delete todo">×</button>
    </li>
  `;
}

function updateStats(todos) {
  const total = todos.length;
  const done  = todos.filter(t => t.completed).length;
  const left  = total - done;

  statsEl.innerHTML = `
    <span>${total} total</span>
    <span>${done} done</span>
    <span>${left} remaining</span>
  `;
}

function updateProgress(todos) {
  const pct = todos.length
    ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
    : 0;
  progressEl.style.width = pct + '%';
  progressEl.title       = `${pct}% complete`;
}