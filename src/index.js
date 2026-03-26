import './style/style.css';
const ul = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('form > input');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    addTodo(value);
});
document.addEventListener('keydown', event => {
    const todo = todos.find(t => t.editMode);
    if (event.key === 'Escape' && todo) {
        todo.editMode = false;
        displayTodo();
    }
});
const todos = [
    {
        text: 'Faire du JavaScript',
        done: true,
        editMode: false
    }
];
const displayTodo = () => {
    const todosNode = todos.map((todo, index) => {
        if (todo.editMode) {
            return createTodoEditElement(todo, index);
        }
        else {
            return createTodoElement(todo, index);
        }
    });
    ul.innerHTML = '';
    ul.append(...todosNode);
};
const createTodoElement = (todo, index) => {
    const li = document.createElement('li');
    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = 'Supprimer';
    buttonDelete.classList.add('danger');
    const buttonEdit = document.createElement('button');
    buttonEdit.innerHTML = 'Edit';
    buttonEdit.classList.add('primary');
    buttonDelete.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTodo(index);
    });
    buttonEdit.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleEditMode(index);
    });
    li.innerHTML = `
    <span class="todo ${todo.done ? 'done' : ''}"></span>
    <p>${todo.text}</p>
  `;
    li.addEventListener('click', () => {
        toggleTodo(index);
    });
    li.append(buttonEdit, buttonDelete);
    return li;
};
const createTodoEditElement = (todo, index) => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            editTodo(index, input);
        }
    });
    const buttonSave = document.createElement('button');
    buttonSave.innerHTML = 'Save';
    buttonSave.classList.add('success');
    const buttonCancel = document.createElement('button');
    buttonCancel.innerHTML = 'Cancel';
    buttonCancel.classList.add('danger');
    buttonCancel.addEventListener('click', event => {
        event.stopPropagation();
        toggleEditMode(index);
    });
    buttonSave.addEventListener('click', _ => {
        editTodo(index, input);
    });
    li.append(input, buttonSave, buttonCancel);
    setTimeout(() => input.focus(), 0);
    return li;
};
const addTodo = (text) => {
    text = text.trim();
    if (text) {
        todos.push({
            text: `${text[0].toUpperCase()}${text.slice(1)}`,
            done: false,
            editMode: false
        });
        displayTodo();
    }
};
const deleteTodo = (index) => {
    todos.splice(index, 1);
    displayTodo();
};
const toggleTodo = (index) => {
    todos[index].done = !todos[index].done;
    displayTodo();
};
const toggleEditMode = (index) => {
    todos[index].editMode = !todos[index].editMode;
    displayTodo();
};
const editTodo = (index, input) => {
    const value = input.value;
    todos[index].text = value;
    todos[index].editMode = false;
    displayTodo();
};
displayTodo();
