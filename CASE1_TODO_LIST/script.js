;(function(){
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    const $todo_list_wrapper = get('.todo_list_wrapper');
    const $all_counts = get('.all_counts .con');

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
            $todo_list_wrapper.appendChild(todoEl);
        });
        $all_counts.innerText = todos.length;
    }

    const getAllTodos = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(todos => renderAllTodos(todos))
            .catch(error => console.error('getAllTodos Error!', error));
    };

    window.addEventListener('DOMContentLoaded', () => {
        getAllTodos();

    });

})()