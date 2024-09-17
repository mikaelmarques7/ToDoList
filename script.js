document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const categorySelect = document.getElementById('category-select');
    const progressBar = document.querySelector('.progress');
    const lightModeIcon = document.getElementById('light-mode');
    const darkModeIcon = document.getElementById('dark-mode');
    const currentDate = document.getElementById('current-date');
    const currentTime = document.getElementById('current-time');
    

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };


    const updateProgressBar = () => {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
        document.querySelector('.progress-text').textContent = `${Math.round(progressPercent)}%`
    };



    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add(task.category);
            li.classList.toggle('completed', task.completed);

            let categoryLabel;
            if (task.category === 'work') {
                categoryLabel = 'Trabalho'
            } else if(task.category === 'personal'){
                categoryLabel = 'Pessoal'
            } else if (task.category === 'study'){
                categoryLabel = 'Estudos'
            }

            if (task.isEditing) {
                li.innerHTML = `
                <span class="task-category">${categoryLabel}</span>
                <div class="edit-container">
                <input class="edit-input" type="text" value="${task.text}">
                </div>
                <div class="buttons">
                <button class="save-btn" onclick="saveEdit(${index})"><i class="fas fa-save"></i></button>
                <button class="cancel-btn" onclick="cancelEdit(${index})"><i class="fas fa-times"></i></button>
                </div>`;

            }else{
                li.innerHTML = `
                <span class="task-category">${categoryLabel}</span>
                <span class="task-text">${task.text}</span>
                <div class="buttons">
                <button class="check-btn" onclick="toggleComplete(${index})"><i class="fas fa-check"></i></button>
                <button class="edit-btn" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="removeTask(${index})"><i class="fas fa-trash"></i></button>
                </div>`
            }

            taskList.appendChild(li);
        });
        updateProgressBar();
    }

    const addTask = () => {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') {
            alert('Por favor adicione uma tarefa');
            return
        }

        tasks.push({text: taskText, category: category, completed: false});
        taskInput.value = '';
        saveTasks();
        renderTasks();
    };

    window.toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };


    window.removeTask = (index) => {
        const li = taskList.children[index];
        li.classList.add('remove');

        setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        }, 300)
    };

    window.editTask = (index) => {
        tasks[index].isEditing = true;
        renderTasks()
    }

    window.saveEdit = (index) => {
        const li = taskList.children[index];
        const editInput = li.querySelector('.edit-input');
        const newText = editInput ? editInput.value.trim() : '';

        if (newText) {
            tasks[index].text = newText;
            tasks[index].isEditing = false;
            saveTasks();
            renderTasks();
        }
    };

    window.cancelEdit = (index) => {
        tasks[index].isEditing = false;
        renderTasks();
    }


    const toggleTheme = () => {
        const isDarkMode = document.body.getAttribute('data-theme') === 'dark';


        if (isDarkMode) {
            document.body.setAttribute('data-theme', 'light');
            darkModeIcon.style.display = 'inline';
            lightModeIcon.style.display = 'none';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            darkModeIcon.style.display = 'none';
            lightModeIcon.style.display = 'inline';
        }

    }


    themeToggle.addEventListener('click', toggleTheme);


    if (document.body.getAttribute('data-theme') === 'dark') {
        lightModeIcon.style.display = 'inline';
        darkModeIcon.style.display = 'none';
    } else {
        lightModeIcon.style.display = 'none';
        darkModeIcon.style.display = 'inline';
    }

    renderTasks();
    setInterval(() => {
        const now = new Date();
        currentDate.textContent = now.toLocaleDateString();
        currentTime.textContent = now.toLocaleTimeString();
    }, 1000);

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    })


    taskList.addEventListener('click', function(e){
        if (e.target.classList.contains('delete-btn')) {
            const taskIndex = [...taskList.children].indexOf(e.target.parentElement);
            removetask(taskIndex)
        }
    })
})