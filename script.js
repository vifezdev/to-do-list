document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 600);

    loadTasks();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(tasks) {
    const categoryFilter = document.getElementById('categoryFilter').value;

    const filteredTasks = tasks.filter(task => {
        if (categoryFilter === 'all') {
            return true;
        } else {
            return task.category === categoryFilter;
        }
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        addTaskToList(task);
    });
}

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.dataset.taskId = task.id;

    li.innerHTML = `
        <div class="task-details">
            <span class="task-name">${task.task}</span>
            <span class="task-info">${task.category ? `(${task.category})` : ''}</span>
            <span class="task-info">${task.date}</span>
            <span class="task-info">${task.description ? `- ${task.description}` : ''}</span>
        </div>
        <div class="task-actions">
            <button class="task-action ${task.status === 'complete' ? 'complete' : 'wip'}" onclick="toggleTaskStatus(${task.id})">${task.status === 'complete' ? 'Complete' : 'WIP'}</button>
            <button class="task-action delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    taskList.appendChild(li);
}

function toggleTaskStatus(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'wip' ? 'complete' : 'wip';
        saveTasks(tasks);
        renderTasks(tasks);
    }
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    renderTasks(tasks);
}

function filterTasks(category) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
}

function clearTaskForm() {
    document.getElementById('taskForm').reset();
}

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const taskInput = document.getElementById('taskInput').value.trim();
    const categoryInput = document.getElementById('categoryInput').value.trim();
    const dateInput = document.getElementById('dateInput').value;
    const descriptionInput = document.getElementById('descriptionInput').value.trim();

    if (!taskInput) {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        task: taskInput,
        category: categoryInput,
        date: dateInput,
        description: descriptionInput,
        status: 'wip'
    };

    addTaskToList(task);

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);

    clearTaskForm();
});