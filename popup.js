const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Load tasks from storage
chrome.storage.local.get("tasks", (data) => {
  const tasks = data.tasks || [];
  tasks.forEach(renderTask);
});

// Add task event
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = document.getElementById("task-name").value;
  const taskTime = document.getElementById("task-time").value;

  const task = { name: taskName, time: taskTime };
  chrome.storage.local.get("tasks", (data) => {
    const tasks = data.tasks || [];
    tasks.push(task);
    chrome.storage.local.set({ tasks });
  });
  renderTask(task);
  taskForm.reset();
});

// Render task in the UI
function renderTask(task) {
  const li = document.createElement("li");
  li.textContent = `${task.name} at ${task.time}`;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    chrome.storage.local.get("tasks", (data) => {
      const tasks = data.tasks || [];
      const updatedTasks = tasks.filter(
        (t) => t.name !== task.name || t.time !== task.time
      );
      chrome.storage.local.set({ tasks: updatedTasks });
    });
    li.remove();
  });
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}
