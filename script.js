const MAX_TASK_LENGTH = 200;
const STORAGE_KEY = 'todo-app-tasks'; // saved as a JSON array of { id, text, completed }

let tasks = loadTasks();
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const message = document.getElementById('message');
const list = document.getElementById('task-list');
const emptyHint = document.getElementById('empty-hint');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filters button');

function isValidSavedTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.text === 'string' &&
    typeof task.completed === 'boolean'
  );
}

// Missing, blocked, corrupt or wrongly shaped data all load as an empty list
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return [];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isValidSavedTask) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showMessage('Your tasks could not be saved, so they may be lost when you close this page.');
  }
}

function showMessage(text) {
  message.textContent = text;
}

function clearMessage() {
  message.textContent = '';
}

// Returns { text } when valid, or { error } with a friendly message
function validateTask(raw) {
  const text = raw.trim();
  if (text === '') {
    return { error: 'Please type a task before adding it.' };
  }
  if (text.length > MAX_TASK_LENGTH) {
    return { error: `Tasks can be up to ${MAX_TASK_LENGTH} characters. Yours is ${text.length}.` };
  }
  return { text };
}

function createId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now() + '-' + Math.random().toString(16).slice(2);
}

function addTask(text) {
  tasks.push({ id: createId(), text, completed: false });
  saveTasks();
  render();
}

// render() rebuilds the list, so put keyboard focus back where the user was.
// Compares ids directly instead of using a selector, since saved ids are arbitrary strings.
function focusTaskCheckbox(id) {
  for (const item of list.children) {
    if (item.dataset.id === id) {
      item.querySelector('input').focus();
      return;
    }
  }
  input.focus(); // the task left the current view (e.g. checked while on Active)
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }
  saveTasks();
  render();
  focusTaskCheckbox(id);
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
  input.focus();
}

function createTaskItem(task) {
  const item = document.createElement('li');
  item.className = 'task-item';
  item.dataset.id = task.id;

  const label = document.createElement('label');
  label.className = 'task-label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text; // textContent keeps <b>hi</b> as literal characters
  if (task.completed) {
    text.classList.add('completed');
  }

  label.append(checkbox, text);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
  deleteButton.addEventListener('click', () => deleteTask(task.id));

  item.append(label, deleteButton);
  return item;
}

function getVisibleTasks() {
  if (currentFilter === 'active') {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter((t) => t.completed);
  }
  return tasks;
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}

function getEmptyHintText() {
  if (tasks.length === 0) {
    return 'No tasks yet';
  }
  return currentFilter === 'completed' ? 'No completed tasks' : 'No active tasks';
}

function render() {
  const visibleTasks = getVisibleTasks();

  list.textContent = '';
  for (const task of visibleTasks) {
    list.appendChild(createTaskItem(task));
  }

  emptyHint.textContent = getEmptyHintText();
  emptyHint.hidden = visibleTasks.length > 0;

  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === currentFilter));
  }

  const left = tasks.filter((task) => !task.completed).length;
  counter.textContent = `${left} ${left === 1 ? 'task' : 'tasks'} left`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateTask(input.value);
  if (result.error) {
    showMessage(result.error);
    return;
  }
  clearMessage(); // before adding, so a "could not save" message from addTask stays visible
  addTask(result.text);
  input.value = '';
  input.focus();
});

input.addEventListener('input', clearMessage);

for (const button of filterButtons) {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
}

render();
