// Todo App Logic
let todos = [];
let currentFilter = 'all';
let currentSort = 'none'; // 'none', 'dueDate'

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
sortByDueDateBtn.addEventListener('click', () => {
    currentSort = (currentSort === 'dueDate') ? 'none' : 'dueDate';

    // Update active class for the sort button
    if (currentSort === 'dueDate') {
        sortByDueDateBtn.classList.add('active');
    } else {
        sortByDueDateBtn.classList.remove('active');
    }
    renderTodos();
});

function addTodo() {
    const text = todoInput.value.trim();
    const dueDate = dueDateInput.value; // YYYY-MM-DD format or empty string

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || null // Store as YYYY-MM-DD string or null
    };

    todos.push(todo);
    todoInput.value = '';
    dueDateInput.value = ''; // Clear due date input
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

/**
 * Helper function to get todos, applying sorting then filtering.
 * Operates on the global `todos` array and `currentSort`, `currentFilter` states.
 */
function getSortedAndFilteredTodos() {
    let tasksToProcess = [...todos]; // Start with a shallow copy

    // 1. Apply sorting if enabled
    if (currentSort === 'dueDate') {
        // Sort by dueDate, placing tasks without a due date at the end
        tasksToProcess.sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1; // tasks without due date go last
            if (!b.dueDate) return -1; // tasks without due date go last
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }
    // If currentSort is 'none', tasks remain in their original addition order (implicit sort by id)

    // 2. Apply filtering
    switch (currentFilter) {
        case 'active':
            return tasksToProcess.filter(todo => !todo.completed);
        case 'completed':
            return tasksToProcess.filter(todo => todo.completed);
        default: // 'all'
            return tasksToProcess;
    }
}

function renderTodos() {
    const todosToDisplay = getSortedAndFilteredTodos(); // Use the new combined function

    todoList.innerHTML = '';

    if (todosToDisplay.length === 0) {
        todoList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No tasks to show</li>';
    } else {
        todosToDisplay.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            // Check for overdue status
            if (todo.dueDate && !todo.completed) {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today's date to start of day
                const taskDueDate = new Date(todo.dueDate);
                taskDueDate.setHours(0, 0, 0, 0); // Normalize task due date to start of day

                if (taskDueDate < today) {
                    li.classList.add('overdue');
                }
            }

            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <span class="todo-text">${todo.text}</span>
                    ${todo.dueDate ? `<span class="due-date">Due: ${new Date(todo.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
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

    // Ensure the sort button's active state is consistent on render
    if (currentSort === 'dueDate') {
        sortByDueDateBtn.classList.add('active');
    } else {
        sortByDueDateBtn.classList.remove('active');
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        // Ensure backward compatibility for old todos that don't have a dueDate
        todos.forEach(todo => {
            if (todo.dueDate === undefined) {
                todo.dueDate = null; 
            }
        });
    }
}