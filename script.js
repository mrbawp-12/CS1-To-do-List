const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const notification = document.getElementById('notification');

// không bị mất task khi load
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//let tasks = [];
let editingTaskId = null;

displayTasks();
//thêm công việc khi ấn nút và enter
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Vui lòng nhập công việc!');
        return;
    }
    
//tạo công việc mới
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);   
    saveTasks();
    displayTasks();
    
//thông báo đã thêm
    showNotification(`Đã thêm <strong>"${taskText}"</strong> vào danh sách`);
    
//xóa nội dung trong ô
    taskInput.value = '';
}

function displayTasks() {
    if (editingTaskId !== null) return;

    taskList.innerHTML = '';

    for (const task of tasks) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox"
                       ${task.completed ? 'checked' : ''}
                       onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Xóa</button>
            </div>
        `;

        taskList.appendChild(li);
    }
}
//đánh dấu
function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    
    saveTasks();
    displayTasks();
    
    const task = tasks.find(t => t.id === id);
    if (task.completed) {
        showNotification(`Đã hoàn thành <strong>"${task.text}"</strong>`, 'complete');
    }
}

function deleteTask(id) {
    const task = tasks.find(function(t) {
        return t.id === id;
    });
    
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    
    saveTasks();
    displayTasks();
    //thông báo xóa
    showNotification(`Đã xóa <strong>"${task.text}"</strong> khỏi danh sách`, 'delete');
}

function editTask(id) {
    editingTaskId = id;
    const task = tasks.find(function(t) {
        return t.id === id;
    });
    
    const li = document.querySelector(`[data-id="${id}"]`);

    const oldText = task.text;
    
//chế độ sửa
    li.innerHTML = `
        <div class="task-content">
            <input type="text" class="edit-input" value="${task.text}" id="editInput-${id}">
        </div>
        <div class="task-actions">
            <button class="save-btn" onclick="saveEdit(${id}, '${oldText.replace(/'/g, "\\'")}')">Lưu</button>
            <button class="cancel-btn" onclick="cancelEdit()">Hủy</button>
        </div>
    `;
    
    const editInput = document.getElementById(`editInput-${id}`);
    editInput.focus();
    editInput.select();
    
}

function saveEdit(id, oldText) {
    const editInput = document.getElementById(`editInput-${id}`);
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Vui lòng nhập nội dung công việc!');
        return;
    }
    
    if (newText === oldText) {
        cancelEdit();
        return;
    }
    
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            task.text = newText;
        }
        return task;
    });
    
    saveTasks();    
    editingTaskId = null;
    displayTasks();
    
    // Hiển thị thông báo
    showNotification(`Đã cập nhật <strong>"${newText}"</strong>`, 'update');
}

function cancelEdit() {
    editingTaskId = null;
    displayTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showNotification(message, type = 'success') {
    const icon = '<span class="notification-icon"></span>';
    
    notification.innerHTML = icon + '<span>' + message + '</span>';
    notification.className = 'notification show';
    
    // Thêm class tùy theo loại thông báo
    if (type === 'delete') {
        notification.classList.add('delete');
    } else if (type === 'update') {
        notification.classList.add('update');
    } else if (type === 'complete') {
        notification.classList.add('complete');
    }
    
//ấn thông báo
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}