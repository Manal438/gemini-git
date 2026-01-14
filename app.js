// Todo App Logic
let todos = [];
let currentFilter = 'all';
let currentSort = 'none'; // 'none', 'dueDateAsc'

// DOM Elements
const todoInput = document.getElementById('todoInput');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortByDueDateBtn = document.getElementById('sortByDueDateBtn');

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// Add todo on button click
addBtn.addEventListener('click', addTodo);

// Add todo on Enter key press
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Clear completed todos
clearCompletedBtn.addEventListener('click', clearCompleted);

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Sort by Due Date button
sortByDueDateBtn.addEventListener('click', toggleSortByDueDate);

function addTodo() {
    const text = todoInput.value.trim();
    const dueDate = dueDateInput.value; // Get the date value (YYYY-MM-DD string)

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDate // Store due date as a string
    };

    todos.push(todo);
    todoInput.value = '';
    dueDateInput.value = ''; // Clear date input
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function toggleSortByDueDate() {
    if (currentSort === 'dueDateAsc') {
        currentSort = 'none';
        sortByDueDateBtn.classList.remove('active');
    } else {
        currentSort = 'dueDateAsc';
        sortByDueDateBtn.classList.add('active');
    }
    renderTodos();
}

function renderTodos() {
    let displayedTodos = getFilteredTodos();

    // Apply sorting if active
    if (currentSort === 'dueDateAsc') {
        displayedTodos.sort((a, b) => {
            // Prioritize tasks with due dates, then sort by date
            if (!a.dueDate && !b.dueDate) return 0; // Both no due date, maintain original order
            if (!a.dueDate) return 1; // a has no due date, b goes first
            if (!b.dueDate) return -1; // b has no due date, a goes first

            // Convert to Date objects for comparison
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);

            // Sort by date ascending
            return dateA.getTime() - dateB.getTime();
        });
    }

    todoList.innerHTML = '';

    if (displayedTodos.length === 0) {
        todoList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No tasks to show</li>';
    } else {
        displayedTodos.forEach(todo => {
            const li = document.createElement('li');
            let classes = `todo-item ${todo.completed ? 'completed' : ''}`;

            // Check for overdue tasks (only if not completed)
            if (todo.dueDate && !todo.completed) {
                const today = new Date();
                // Normalize today's date to start of day for accurate comparison
                today.setHours(0, 0, 0, 0);

                const taskDueDate = new Date(todo.dueDate);
                // Normalize task due date to start of day
                taskDueDate.setHours(0, 0, 0, 0);

                if (taskDueDate < today) {
                    classes += ' overdue';
                }
            }
            li.className = classes;

            const dueDateDisplay = todo.dueDate ? 
                `<span class="due-date">Due: ${new Date(todo.dueDate).toLocaleDateString()}</span>` : '';

            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                ${dueDateDisplay}
                <button class="btn-delete">Delete</button>
            `;

            // Toggle completion
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            // Delete todo
            const deleteBtn = li.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            todoList.appendChild(li);
        });
    }

    updateStats();
}

function updateStats() {
    const activeTodos = todos.filter(todo => !todo.completed);
    const count = activeTodos.length;
    taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} remaining`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    // Ensure dueDate is handled, even if it wasn't present in older todos
    // (No explicit conversion needed here as it's stored as string)
}
