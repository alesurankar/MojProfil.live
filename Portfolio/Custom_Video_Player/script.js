let videoContainer = document.querySelector(".video-container");
let container = document.querySelector(".container");
let myVideo = document.getElementById("my-video");
let rotateContainer = document.querySelector(".rotate-container");
let videoControls = document.querySelector(".controls");
let playButton = document.getElementById("play-btn");
let pauseButton = document.getElementById("pauseButton");
let volume = document.getElementById("volume");
let volumeRange = document.getElementById("volume-range");
let volumeNum = document.getElementById("volume-num");
let high = document.getElementById("high");
let low = document.getElementById("low");
let mute = document.getElementById("mute");
let sizeScreen = document.getElementById("size-screen");
let screenCompress = document.getElementById("screen-compress");
let screenExpand = document.getElementById("screen-expand");
const currentProgress = document.getElementById("current-progress");
const currentTimeRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const progressBar = document.getElementById("progress-bar");
const playbackSpeedButton = document.getElementById("playback-speed-btn");
const playbackContainer = document.querySelector(".playback");
const playbackSpeedOptions = document.querySelector(".playback-options");

function slider() {
    valPercent = (volumeRange.value / volumeRange.max) * 100;
    volumeRange.style.background = `linear-gradient(to right, #2887e3 ${valPercent}%, #000000 ${valPercent}%)`;
}

// events object
let events = {
    mouse: {
        click: "click",
    },
    touch: {
        click: "touchstart",
    },
};

let deviceType = "";

// Detech touch device
const isTouchDevice = () => {
    try {
        // We try to create TouchEvent (it would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch(e) {
        deviceType = "mouse";
        return false;
    }
};

// play and pause button
playButton.addEventListener("click", () => {
    myVideo.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

pauseButton.addEventListener("click", (pauseVideo = () => {
    myVideo.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
}));

//playback
playbackContainer.addEventListener("click", () => {
    playbackSpeedOptions.classList.remove("hide");
});

// if user clicks outside or on the option
window.addEventListener("click", (e) => {
    if(!playbackContainer.contains(e.target)) {
        playbackSpeedOptions.classList.add("hide");
    }
    else if (playbackSpeedOptions.contains(e.target)) {
        playbackSpeedOptions.classList.add("hide");
    }
});

// playback speed
const setPlayback = (value) => {
    playbackSpeedButton.innerHTML = value + "x";
    myVideo.playbackRate = value;
};

// mute video
const muter = () => {
    mute.classList.remove("hide");
    high.classList.add("hide");
    low.classList.add("hide");
    myVideo.volume = 0;
    volumeNum.innerHTML = 0;
    volumeRange.value = 0;
    slider();
};

// when user clicks on high and low volume then mute the audio
high.addEventListener("click", muter);
low.addEventListener("click", muter);

// for volume
volumeRange.addEventListener("input", () => {
    // for converting % to decimalvalues since video.volume would accept decimal only
    let volumeValue = volumeRange.value /100;
    myVideo.volume = volumeValue;
    volumeNum.innerHTML = volumeRange.value;
    // mute icon, low volume, high volume icons
    if(volumeRange.value < 50) {
        low.classList.remove("hide");
        high.classList.add("hide");
        mute.classList.add("hide");
    }
    else if(volumeRange.value > 50) {
        low.classList.add("hide");
        high.classList.remove("hide");
        mute.classList.add("hide");
    }
});

// Screen size
screenExpand.addEventListener("click", () => {
    screenCompress.classList.remove("hide");
    screenExpand.classList.add("hide");
    videoContainer
    .requestFullscreen()
    .catch((err) => alert("Your device doesn't support full screen API"));
    if(isTouchDevice()) {
        let screenOrientation = 
        screen.orientation || screen.
        mozOrientation || screen.msOrientation;
        if(screenOrientation.type == "portrait-primary") {
            // update styling for fullscreen
            pauseVideo();
            rotateContainer.classList.remove("hide");
            const myTimeout = setTimeout(() => {
                rotateContainer.classList.add("hide");
            }, 3000);
        }
    }
});

// if user aapresses escape the browser fire 'fullscreenchange' event
document.addEventListener("fullscreenchange", exitHandler);       // Standard
document.addEventListener("webkitfullscreenchange", exitHandler); // Chrome, Safari
document.addEventListener("mozfullscreenchange", exitHandler);    // Firefox
document.addEventListener("MSFullscreenChange", exitHandler);     // IE / Edge (legacy)

function exitHandler() {
    // if fullscreen is closed
    if(
        !document.fullscreenElement &&
        !document.webkitIsFullscreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
    ) {
        normalScreen();
    }
}

// back to normal screen
screenCompress.addEventListener(
    "click", 
    (normalScreen = () => {
        screenCompress.classList.add("hide");
        screenExpand.classList.remove("hide");
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    })
);

// Format time
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};

// Update progress every second
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(myVideo.currentTime);
    currentProgress.style.width = ((myVideo.currentTime / myVideo.duration) * 100).toFixed(3) + "%";

}, 1000);

// Update timer
myVideo.addEventListener("timeupdate", () => {
    currentTimeRef.innerHTML = timeFormatter(myVideo.currentTime);
});

// If user click on progress bar
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
    // start of progressbar
    let coordStart = progressBar.getBoundingClientRect().left;
    // mouse click position
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
    // set width to progress
    currentProgress.style.width = progress * 100 + "%";
    // set time
    myVideo.currentTime = progress * myVideo.duration;
    // play
    myVideo.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

window.onload = () => {
    // display duration
    myVideo.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(myVideo.duration);
    };
    slider();
};