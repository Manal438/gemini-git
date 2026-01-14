(
    function () {
        // 1. DOM Elements (Constants)
        // Centralized references to all necessary DOM elements.
        const DOMElements = {
            todoInput: document.getElementById('todoInput'),
            addBtn: document.getElementById('addBtn'),
            todoList: document.getElementById('todoList'),
            taskCount: document.getElementById('taskCount'),
            clearCompletedBtn: document.getElementById('clearCompleted'),
            filterBtns: document.querySelectorAll('.filter-btn'),
        };

        // 2. Storage Module
        // Handles all interactions with localStorage.
        const Storage = {
            /**
             * Retrieves todos from localStorage.
             * @returns {Array} An array of todo objects.
             */
            getTodos: () => {
                try {
                    const savedTodos = localStorage.getItem('todos');
                    return savedTodos ? JSON.parse(savedTodos) : [];
                } catch (error) {
                    console.error('Error loading todos from localStorage:', error);
                    return [];
                }
            },

            /**
             * Saves the current todos array to localStorage.
             * @param {Array} todos - The array of todo objects to save.
             */
            saveTodos: (todos) => {
                try {
                    localStorage.setItem('todos', JSON.stringify(todos));
                } catch (error) {
                    console.error('Error saving todos to localStorage:', error);
                }
            }
        };

        // 3. Todo Model (Core Logic / State Management)
        // Manages the application's data state and business logic.
        const TodoModel = {
            todos: [],
            currentFilter: 'all',

            /**
             * Initializes the model by loading todos from storage.
             */
            init: () => {
                TodoModel.todos = Storage.getTodos();
            },

            /**
             * Adds a new todo item.
             * @param {string} text - The text content of the todo.
             */
            addTodo: (text) => {
                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                TodoModel.todos.push(todo);
                Storage.saveTodos(TodoModel.todos);
            },

            /**
             * Deletes a todo item by its ID.
             * @param {number} id - The ID of the todo to delete.
             */
            deleteTodo: (id) => {
                TodoModel.todos = TodoModel.todos.filter(todo => todo.id !== id);
                Storage.saveTodos(TodoModel.todos);
            },

            /**
             * Toggles the completion status of a todo item.
             * @param {number} id - The ID of the todo to toggle.
             */
            toggleTodo: (id) => {
                TodoModel.todos = TodoModel.todos.map(todo => {
                    if (todo.id === id) {
                        return { ...todo, completed: !todo.completed };
                    }
                    return todo;
                });
                Storage.saveTodos(TodoModel.todos);
            },

            /**
             * Removes all completed todo items.
             */
            clearCompleted: () => {
                TodoModel.todos = TodoModel.todos.filter(todo => !todo.completed);
                Storage.saveTodos(TodoModel.todos);
            },

            /**
             * Returns a filtered list of todos based on the current filter.
             * @returns {Array} An array of filtered todo objects.
             */
            getFilteredTodos: () => {
                switch (TodoModel.currentFilter) {
                    case 'active':
                        return TodoModel.todos.filter(todo => !todo.completed);
                    case 'completed':
                        return TodoModel.todos.filter(todo => todo.completed);
                    default:
                        return TodoModel.todos;
                }
            },

            /**
             * Gets the current filter setting.
             * @returns {string} The current filter ('all', 'active', 'completed').
             */
            getCurrentFilter: () => TodoModel.currentFilter,

            /**
             * Sets the current filter setting.
             * @param {string} filter - The filter to set.
             */
            setCurrentFilter: (filter) => { TodoModel.currentFilter = filter; }
        };

        // 4. Todo View (UI Rendering)
        // Handles all aspects of rendering the user interface.
        const TodoView = {
            /**
             * Creates and returns a single LI element for a todo item.
             * Attaches event listeners specific to this todo item.
             * @param {Object} todo - The todo object to render.
             * @returns {HTMLLIElement} The created list item element.
             */
            createTodoElement: (todo) => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', todo.id);

                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="btn-delete">Delete</button>
                `;

                // Attach listeners directly to the created elements to manage specific todo interactions.
                li.querySelector('.todo-checkbox').addEventListener('change', () => TodoController.handleToggleTodo(todo.id));
                li.querySelector('.btn-delete').addEventListener('click', () => TodoController.handleDeleteTodo(todo.id));

                return li;
            },

            /**
             * Renders the entire list of todos based on the provided array.
             * @param {Array} todosToRender - The array of todo objects to display.
             */
            renderTodos: (todosToRender) => {
                DOMElements.todoList.innerHTML = ''; // Clear existing list

                if (todosToRender.length === 0) {
                    DOMElements.todoList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No tasks to show</li>';
                } else {
                    todosToRender.forEach(todo => {
                        DOMElements.todoList.appendChild(TodoView.createTodoElement(todo));
                    });
                }
                TodoView.updateStats(); // Always update stats after rendering todos
            },

            /**
             * Updates the task count display.
             */
            updateStats: () => {
                const activeTodos = TodoModel.todos.filter(todo => !todo.completed);
                const count = activeTodos.length;
                DOMElements.taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} remaining`;
            },

            /**
             * Sets the active class on the appropriate filter button.
             * @param {string} filter - The filter to set as active.
             */
            setActiveFilter: (filter) => {
                DOMElements.filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.filter === filter) {
                        btn.classList.add('active');
                    }
                });
            },

            /**
             * Clears the todo input field.
             */
            clearTodoInput: () => {
                DOMElements.todoInput.value = '';
            }
        };

        // 5. Todo Controller (Event Handling & Orchestration)
        // Connects the Model and View, handles user input, and orchestrates updates.
        const TodoController = {
            /**
             * Initializes the application: loads data, sets up event listeners, and renders initial UI.
             */
            init: () => {
                TodoModel.init(); // Load initial todos from storage
                TodoController.bindEventListeners(); // Set up all event listeners
                TodoView.setActiveFilter(TodoModel.getCurrentFilter()); // Set the initial active filter button
                TodoController.refreshView(); // Perform the initial render
            },

            /**
             * Attaches all global event listeners to DOM elements.
             */
            bindEventListeners: () => {
                // Add Todo button click
                DOMElements.addBtn.addEventListener('click', TodoController.handleAddTodo);

                // Add Todo on Enter key press in input field
                DOMElements.todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        TodoController.handleAddTodo();
                    }
                });

                // Clear Completed button click
                DOMElements.clearCompletedBtn.addEventListener('click', TodoController.handleClearCompleted);

                // Filter buttons click
                DOMElements.filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const filter = btn.dataset.filter;
                        TodoController.handleFilterChange(filter);
                    });
                });
            },

            /**
             * Handler for adding a new todo item.
             */
            handleAddTodo: () => {
                const text = DOMElements.todoInput.value.trim();
                if (text === '') {
                    alert('Please enter a task!'); // Consider more user-friendly feedback
                    return;
                }
                TodoModel.addTodo(text);
                TodoView.clearTodoInput();
                TodoController.refreshView();
            },

            /**
             * Handler for deleting a todo item. Called from individual todo item's delete button.
             * @param {number} id - The ID of the todo to delete.
             */
            handleDeleteTodo: (id) => {
                TodoModel.deleteTodo(id);
                TodoController.refreshView();
            },

            /**
             * Handler for toggling a todo item's completion status. Called from individual todo item's checkbox.
             * @param {number} id - The ID of the todo to toggle.
             */
            handleToggleTodo: (id) => {
                TodoModel.toggleTodo(id);
                TodoController.refreshView();
            },

            /**
             * Handler for clearing all completed todo items.
             */
            handleClearCompleted: () => {
                TodoModel.clearCompleted();
                TodoController.refreshView();
            },

            /**
             * Handler for changing the todo filter.
             * @param {string} filter - The filter value ('all', 'active', 'completed').
             */
            handleFilterChange: (filter) => {
                TodoModel.setCurrentFilter(filter);
                TodoView.setActiveFilter(filter); // Update active class on filter buttons
                TodoController.refreshView();
            },

            /**
             * Refreshes the view by re-rendering todos based on the current filter
             * and updating statistics.
             */
            refreshView: () => {
                const filteredTodos = TodoModel.getFilteredTodos();
                TodoView.renderTodos(filteredTodos);
            }
        };

        // Initialize the app when the DOM content is fully loaded
        document.addEventListener('DOMContentLoaded', TodoController.init);
    }
)();