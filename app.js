// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter todos
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTodos());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    clearCompletedTodos() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Clear todo list
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.textContent = this.currentFilter === 'all' 
                ? 'No todos yet. Add one above!' 
                : `No ${this.currentFilter} todos.`;
            this.todoList.appendChild(emptyState);
        } else {
            // Render todos
            filteredTodos.forEach(todo => {
                const todoItem = this.createTodoElement(todo);
                this.todoList.appendChild(todoItem);
            });
        }

        // Update task count
        const activeTodos = this.todos.filter(todo => !todo.completed);
        const count = activeTodos.length;
        this.taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} remaining`;

        // Show/hide clear completed button
        const hasCompleted = this.todos.some(todo => todo.completed);
        this.clearCompleted.style.display = hasCompleted ? 'block' : 'none';
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some sample todos for demonstration (only if no todos exist)
document.addEventListener('DOMContentLoaded', () => {
    const existingTodos = JSON.parse(localStorage.getItem('todos'));
    if (!existingTodos || existingTodos.length === 0) {
        const sampleTodos = [
            { id: 1, text: "Welcome to your Todo App!", completed: false, createdAt: new Date().toISOString() },
            { id: 2, text: "Try adding a new task", completed: false, createdAt: new Date().toISOString() },
            { id: 3, text: "Mark tasks as complete by checking them", completed: true, createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('todos', JSON.stringify(sampleTodos));
    }
});