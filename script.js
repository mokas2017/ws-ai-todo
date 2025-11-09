// ==============================
// 🧠 To-Do List "Post-it Style"
// ==============================

// Sélection du DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const clearBtn = document.getElementById("clear-completed");

// Modale
const modal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTask = null;

// Afficher les tâches
tasks.forEach(task => renderTask(task));

// ➕ Ajouter une tâche
form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = { text, completed: false, rotation: randomRotation() };
  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();

  input.value = "";
  input.focus();
});

// Fonction d'affichage d'une tâche
function renderTask(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");
  li.style.setProperty("--rotate", task.rotation);

  const span = document.createElement("span");
  span.textContent = task.text;

  // ✅ Terminer
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "✅";
  doneBtn.classList.add("btn-action", "btn-done");
  doneBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    li.classList.toggle("completed");
    saveTasks();
  });

  // ✏️ Modifier
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.classList.add("btn-action", "btn-edit");
  editBtn.addEventListener("click", () => openEditModal(task, span));

  // 🗑️ Supprimer
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.classList.add("btn-action", "btn-delete");
  delBtn.addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter(t => t !== task);
    saveTasks();
  });

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  actionsDiv.append(doneBtn, editBtn, delBtn);

  li.append(span, actionsDiv);
  list.appendChild(li);
}

// Sauvegarde dans localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Effacer les tâches terminées
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  list.innerHTML = "";
  tasks.forEach(task => renderTask(task));
});

// ------------------------------
// 💬 Gestion de la modale
// ------------------------------
function openEditModal(task, spanElement) {
  modal.classList.remove("hidden");
  editInput.value = task.text;
  editInput.focus();
  currentTask = { task, spanElement };
}

cancelEditBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  currentTask = null;
});

saveEditBtn.addEventListener("click", () => {
  const newText = editInput.value.trim();
  if (newText && currentTask) {
    currentTask.task.text = newText;
    currentTask.spanElement.textContent = newText;
    saveTasks();
  }
  modal.classList.add("hidden");
  currentTask = null;
});

// ------------------------------
// 🎲 Génère une rotation aléatoire
// ------------------------------
function randomRotation() {
  return (Math.random() * 6 - 3).toFixed(2); // entre -3 et +3 degrés
}
