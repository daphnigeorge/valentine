/* --------------------- Heartbeat word sync --------------------- */
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
    if (audio) audio.play();
    if (message) message.style.opacity = 1;

    // ~70 BPM heartbeat → 860ms between beats
    beatInterval = setInterval(addWordOnBeat, 860);
}

function addWordOnBeat() {
    if (!message) return;

    if (lineIndex >= lines.length) {
        clearInterval(beatInterval);

        // show button after short pause
        setTimeout(() => {
            if (nextBtn) {
                nextBtn.style.opacity = 1;
                nextBtn.style.pointerEvents = "auto";
            }
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

// next button redirects to ECG page
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        document.body.style.transition = "opacity 1.2s";
        document.body.style.opacity = 0;

        setTimeout(() => {
            window.location.href = "ecg.html";
        }, 1200);
    });
}

/* --------------------- Rhythm → Spotify Embed --------------------- */

// Map heartbeat identifiers to Spotify track IDs (embed previews)
const rhythmTracks = {
    "normal": "0T5iIrXA4p5GsubkhuBIKV?si=b0cd28b238824b9f",
    "tachy": "5CQ30WqJwcep0pYcV4AMNc",
    "brady": "4RVwu0g32PAqgUiJoXOk4j",
    "accelerated": "2cGgO1v5cRr6YjhxXw9eN6",
    "atrial": "3MHaRzls7E4EUnkTnE7y3y",
    "afib": "6rqhFgbbKwnb9MLmUQDhG6",
    "flutter": "1hKdDCpiI9mqz1jVHRKG0E",
    "pac": "0TnOYISbd1XYRBk9myaseg",
    "pvc": "3n3Ppam7vgaVa1iaRUc9Lp",
    "vtach": "6KT8x5oqZJn4Wv6jK9N6jv",
    "wandering": "1lDWb6b6ieDQ2xT7ewTC3G",
    "multifocal": "3twNvmDtFQtAd5gMKedhLD"
};

// Function to display Spotify embed for selected rhythm
function playEmbed(rhythmId, trackId) {
    // Remove any existing embeds
    document.querySelectorAll('.embed-container iframe').forEach(e => e.remove());

    // Insert new iframe in the matching container
    const container = document.getElementById(`embed-${rhythmId}`);
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
    iframe.width = "300";
    iframe.height = "80";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";
    container.appendChild(iframe);
} 