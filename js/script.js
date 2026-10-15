// --- 1. LIGHT / DARK MODE & CUSTOM NAME (CHALLENGE) ---
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
let isDark = localStorage.getItem('theme') === 'dark';

if (isDark) htmlEl.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const userNameEl = document.getElementById('user-name');
userNameEl.textContent = localStorage.getItem('username') || 'User';
userNameEl.addEventListener('blur', () => {
    localStorage.setItem('username', userNameEl.textContent);
});
userNameEl.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') { e.preventDefault(); userNameEl.blur(); }
});

// --- 2. GREETING & CLOCK ---
function updateClock() {
    const now = new Date();
    document.getElementById('time-display').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const hour = now.getHours();
    let greeting = 'Evening';
    if (hour >= 5 && hour < 12) greeting = 'Morning';
    else if (hour >= 12 && hour < 18) greeting = 'Afternoon';
    document.getElementById('greeting-time').textContent = greeting;
}
setInterval(updateClock, 1000);
updateClock();

// --- 3. FOCUS TIMER ---
let timerInterval;
let timeLeft = 25 * 60;
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

document.getElementById('start-btn').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) { timeLeft--; updateTimerDisplay(); } 
            else { clearInterval(timerInterval); timerInterval = null; alert('Focus time is up!'); }
        }, 1000);
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// --- 4. TO-DO LIST (WITH PREVENT DUPLICATES CHALLENGE) ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
                <span>${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    
    // Prevent duplicate tasks
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert('This task already exists!');
        return;
    }

    tasks.push({ text, done: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
});

window.toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

window.deleteTask = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};
renderTasks();

// --- 5. QUICK LINKS ---
let links = JSON.parse(localStorage.getItem('links')) || [];
const linksContainer = document.getElementById('links-container');

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = "_blank";
        a.className = 'link-badge';
        a.innerHTML = `${link.name} <button class="remove-link" onclick="event.preventDefault(); deleteLink(${index})">&times;</button>`;
        linksContainer.appendChild(a);
    });
}

document.getElementById('add-link-btn').addEventListener('click', () => {
    const name = document.getElementById('link-name').value.trim();
    let url = document.getElementById('link-url').value.trim();
    if (!name || !url) return;
    
    if (!url.startsWith('http')) url = 'https://' + url;
    
    links.push({ name, url });
    localStorage.setItem('links', JSON.stringify(links));
    document.getElementById('link-name').value = '';
    document.getElementById('link-url').value = '';
    renderLinks();
});

window.deleteLink = (index) => {
    links.splice(index, 1);
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
};
renderLinks();