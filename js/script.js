'use strict';

class Todo {
   constructor(form, input, todoList, todoCompleted) {
      this.form = document.querySelector(form);
      this.input = document.querySelector(input);
      this.todoList = document.querySelector(todoList);
      this.todoCompleted = document.querySelector(todoCompleted);
      this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
   }

   addToStorage() {
      localStorage.setItem('toDoList', JSON.stringify([... this.todoData]));
   }

   render() {
      this.todoList.textContent = '';
      this.todoCompleted.textContent = '';
      this.todoData.forEach(this.createItem, this);
      this.addToStorage();
   }

   createItem(todo, key) {
      const li = document.createElement('li');
      li.classList.add('todo-item');
      li.key = key;
      li.insertAdjacentHTML('beforeend', `
         <span class="text-todo">${todo.value}</span>
         <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
            <button class="todo-edit"></button>
         </div>
      `);

      if (todo.completed) {
         this.todoCompleted.append(li);
      } else {
         this.todoList.append(li);
      }
      this.input.value = '';
      return key;
   }
   
   addTodo(key) {
      if (this.input.value.trim()) {
         const newTodo = {
            value: this.input.value,
            completed: false,
         };
         this.todoData.set(key, newTodo);
         this.createItem(this.todoData, key);
         this.render();
      }
   }

   generateKey() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
   }

   deleteItem(elem) {
      this.todoData.forEach((item, i) => {
         if (elem.key === i) {
            this.todoData.delete(i);
         }
      });
      this.render();
   }

   completedItem(elem) {
      this.todoData.forEach((item, i) => {
         if (elem.key === i) {
            if (item.completed) {
               item.completed = false;
            } else {
               item.completed = true;
            }
         }
      });
      this.render();
   }

   editItem(elem) {
      const obj = this.todoData.get(elem.key);
      const textTodo = elem.querySelector('.text-todo');
      textTodo.setAttribute('contenteditable', true);
      textTodo.focus();
      textTodo.addEventListener('blur', () => {
         textTodo.contenteditable = false;
         const editTodo = {
            value: textTodo.textContent,
            completed: obj.completed,
         };
         this.todoData.set(elem.key, editTodo);
         this.render();
      });
   }

   animate(elem) {
      elem.style.cssText = 'opacity: 0; transition-duration: 0.5s';
   }

   handler() {
      const todoContainer = document.querySelector('.todo-container');
   
      todoContainer.addEventListener('click', (event) => {
         const target = event.target;
         const targetParent = target.parentNode.parentNode;

         if (target.matches('.todo-remove')) {
            this.animate(targetParent);
            setTimeout(() => {
               this.deleteItem(targetParent);
            }, 500);
         }

         if (target.matches('.todo-complete')) {
            this.animate(targetParent);
            setTimeout(() => {
               this.completedItem(targetParent);
            }, 500);
         }
         
         if (target.matches('.todo-edit')) {
            this.editItem(targetParent);
         }
      });
   }

   init() {
      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         const key = this.input.value.trim() ? this.generateKey() : false;
         key ? this.addTodo(key) : false;
      });
      this.handler();
      this.render();
   }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();