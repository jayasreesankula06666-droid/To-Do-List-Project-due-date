const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const dueInput = document.querySelector("#task-due");
const list = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");

const STORAGE_KEY = "student-todo-list-tasks";
let tasks = loadTasks();

// Set the minimum due date to the current local date and time.
function setMinimumDueDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  dueInput.min = now.toISOString().slice(0, 16);
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Keep tasks from older versions working.
    return Array.isArray(saved) ? saved.map(task => ({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      dueAt: task.dueAt || ""
    })) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return `${date.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  })} at ${date.toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit"
  })}`;
}

function renderTasks() {
  list.replaceChildren();
  let completed = 0;

  tasks.forEach((task) => {
    if (task.completed) completed++;

    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as completed`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const addedDate = document.createElement("time");
    addedDate.className = "task-date";
    addedDate.dateTime = task.createdAt;
    addedDate.textContent = `Added: ${formatDateTime(task.createdAt)}`;
    details.append(text, addedDate);

    if (task.dueAt) {
      const dueDate = document.createElement("time");
      dueDate.className = "task-due";
      dueDate.dateTime = new Date(task.dueAt).toISOString();
      const overdue = new Date(task.dueAt).getTime() < Date.now() && !task.completed;
      if (overdue) dueDate.classList.add("overdue");
      dueDate.textContent = `${overdue ? "Overdue · " : "Due · "}${formatDateTime(task.dueAt)}`;
      details.append(dueDate);
    } else {
      const noDueDate = document.createElement("span");
      noDueDate.className = "task-date";
      noDueDate.textContent = "No due date set (older task)";
      details.append(noDueDate);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, details, deleteButton);
    list.append(item);
  });

  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  completedCount.textContent = `${completed} completed`;
  emptyMessage.hidden = tasks.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  const dueAt = dueInput.value;
  if (!text || !dueAt) return;

  const dueDate = new Date(dueAt);
  if (Number.isNaN(dueDate.getTime())) {
    dueInput.setCustomValidity("Please choose a valid due date and time.");
    dueInput.reportValidity();
    return;
  }
  if (dueDate.getTime() < Date.now()) {
    dueInput.setCustomValidity("Please choose a due date and time in the future.");
    dueInput.reportValidity();
    return;
  }
  dueInput.setCustomValidity("");

  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    dueAt: dueDate.toISOString()
  });
  saveTasks();
  renderTasks();
  form.reset();
  setMinimumDueDate();
  input.focus();
});

dueInput.addEventListener("input", () => dueInput.setCustomValidity(""));
setMinimumDueDate();
saveTasks();
renderTasks();
