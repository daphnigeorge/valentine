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

// Map heartbeat identifiers to Spotify URIs (example songs)
const rhythmTracks = {
    "normal": "spotify:track:0T5iIrXA4p5GsubkhuBIKV", // Normal Sinus Rhythm ~75 BPM
    "tachy": "spotify:track:5CQ30WqJwcep0pYcV4AMNc", // Sinus tachycardia
    "brady": "spotify:track:4RVwu0g32PAqgUiJoXOk4j", // Sinus bradycardia
    "accelerated": "spotify:track:2cGgO1v5cRr6YjhxXw9eN6", // Accelerated junctional rhythm
    "atrial": "spotify:track:3MHaRzls7E4EUnkTnE7y3y", // Atrial rhythm
    "afib": "spotify:track:6rqhFgbbKwnb9MLmUQDhG6", // Atrial fibrillation
    "flutter": "spotify:track:1hKdDCpiI9mqz1jVHRKG0E", // Atrial flutter
    "pac": "spotify:track:0TnOYISbd1XYRBk9myaseg", // Premature atrial contractions
    "pvc": "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp", // Premature ventricular contractions
    "vtach": "spotify:track:6KT8x5oqZJn4Wv6jK9N6jv", // Ventricular tachycardia
    "wandering": "spotify:track:1lDWb6b6ieDQ2xT7ewTC3G", // Wandering pacemaker
    "multifocal": "spotify:track:3twNvmDtFQtAd5gMKedhLD", // Multifocal atrial tachycardia

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
