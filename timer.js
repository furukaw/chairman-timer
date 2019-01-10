(function () {
    'use strict';
    const body = document.body;
    const clockElement = document.getElementById("clock");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const resetButton = document.getElementById("reset");
    const decButton = document.getElementById("dec");
    const incButton = document.getElementById("inc");
    const minuteElement = document.getElementById("minute");
    const secondElement = document.getElementById("second");
    const times = [
        document.getElementById("time1"),
        document.getElementById("time2"),
        document.getElementById("time3")
    ];
    let running = false;  // true: 計ってる, false: 計ってない 
    let started = null;  // null: まだ始めてない, date: 測り始め
    let stopped = null;  // null: 止まってない, date: 止めた時刻
    let wasted = 0;  // 止めてた時間の合計 milisecond
    let froms = null;
    let tos = null;
    let blinking = false;
    let state = "w";
    let time = null;

    function toWhite() {
        body.style.backgroundColor = "#FFFFFF";
        clockElement.style.color = "#333333";
        state = "w";
    }

    function toBlack() {
        body.style.backgroundColor = "#000000";
        clockElement.style.color = "#CCCCCC"
        state = "b";
    }

    function blink() {
        if(state === "w") toBlack();
        else toWhite();
    }

    function niketa(n) {
        const int = Math.floor(n);
        if (int < 10) return "0" + int
        else return int;
    }

    function updateClock() {
        if(running) {
            const now = new Date();
            const seconds = Math.floor((now.getTime() - started.getTime() - wasted) / 1000);
            if (time !== seconds) {
                time = seconds;
                minuteElement.innerText = niketa(seconds / 60);
                secondElement.innerText = niketa(seconds % 60);
                if(!blinking) {
                    if(froms.indexOf(seconds) !== -1) {
                    blink();
                    blinking = true;
                    }
                } else {
                    blink();
                    if(tos.indexOf(seconds) !== -1) {
                        toWhite();
                        blinking = false;
                    }
                }
            }
        }
    }

    startButton.onclick = () => {
        if(!started) {
            started = new Date();
            running = true;
            setInterval(updateClock, 100);
            const minutesString = times.map(element => element.value);
            const minutes = minutesString.map(str => parseInt(str));
            tos = minutes.map(n => n * 60 + 1).filter(n => !isNaN(n));
            froms = tos.map(n => n - 11);
        } else if(!running) {
            const now = new Date();
            wasted += (now.getTime() - stopped.getTime());
            running = true;
            stopped = null;
        }
    }

    stopButton.onclick = () => {
        running = false;
        stopped = new Date();
    }

    resetButton.onclick = () => {
        toWhite();
        running = false;
        started = null;
        stopped = null;
        wasted = 0;
        froms = null;
        tos = null;
        blinking = false;
        time = null;
        minuteElement.innerText = "00";
        secondElement.innerText = "00";
    }

    decButton.onclick = () => {
        wasted += 1000;
    }

    incButton.onclick = () => {
        wasted -= 1000;
    }
})();
