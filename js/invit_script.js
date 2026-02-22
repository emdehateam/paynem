const coverScreen = document.getElementById("coverScreen");
const mainContent = document.getElementById("mainContent");
const openBtn = document.getElementById("openInvitation");

document.body.classList.add("no-scroll");

// MUSIC CONTROL
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;
// music.play();
// musicBtn.addEventListener("click", function() {
//     if (isPlaying) {
//         music.pause();
//         musicBtn.innerText = "🔇";
//     } else {
//         music.play();
//         musicBtn.innerText = "🔊";
//     }
//     isPlaying = !isPlaying;
// });
openBtn.addEventListener("click", function() {

    // Play music
    // music.play().catch(() => {});
    if (isPlaying) {
        music.pause();
        musicBtn.innerText = "🔇";
    } else {
        music.play();
        musicBtn.innerText = "🔊";
    }
    isPlaying = !isPlaying;

    // Fade out cover
    coverScreen.classList.add("fade-out");

    setTimeout(() => {
        coverScreen.style.display = "none";
        mainContent.style.display = "block";
        document.body.classList.remove("no-scroll");
    }, 1000);

});

// const API_BASE = "http://127.0.0.1:8000/api";
const API_BASE = "https://emdeha2021.pythonanywhere.com/api/invitations";

const query = window.location.search.substring(1);
const parts = query.split('/');
const invitationSlug = parts[0];
const guestSlug = parts[1];



document.addEventListener("DOMContentLoaded", function() {

    // Load Invitation
    fetch(`${API_BASE}/public/${invitationSlug}/${guestSlug}/`)
    .then(res => res.json())
    .then(data => {

        console.log(document.getElementById("guestName"));
        const invitation_titleEl = document.getElementById("invitation_title");
        if (invitation_titleEl) invitation_titleEl.innerText = data.invitation_title;
        // document.getElementById("invitation_title").innerText = data.invitation_title;
        const akad_timeEl = document.getElementById("akad_time");
        if (akad_timeEl) akad_timeEl.innerText = `${formatDate(data.event_date)} | Pukul ${formatTime(data.akad_time)} WIB`;
        console.log("mempelai: "+akad_timeEl);
        // document.getElementById("akadTime").innerText =
        //     `${formatDate(data.event_date)} | Pukul ${formatTime(data.akad_time)} WIB`;

        const resepsi_timeE3 = document.getElementById("resepsi_time");
        if (resepsi_timeE3) resepsi_timeE3.innerText = `Mulai pukul ${formatTime(data.reception_start_time)} WIB & sampai pukul ${formatTime(data.reception_end_time)} WIB`;
        // document.getElementById("resepsiTime").innerText =
            

        const locationE4 = document.getElementById("location");
        if (locationE4) locationE4.innerText = data.location;
        // document.getElementById("location").innerText = data.location;
        document.getElementById("mapsLink").href = data.google_maps;

        startCountdown(data.event_date);
    });

    // Load Guest
    fetch(`${API_BASE}/public/${invitationSlug}/${guestSlug}/`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("guestName").innerText = data.name;
        document.getElementById("guestNameInvitation").innerText = data.description;
        document.getElementById("guestAddress").innerText = data.address;
    });

});

// Helper format date dan time
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function formatTime(timeString) {
    if (!timeString) return "";
    return timeString.substring(0,5); // ambil HH:MM saja
}

// Countdown
function startCountdown(date) {
    const target = new Date(date).getTime();
    const interval = setInterval(() => {

        const now = new Date().getTime();
        const diff = target - now;

        if (diff < 0) {
            document.getElementById("countdown").innerText =
                "Hari Bahagia Telah Tiba 💍";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));

        document.getElementById("countdown").innerText =
            `${days} Hari ${hours} Jam ${minutes} Menit`;
    }, 1000);
}

// RSVP
// document.addEventListener("submit", function(e){
//     if(e.target && e.target.id === "rsvpForm") {
//         e.preventDefault();

//         fetch(`${API_BASE}/public/${invitationSlug}/${guestSlug}/rsvp/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 rsvp_status: document.getElementById("attendanceStatus").value,
//                 guest_count: document.getElementById("guestCount").value,
//                 message: document.getElementById("message").value
//             })
//         })
//         .then(res => res.json())
//         .then(() => {
//             alert("Terima kasih atas konfirmasi Anda 💕");
//         });
//     }
// });

let rsvpExists = false;

fetch(`${API_BASE}/public/${invitationSlug}/${guestSlug}/rsvp/`)
.then(res => {
    if (res.ok) {
        rsvpExists = true;
        return res.json();
    }
    throw new Error("No RSVP yet");
})
.then(data => {
    document.getElementById("attendanceStatus").value = data.rsvp_status;
    document.getElementById("guestCount").value = data.guest_count;
    document.getElementById("message").value = data.message;
})
.catch(() => {});
// ====== SUBMIT RSVP ======
document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("attendanceStatus").value;
    const guestCount = document.getElementById("guestCount").value;
    const message = document.getElementById("message").value;
    const method = rsvpExists ? "PATCH" : "POST";

    const response = await fetch(
        `${API_BASE}/public/${invitationSlug}/${guestSlug}/rsvp/`,
        {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rsvp_status: status,
                guest_count: guestCount,
                message: message
            })
        }
    );

    const result = await response.json();

    if (response.ok) {
        alert("Reservasi berhasil, ditunggu kedatangan anda!");
        // document.getElementById("response-message").innerHTML =
        //     `<div class="alert alert-success">${result.message}</div>`;
        document.getElementById("rsvpForm").reset();
    } else {
        alert("Anda sudah reservasi sebelumnya!");
        // document.getElementById("response-message").innerHTML =
        //     `<div class="alert alert-danger">${result.error}</div>`;
    }
});

