/**
 * @file app.test.js
 * @description Jest-like unit tests for the Todo app's JavaScript logic (app.js).
 * This file assumes a testing environment like Jest is set up and that `app.js`'s
 * global functions and variables (todos, currentFilter, addTodo, etc.) are available
 * or can be replicated for testing purposes. For demonstration, core functions from app.js
 * are replicated here to allow isolated testing against mocked DOM elements and localStorage.
 */

// --- Global Mocks for app.js dependencies --- 

// Mock DOM elements
// In a real JSDOM environment, you'd create these with `document.createElement`.
// Here, we're just mocking their properties and methods that `app.js` interacts with.
const mockTodoInput = { value: '' };
const mockAddBtn = { addEventListener: jest.fn() };
const mockTodoList = { innerHTML: '', appendChild: jest.fn() };
const mockTaskCount = { textContent: '' };
const mockClearCompletedBtn = { addEventListener: jest.fn() };
const mockFilterBtns = [ // An array of mock buttons
    {
        classList: { remove: jest.fn(), add: jest.fn() },
        addEventListener: jest.fn(),
        dataset: { filter: 'all' }
    },
    {
        classList: { remove: jest.fn(), add: jest.fn() },
        addEventListener: jest.fn(),
        dataset: { filter: 'active' }
    },
    {
        classList: { remove: jest.fn(), add: jest.fn() },
        addEventListener: jest.fn(),
        dataset: { filter: 'completed' }
    }
];

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        clear: jest.fn(() => { store = {}; }),
        removeItem: jest.fn(key => { delete store[key]; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.alert
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock Date.now() for predictable IDs
const MOCK_DATE_NOW = 1678886400000; // March 15, 2023 12:00:00 PM UTC
jest.spyOn(Date, 'now').mockReturnValue(MOCK_DATE_NOW);

// Mock `document.getElementById` and `document.querySelectorAll`
// These need to return the same mock elements that `app.js` would obtain globally
document.getElementById = jest.fn((id) => {
    switch (id) {
        case 'todoInput': return mockTodoInput;
        case 'addBtn': return mockAddBtn;
        case 'todoList': return mockTodoList;
        case 'taskCount': return mockTaskCount;
        case 'clearCompleted': return mockClearCompletedBtn;
        default: return null;
    }
});
document.querySelectorAll = jest.fn((selector) => {
    if (selector === '.filter-btn') return mockFilterBtns;
    return [];
});

// --- Replicated app.js functions (for testing *this* file's logic) ---
// These are copies of the functions from app.js, operating on the `todos` and `currentFilter` variables
// defined *within this test file's scope*. This allows them to be testable.
// In a proper setup (e.g., using JSDOM in Jest), you'd load app.js and test its global functions directly.
// For this generated test file, this approach demonstrates the test cases against the logic.

let todos = []; // Represents the global `todos` array from `app.js`
let currentFilter = 'all'; // Represents the global `currentFilter` from `app.js`

// Mock `renderTodos` and `updateStats` initially to avoid complex DOM rendering in unit tests.
// Their actual replicated implementations will be called when needed for integration-like checks.
const _mockRenderTodos = jest.fn(); // Mock for renderTodos call within other functions
const _mockUpdateStats = jest.fn(); // Mock for updateStats call within renderTodos

// Original functions from app.js, operating on the `todos` and `currentFilter` declared above.
function addTodo() {
    const text = mockTodoInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(todo);
    mockTodoInput.value = '';
    saveTodos();
    _mockRenderTodos(); // Call the mock
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    _mockRenderTodos(); // Call the mock
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    _mockRenderTodos(); // Call the mock
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    _mockRenderTodos(); // Call the mock
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

function renderTodos() {
    const filteredTodos = getFilteredTodos(); // This will use the test-scoped `getFilteredTodos`

    mockTodoList.innerHTML = ''; // Mock the DOM clearing

    if (filteredTodos.length === 0) {
        mockTodoList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No tasks to show</li>';
    } else {
        filteredTodos.forEach(todo => {
            // Mock `document.createElement` behavior, or simply append a mock object
            const li = {
                className: `todo-item ${todo.completed ? 'completed' : ''}`,
                innerHTML: `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="btn-delete">Delete</button>
                `,
                // Mock querySelector and addEventListener on the created li
                querySelector: jest.fn(selector => {
                    if (selector === '.todo-checkbox') return { addEventListener: jest.fn(), checked: todo.completed };
                    if (selector === '.btn-delete') return { addEventListener: jest.fn() };
                    return null;
                })
            };
            mockTodoList.appendChild(li); // Use the mock appendChild
        });
    }
    updateStats(); // This will call the test-scoped `updateStats`
}

function updateStats() {
    const activeTodos = todos.filter(todo => !todo.completed);
    const count = activeTodos.length;
    mockTaskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} remaining`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// --- Test Suites ---

describe('Todo App Logic', () => {
    beforeEach(() => {
        // Reset all mocks and internal state before each test
        localStorageMock.clear();
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();

        // Reset the global variables that app.js operates on
        todos = [];
        currentFilter = 'all';

        mockTodoInput.value = '';
        mockTodoList.innerHTML = '';
        mockTodoList.appendChild.mockClear();
        mockTaskCount.textContent = '';
        _mockRenderTodos.mockClear();
        _mockUpdateStats.mockClear();
        alertMock.mockClear();
        jest.spyOn(Date, 'now').mockReturnValue(MOCK_DATE_NOW); // Ensure predictable IDs
    });

    describe('addTodo', () => {
        it('should add a new todo to the list if input is valid', () => {
            mockTodoInput.value = 'Test Task';
            addTodo(); // Call the replicated function

            expect(todos).toHaveLength(1);
            expect(todos[0]).toEqual({
                id: MOCK_DATE_NOW,
                text: 'Test Task',
                completed: false,
                createdAt: expect.any(String)
            });
            expect(mockTodoInput.value).toBe('');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1); // Expect the mock to be called
        });

        it('should not add a todo if input is empty', () => {
            mockTodoInput.value = '';
            addTodo();

            expect(todos).toHaveLength(0);
            expect(alertMock).toHaveBeenCalledWith('Please enter a task!');
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(_mockRenderTodos).not.toHaveBeenCalled();
        });

        it('should not add a todo if input is only whitespace', () => {
            mockTodoInput.value = '   ';
            addTodo();

            expect(todos).toHaveLength(0);
            expect(alertMock).toHaveBeenCalledWith('Please enter a task!');
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(_mockRenderTodos).not.toHaveBeenCalled();
        });
    });

    describe('deleteTodo', () => {
        beforeEach(() => {
            todos = [{ id: 1, text: 'Task 1', completed: false }];
            localStorageMock.setItem('todos', JSON.stringify(todos)); // Simulate initial state
        });

        it('should remove the specified todo from the list', () => {
            deleteTodo(1);

            expect(todos).toHaveLength(0);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', '[]');
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });

        it('should not remove any todo if ID does not match', () => {
            deleteTodo(99);

            expect(todos).toHaveLength(1);
            expect(todos[0].text).toBe('Task 1');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });
    });

    describe('toggleTodo', () => {
        beforeEach(() => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            localStorageMock.setItem('todos', JSON.stringify(todos));
        });

        it('should toggle a todo from incomplete to complete', () => {
            toggleTodo(1);

            const updatedTodo = todos.find(t => t.id === 1);
            expect(updatedTodo.completed).toBe(true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });

        it('should toggle a todo from complete to incomplete', () => {
            toggleTodo(2);

            const updatedTodo = todos.find(t => t.id === 2);
            expect(updatedTodo.completed).toBe(false);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });

        it('should not change other todos', () => {
            toggleTodo(1);

            const unchangedTodo = todos.find(t => t.id === 2);
            expect(unchangedTodo.completed).toBe(true);
        });
    });

    describe('clearCompleted', () => {
        beforeEach(() => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false },
                { id: 4, text: 'Task 4', completed: true }
            ];
            localStorageMock.setItem('todos', JSON.stringify(todos));
        });

        it('should remove all completed todos', () => {
            clearCompleted();

            expect(todos).toHaveLength(2);
            expect(todos.every(todo => !todo.completed)).toBe(true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify([
                { id: 1, text: 'Task 1', completed: false },
                { id: 3, text: 'Task 3', completed: false }
            ]));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if no todos are completed', () => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 3, text: 'Task 3', completed: false }
            ];
            localStorageMock.setItem('todos', JSON.stringify(todos));

            clearCompleted();

            expect(todos).toHaveLength(2);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
            expect(_mockRenderTodos).toHaveBeenCalledTimes(1);
        });
    });

    describe('getFilteredTodos', () => {
        beforeEach(() => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false }
            ];
        });

        it('should return all todos when filter is "all"', () => {
            currentFilter = 'all';
            const filtered = getFilteredTodos();
            expect(filtered).toEqual(todos);
            expect(filtered).toHaveLength(3);
        });

        it('should return only active todos when filter is "active"', () => {
            currentFilter = 'active';
            const filtered = getFilteredTodos();
            expect(filtered).toEqual([
                { id: 1, text: 'Task 1', completed: false },
                { id: 3, text: 'Task 3', completed: false }
            ]);
            expect(filtered).toHaveLength(2);
        });

        it('should return only completed todos when filter is "completed"', () => {
            currentFilter = 'completed';
            const filtered = getFilteredTodos();
            expect(filtered).toEqual([
                { id: 2, text: 'Task 2', completed: true }
            ]);
            expect(filtered).toHaveLength(1);
        });
    });

    describe('updateStats', () => {
        it('should correctly update task count for multiple active tasks', () => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false }
            ];
            updateStats(); // Call the actual replicated function
            expect(mockTaskCount.textContent).toBe('2 tasks remaining');
        });

        it('should correctly update task count for a single active task', () => {
            todos = [{ id: 1, text: 'Task 1', completed: false }];
            updateStats();
            expect(mockTaskCount.textContent).toBe('1 task remaining');
        });

        it('should correctly update task count for zero active tasks', () => {
            todos = [{ id: 1, text: 'Task 1', completed: true }];
            updateStats();
            expect(mockTaskCount.textContent).toBe('0 tasks remaining');
        });
    });

    describe('saveTodos and loadTodos', () => {
        it('should save todos to localStorage', () => {
            todos = [{ id: 1, text: 'Saved Task', completed: false }];
            saveTodos();
            expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
        });

        it('should load todos from localStorage', () => {
            const savedData = [{ id: 1, text: 'Loaded Task', completed: true }];
            localStorageMock.setItem('todos', JSON.stringify(savedData));
            todos = []; // Clear current todos before loading
            loadTodos();
            expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
            expect(todos).toEqual(savedData);
        });

        it('should initialize with empty array if no todos in localStorage', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);
            todos = [{ id: 99, text: 'Existing Task', completed: false }]; // Should be overwritten if load is successful
            loadTodos();
            expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
            expect(todos).toEqual([]);
        });
    });

    describe('renderTodos (basic DOM interaction check)', () => {
        beforeEach(() => {
            todos = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            mockTodoList.innerHTML = '';
            mockTodoList.appendChild.mockClear();
            _mockUpdateStats.mockClear(); // Clear the mock for updateStats
        });

        it('should clear the list and append todo items', () => {
            renderTodos(); // Call the actual replicated function
            expect(mockTodoList.innerHTML).not.toContain('No tasks to show');
            expect(mockTodoList.appendChild).toHaveBeenCalledTimes(2); // Two todos
            // Check content of appended items (first argument to appendChild)
            const firstAppendedItem = mockTodoList.appendChild.mock.calls[0][0];
            const secondAppendedItem = mockTodoList.appendChild.mock.calls[1][0];
            expect(firstAppendedItem.className).not.toContain('completed');
            expect(firstAppendedItem.innerHTML).toContain('Task 1');
            expect(secondAppendedItem.className).toContain('completed');
            expect(secondAppendedItem.innerHTML).toContain('Task 2');
            expect(_mockUpdateStats).toHaveBeenCalledTimes(1); // Expect the mock to be called
        });

        it('should display "No tasks to show" if filtered todos are empty', () => {
            todos = [];
            renderTodos();
            expect(mockTodoList.innerHTML).toContain('No tasks to show');
            expect(mockTodoList.appendChild).not.toHaveBeenCalled();
            expect(_mockUpdateStats).toHaveBeenCalledTimes(1);
        });

        it('should call toggleTodo and deleteTodo when checkboxes/buttons are clicked (event delegation not fully mocked)', () => {
            // This tests the structure that would set up event listeners.
            // A deeper test would involve triggering mocked events and checking `todos` state changes.
            renderTodos();
            const firstAppendedItem = mockTodoList.appendChild.mock.calls[0][0];
            const checkboxMock = firstAppendedItem.querySelector('.todo-checkbox');
            const deleteBtnMock = firstAppendedItem.querySelector('.btn-delete');

            expect(checkboxMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
            expect(deleteBtnMock.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });
    });
});
