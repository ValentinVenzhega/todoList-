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

   createItem(todo) {
      const li = document.createElement('li');
      li.classList.add('todo-item');
      li.key = todo.key,
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
   }
   
   addTodo(e) {
      e.preventDefault();
      if (this.input.value.trim()) {
         const newTodo = {
            value: this.input.value,
            completed: false,
            key: this.generateKey(),
         };
         this.todoData.set(newTodo.key, newTodo);
         this.render();
      }
   }

   generateKey() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
   }

   deleteItem(elem) {
      this.todoData.forEach(item => {
         if (elem.key === item.key) {
            this.todoData.delete(item.key);
         }
      });
      this.render();
   }

   completedItem(elem) {
      this.todoData.forEach(item => {
         if (elem.key === item.key) {
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
      elem = elem.querySelector('.text-todo');
      elem.setAttribute('contenteditable', true);
      elem.focus();
      elem.onblur = () => {
         elem.setAttribute('contenteditable', false);
      };
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
      this.form.addEventListener('submit', this.addTodo.bind(this));
      this. handler();
      this.render();
   }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();


