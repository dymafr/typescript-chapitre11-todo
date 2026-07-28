import type { Todo } from './interfaces/todo.interface';
import './style/style.css';

const queryRequiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Élément DOM introuvable : ${selector}`);
  }

  return element;
};

const ul = queryRequiredElement<HTMLUListElement>('ul');
const form = queryRequiredElement<HTMLFormElement>('form');
const input = queryRequiredElement<HTMLInputElement>('form > input');

form.addEventListener('submit', (event: Event): void => {
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

const todos: Todo[] = [
  {
    text: 'Faire du JavaScript',
    done: true,
    editMode: false
  }
];

const displayTodo = (): void => {
  const todosNode: HTMLLIElement[] = todos.map((todo: Todo, index: number) => {
    if (todo.editMode) {
      return createTodoEditElement(todo, index);
    }

    return createTodoElement(todo, index);
  });
  ul.innerHTML = '';
  ul.append(...todosNode);
};

const createTodoElement = (todo: Todo, index: number): HTMLLIElement => {
  const li: HTMLLIElement = document.createElement('li');
  const buttonDelete: HTMLButtonElement = document.createElement('button');
  buttonDelete.textContent = 'Supprimer';
  buttonDelete.classList.add('danger');
  const buttonEdit: HTMLButtonElement = document.createElement('button');
  buttonEdit.textContent = 'Edit';
  buttonEdit.classList.add('primary');
  buttonDelete.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    deleteTodo(index);
  });
  buttonEdit.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    toggleEditMode(index);
  });
  const status = document.createElement('span');
  status.classList.add('todo');
  status.classList.toggle('done', todo.done);
  const text = document.createElement('p');
  text.textContent = todo.text;
  text.classList.toggle('done', todo.done);
  li.addEventListener('click', () => {
    toggleTodo(index);
  });
  li.append(status, text, buttonEdit, buttonDelete);
  return li;
};

const createTodoEditElement = (todo: Todo, index: number): HTMLLIElement => {
  const li: HTMLLIElement = document.createElement('li');
  const editInput: HTMLInputElement = document.createElement('input');
  editInput.type = 'text';
  editInput.value = todo.text;
  editInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      editTodo(index, editInput);
    }
  });
  const buttonSave = document.createElement('button');
  buttonSave.textContent = 'Save';
  buttonSave.classList.add('success');
  const buttonCancel = document.createElement('button');
  buttonCancel.textContent = 'Cancel';
  buttonCancel.classList.add('danger');
  buttonCancel.addEventListener('click', event => {
    event.stopPropagation();
    toggleEditMode(index);
  });
  buttonSave.addEventListener('click', () => {
    editTodo(index, editInput);
  });
  li.append(editInput, buttonSave, buttonCancel);
  setTimeout(() => editInput.focus(), 0);
  return li;
};

const addTodo = (text: string): void => {
  text = text.trim();
  if (text) {
    todos.push({
      text: `${text.charAt(0).toUpperCase()}${text.slice(1)}`,
      done: false,
      editMode: false
    });
    displayTodo();
  }
};

const deleteTodo = (index: number): void => {
  todos.splice(index, 1);
  displayTodo();
};

const toggleTodo = (index: number): void => {
  const todo = todos[index];
  if (!todo) {
    return;
  }

  todo.done = !todo.done;
  displayTodo();
};

const toggleEditMode = (index: number): void => {
  const todo = todos[index];
  if (!todo) {
    return;
  }

  todo.editMode = !todo.editMode;
  displayTodo();
};

const editTodo = (index: number, input: HTMLInputElement): void => {
  const todo = todos[index];
  if (!todo) {
    return;
  }

  const value = input.value;
  todo.text = value;
  todo.editMode = false;
  displayTodo();
};

displayTodo();
