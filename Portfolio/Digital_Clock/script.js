const time = document.getElementById('time');
const date = document.getElementById('date');
const toggle_action = document.querySelector('.toggle-action');
const toggle_function = document.querySelector('.toggle-function');
const case_color = document.getElementById('case-color');
const display_color = document.getElementById('display-color');
const digit_color = document.getElementById('digits-color');
const btn_color = document.getElementById('btn-color');
const text_color = document.getElementById('text-color');

let is24Hour = true;
let stopwatchMode = false;
let stopwatchRunning = false;
let stopwatchMinutes = 0;
let stopwatchSeconds = 0;
let stopwatchTenth = 0;
let stopwatchReset = true;

toggle_function.addEventListener('click', () => {
    stopwatchMode = !stopwatchMode;
    toggle_function.textContent = stopwatchMode ? 'stopwatch' : 'clock';
    if (!stopwatchMode) {
        toggle_action.textContent = is24Hour ? '24H' : '12H';
    }
    else {
        toggle_action.textContent = 'start';
        stopwatchReset = true;
        stopwatchRunning = false;
        stopwatchMinutes = 0;
        stopwatchSeconds = 0;
        stopwatchTenth = 0;
        updateStopwatch();
    }
});

toggle_action.addEventListener('click', () => {
    if (!stopwatchMode) {
        is24Hour = !is24Hour;
        toggle_action.textContent = is24Hour ? '24H' : '12H';
    }
    else {
        // if pressed reset
        if (!stopwatchReset && !stopwatchRunning) {
            toggle_action.textContent = 'start';
            stopwatchReset = true;
            stopwatchRunning = false;
            stopwatchMinutes = 0;
            stopwatchSeconds = 0;
            stopwatchTenth = 0;
            updateStopwatch();
        }
        // if pressed start
        else if (stopwatchReset && !stopwatchRunning) {
            toggle_action.textContent = 'stop';
            stopwatchRunning = true;
        }
        // if pressed stop
        else if (stopwatchRunning) {
            toggle_action.textContent = 'reset';
            stopwatchReset = false;
            stopwatchRunning = false;
        }
    }
});

function updateStopwatch() {
    if(stopwatchRunning) stopwatchTenth++;
    if (stopwatchTenth >= 10) {
        stopwatchTenth = 0;
        stopwatchSeconds++
    };
    if (stopwatchSeconds >= 60) {
        stopwatchSeconds = 0;
        stopwatchMinutes++
    };
    if (stopwatchMinutes >= 59) {
        stopwatchMinutes = 59;
        stopwatchSeconds = 59;
        stopwatchTenth = 9;
        toggle_action.textContent = 'reset';
        stopwatchReset = false;
        stopwatchRunning = false;
    };
    time.textContent = 
        `${stopwatchMinutes.toString().padStart(2, '0')}:` +
        `${stopwatchSeconds.toString().padStart(2, '0')}:` +
        `${stopwatchTenth.toString().padStart(1, '0')}`;
};

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (!is24Hour) {
        hours = hours % 12 || 12;
    }
    time.textContent = 
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;
    date.textContent = now.toLocaleDateString();
        
}

const root = document.documentElement;

document.getElementById('case-color').addEventListener('input', (e) => {
    root.style.setProperty('--case-color', e.target.value);
});

document.getElementById('display-color').addEventListener('input', (e) => {
    root.style.setProperty('--display-color', e.target.value);
});

document.getElementById('digits-color').addEventListener('input', (e) => {
    root.style.setProperty('--digits-color', e.target.value);
});

document.getElementById('btn-color').addEventListener('input', (e) => {
    root.style.setProperty('--btn-color', e.target.value);
});

document.getElementById('text-color').addEventListener('input', (e) => {
    root.style.setProperty('--text-color', e.target.value);
});


// Update loop
setInterval(() => {
    if (stopwatchMode) updateStopwatch();
    else updateClock();
}, 100);
