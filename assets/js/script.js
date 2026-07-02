const btnDark = document.getElementById("btnDark");
const taskInput = document.getElementById("taskInput");
const btnAdd = document.getElementById("btnAdd");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskInfo = document.getElementById("taskInfo");
const taskCount = document.getElementById("taskCount");
const btnClearHave = document.getElementById("btnClearHave");
const filterBtns = document.querySelectorAll(".filter-btn");
const modalOverlay = document.getElementById("modalOverlay");
const btnCancelDelete = document.getElementById("btnCancelDelete");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

// ===== STATE =====
let tasks = JSON.parse(localStorage.getItem("lista_compras_tasks")) || [];
let currentFilter = "all";
let taskToDelete = null;

// ===== THEME =====
const savedTheme = localStorage.getItem("lista_compras_theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  btnDark.innerText = "☀️ Light Mode";
}

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  btnDark.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("lista_compras_theme", isDark ? "dark" : "light");
});

// ===== ADD TASK =====
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    taskInput.style.animation = "shake 0.4s ease";
    setTimeout(() => taskInput.style.animation = "", 400);
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    status: "neutral",  // "neutral" | "have" | "need"
    createdAt: new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

btnAdd.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// ===== SET STATUS =====
function setStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    // Se clicar no mesmo status, volta para neutro
    if (task.status === status) {
      task.status = "neutral";
    } else {
      task.status = status;
    }
    saveTasks();
    renderTasks();
  }
}

// ===== EDIT TASK =====
function editTask(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (task && newText.trim()) {
    task.text = newText.trim();
    saveTasks();
  }
}

// ===== DELETE TASK =====
function confirmDelete(id) {
  taskToDelete = id;
  modalOverlay.classList.add("show");
}

function deleteTask() {
  if (taskToDelete !== null) {
    tasks = tasks.filter(t => t.id !== taskToDelete);
    saveTasks();
    renderTasks();
    taskToDelete = null;
  }
  modalOverlay.classList.remove("show");
}

btnCancelDelete.addEventListener("click", () => {
  taskToDelete = null;
  modalOverlay.classList.remove("show");
});

btnConfirmDelete.addEventListener("click", deleteTask);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    taskToDelete = null;
    modalOverlay.classList.remove("show");
  }
});

// ===== CLEAR "TENHO" =====
btnClearHave.addEventListener("click", () => {
  const haveCount = tasks.filter(t => t.status === "have").length;
  if (haveCount === 0) return;
  
  if (confirm(`Remover ${haveCount} produto(s) que você já tem?`)) {
    tasks = tasks.filter(t => t.status !== "have");
    saveTasks();
    renderTasks();
  }
});

// ===== FILTERS =====
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== RENDER =====
function renderTasks() {
  const filtered = tasks.filter(task => {
    if (currentFilter === "have") return task.status === "have";
    if (currentFilter === "need") return task.status === "need";
    return true;
  });

  // Update stats
  document.getElementById("statTotal").textContent = tasks.length;
  document.getElementById("statHave").textContent = tasks.filter(t => t.status === "have").length;
  document.getElementById("statNeed").textContent = tasks.filter(t => t.status === "need").length;

  // Empty state
  if (filtered.length === 0) {
    taskList.innerHTML = "";
    taskList.appendChild(emptyState);
    emptyState.style.display = "block";
    taskInfo.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  taskInfo.style.display = "flex";
  
  const totalText = tasks.length === 1 ? "1 produto" : `${tasks.length} produtos`;
  taskCount.textContent = totalText;

  taskList.innerHTML = "";
  
  filtered.forEach(task => {
    const taskEl = createTaskElement(task);
    taskList.appendChild(taskEl);
  });
}

function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = `task ${task.status}`;
  div.dataset.id = task.id;

  // Text (editable)
  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = task.text;
  textSpan.contentEditable = true;
  textSpan.setAttribute("spellcheck", "false");
  
  textSpan.addEventListener("blur", () => {
    editTask(task.id, textSpan.textContent);
  });
  
  textSpan.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textSpan.blur();
    }
  });

  // Date
  const dateSpan = document.createElement("span");
  dateSpan.className = "task-date";
  dateSpan.textContent = task.createdAt;

  // Actions (3 botões de ícone)
  const actions = document.createElement("div");
  actions.className = "task-actions";

  // Botão TENHO (✅ verde)
  const btnHave = document.createElement("button");
  btnHave.className = `task-btn btn-have ${task.status === "have" ? "active" : ""}`;
  btnHave.innerHTML = "✓";
  btnHave.setAttribute("aria-label", "Tenho este produto");
  btnHave.title = task.status === "have" ? "Tenho (clique para remover)" : "Marcar como tenho";
  btnHave.addEventListener("click", () => setStatus(task.id, "have"));

  // Botão FALTA (⚠️ amarelo)
  const btnNeed = document.createElement("button");
  btnNeed.className = `task-btn btn-need ${task.status === "need" ? "active" : ""}`;
  btnNeed.innerHTML = "!";
  btnNeed.setAttribute("aria-label", "Produto em falta");
  btnNeed.title = task.status === "need" ? "Em falta (clique para remover)" : "Marcar como em falta";
  btnNeed.addEventListener("click", () => setStatus(task.id, "need"));

  // Botão EXCLUIR (🗑️ vermelho)
  const btnDelete = document.createElement("button");
  btnDelete.className = "task-btn btn-delete";
  btnDelete.innerHTML = "✕";
  btnDelete.setAttribute("aria-label", "Excluir produto");
  btnDelete.title = "Excluir";
  btnDelete.addEventListener("click", () => confirmDelete(task.id));

  actions.appendChild(btnHave);
  actions.appendChild(btnNeed);
  actions.appendChild(btnDelete);

  div.appendChild(textSpan);
  div.appendChild(dateSpan);
  div.appendChild(actions);

  return div;
}

// ===== STORAGE =====
function saveTasks() {
  localStorage.setItem("lista_compras_tasks", JSON.stringify(tasks));
}

// ===== INIT =====
renderTasks();

// Add shake animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);
