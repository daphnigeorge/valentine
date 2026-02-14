const audio = document.getElementById("beat");
const message = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");

// grouped lines for word-by-word heartbeat sync
const lines = [
    ["My", "heart"],
    ["always", "beats", "for"],
    ["you"]
];

let lineIndex = 0;
let wordIndex = 0;
let beatInterval;

// start experience on first click
document.body.addEventListener("click", startExperience, { once: true });

function startExperience() {
    audio.play();
    message.style.opacity = 1;

    // ~70 BPM heartbeat → 860ms between beats
    beatInterval = setInterval(addWordOnBeat, 860);
}

function addWordOnBeat() {
    if (lineIndex >= lines.length) {
        clearInterval(beatInterval);

        // show button after short pause
        setTimeout(() => {
            nextBtn.style.opacity = 1;
            nextBtn.style.pointerEvents = "auto";
        }, 900);

        return;
    }

    const currentLine = lines[lineIndex];

    message.innerHTML += currentLine[wordIndex] + " ";

    wordIndex++;

    // move to next line when done
    if (wordIndex >= currentLine.length) {
        message.innerHTML += "<br>";
        wordIndex = 0;
        lineIndex++;
    }
}

nextBtn.addEventListener("click", () => {
    // fade out everything
    document.body.style.transition = "opacity 1.2s";
    document.body.style.opacity = 0;

    // after fade, redirect to next page
    setTimeout(() => {
        window.location.href = "ecg.html";
    }, 1200);
});
