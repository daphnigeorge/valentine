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

/* --------------------- Spotify Login --------------------- */
const clientId = "a7f13b5dd0bc4822b1f911f9235914ec"; // Spotify dashboard
const redirectUri = "https://daphnigeorge.github.io/valentine/callback.html";

const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-modify-playback-state",
    "user-read-playback-state"
];

// Only attach listener if the button exists
const spotifyLoginBtn = document.getElementById("spotifyLogin");
if (spotifyLoginBtn) {
    spotifyLoginBtn.addEventListener("click", () => {
        const authUrl =
            "https://accounts.spotify.com/authorize?" +
            "response_type=code" +
            "&client_id=" + encodeURIComponent(clientId) +
            "&scope=" + encodeURIComponent(scopes.join(" ")) +
            "&redirect_uri=" + encodeURIComponent(redirectUri) +
            "&show_dialog=true";

        window.location.href = authUrl;
    });
}

/* --------------------- Rhythm → Spotify Track --------------------- */

// Map heartbeat identifiers to Spotify URIs
const rhythmTracks = {
    normal: "spotify:track:2TpxZ7JUBn3uw46aR7qd6V", // replace with NSR song
    tachy: "spotify:track:5CQ30WqJwcep0pYcV4AMNc", // tachycardia
    brady: "spotify:track:4RVwu0g32PAqgUiJoXOk4j", // bradycardia
    // add your other rhythms here
};

let player;
let accessToken = localStorage.getItem("spotify_access_token");

async function setupSpotifyPlayer() {
    if (!accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: "Valentine Heartbeats",
            getOAuthToken: cb => { cb(accessToken); },
            volume: 0.5
        });

        player.connect();
    };
}

// Call once page loads
setupSpotifyPlayer();

async function selectRhythm(rhythm) {
    const trackUri = rhythmTracks[rhythm];
    if (!trackUri) return alert("No track set for this rhythm!");
    if (!player) return alert("Spotify not connected. Please log in.");

    await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });

    console.log(`Playing ${rhythm} track...`);
}
