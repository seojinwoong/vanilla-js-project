;(function(){
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    const $todo_list_wrapper = get('.todo_list_wrapper');
    const $all_counts = get('.all_counts .con');
    const $todo_form = get('form');
    const $insert_todo_content = get('.insert_todo_content');

    const API_URL = `http://localhost:3000/todos`;

    const createTodoEl = (todo) => {
        const { content, completed, id } = todo;
        const isChecked = completed ? 'checked' : '';
        const $todo_list_section = document.createElement('section');
        $todo_list_section.classList.add('todo_list_section', 'standard_mode');
        $todo_list_section.dataset.todoid = id;

        $todo_list_section.innerHTML = `
            <article class="left_sector">
                <div class="standard_mode">
                    <input type="checkbox" class="done_check" ${isChecked}>
                    <p class="todo_list_name">${content}</p>
                </div>
                <div class="update_mode"><input type="text" class="update_inputs" value="${content}"></div>
            </article>
            <article class="right_sector">
                <div class="standard_mode">
                    <i class="fa-solid fa-pen update_todo"></i>
                    <i class="fa-solid fa-trash delete_todo"></i>
                </div>
                <div class="update_mode">
                    <i class="fa-solid fa-check update_todo_done"></i>
                    <i class="fa-solid fa-xmark cancel_update_todo"></i>
                </div>
            </article>
        `
        return $todo_list_section;
    }

    const renderAllTodos = (todos) => {
        $todo_list_wrapper.innerHTML = '';
        todos.forEach(todo => {
            const todoEl = createTodoEl(todo);
            $todo_list_wrapper.prepend(todoEl);
        });
        $all_counts.innerText = todos.length;
    }

    const getAllTodos = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(todos => renderAllTodos(todos))
            .catch(error => console.error('getAllTodos Error!', error));
    };

    const insertTodo = (e) => {
        e.preventDefault();
        if (!$insert_todo_content.value) return;
        
        const todoCon = { content: $insert_todo_content.value, completed: false };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(todoCon)
        })
            .then(response => response.json())
            .then(getAllTodos)
            .then(() => {
              $insert_todo_content.value = '';
              $insert_todo_content.focus();  
            })
            .catch(error => console.error(error.message));
    }

    const updateTodo = (e) => {
        if (e.target.classList.contains('update_todo')) {
            $todo_list_wrapper.querySelectorAll('.todo_list_section').forEach(todo_list => {
                todo_list.classList.replace('update_mode', 'standard_mode');
                const resetText = todo_list.querySelector('.todo_list_name').textContent;
                todo_list.querySelector('.update_inputs').value = resetText;
            });
            const clickedTodo = e.target.closest('.todo_list_section');
            clickedTodo.classList.replace('standard_mode', 'update_mode');
        }
    }

    const updateDoneTodo = (e) => {
        if (e.target.classList.contains('update_todo_done')) {
            const clickedTodo = e.target.closest('.todo_list_section');
            const todoIdx = clickedTodo.dataset.todoid;
            const updateTodoCon = clickedTodo.querySelector('.update_inputs').value;
            
            fetch(`${API_URL}/${todoIdx}`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ content: updateTodoCon })
            })
            .then(response => response.json())
            .then(getAllTodos)
            .catch(error => console.error(error));
        }
    } 

    const updateCancelTodo = (e) => {
        if (e.target.classList.contains('cancel_update_todo')) {
            const clickedTodo = e.target.closest('.todo_list_section');
            const resetText = clickedTodo.querySelector('.todo_list_name').textContent;
            clickedTodo.classList.replace('update_mode', 'standard_mode');
            clickedTodo.querySelector('.update_inputs').value = resetText;
        }
    }
    
    const toggleTodo = (e) => {
        if (e.target.classList.contains('done_check')) {
            const clickedTodo = e.target.closest('.todo_list_section');
            const todoIdx = clickedTodo.dataset.todoid;
            const completed = e.target.checked;
            
            fetch(`${API_URL}/${todoIdx}`, {
                method: "PATCH",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ completed })
            }).then(response => response.json())
              .then(getAllTodos)
              .catch(error => console.error(error.message))
        }
    }

    const removeTodo = (e) => {
        if (e.target.classList.contains('delete_todo')) {
            const clickedTodo = e.target.closest('.todo_list_section');
            const todoIdx = clickedTodo.dataset.todoid;

            fetch(`${API_URL}/${todoIdx}`, {
                method: "DELETE"
            }).then(response => response.json())
              .then(getAllTodos)
              .catch(error => console.log(error.message))
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        getAllTodos();
        $todo_form.addEventListener('submit', insertTodo);
        $todo_list_wrapper.addEventListener('click', updateTodo);
        $todo_list_wrapper.addEventListener('click', updateDoneTodo);
        $todo_list_wrapper.addEventListener('click', updateCancelTodo);
        $todo_list_wrapper.addEventListener('click', toggleTodo);
        $todo_list_wrapper.addEventListener('click', removeTodo);
    });

})()