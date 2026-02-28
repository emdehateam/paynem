const coverScreen = document.getElementById("coverScreen");
const mainContent = document.getElementById("mainContent");
const openBtn = document.getElementById("openInvitation");

// MUSIC CONTROL
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false; // status musik

// disable scroll saat cover muncul
document.body.classList.add("no-scroll");


// Tombol pause/play
musicBtn.addEventListener("click", function () {
    if (isPlaying) {
        music.pause();
        musicBtn.innerText = "🔇";
    } else {
        music.play().catch(() => {}); // handle autoplay block
        musicBtn.innerText = "🔊";
    }
    isPlaying = !isPlaying;
});

// Tombol buka undangan
openBtn.addEventListener("click", function () {
    // Main music play otomatis saat buka undangan
    if (!isPlaying) {
        music.play().catch(() => {}); // beberapa browser blok autoplay
        musicBtn.innerText = "🔊";
        isPlaying = true;
    }

    // Fade out cover
    coverScreen.classList.add("fade-out");

    setTimeout(() => {
        coverScreen.style.display = "none";
        mainContent.style.display = "block";
        document.body.classList.remove("no-scroll");
    }, 1000);
});


// const API_BASE = "http://127.0.0.1:8000/api/invitations";
const API_BASE = "https://emdeha2021.pythonanywhere.com/api/invitations";

const query = window.location.search.substring(1);
const parts = query.split('/');
const invitationSlug = parts[0];
const guestSlug = parts[1];

let global_date = '';

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
        if (akad_timeEl) akad_timeEl.innerText = `${formatDate(data.event_date)} Pukul ${formatTime(data.akad_time)} WIB`;
        console.log("mempelai: "+akad_timeEl);
        // document.getElementById("akadTime").innerText =
        //     `${formatDate(data.event_date)} | Pukul ${formatTime(data.akad_time)} WIB`;

        const resepsi_timeE3 = document.getElementById("resepsi_time");
        if (resepsi_timeE3) resepsi_timeE3.innerText = `Pukul ${formatTime(data.reception_start_time)} WIB - Pukul ${formatTime(data.reception_end_time)} WIB`;
        // document.getElementById("resepsiTime").innerText =

        // countdown time date
        const countdown_timeEl = document.getElementById("countdown_time");
        if (countdown_timeEl) countdown_timeEl.innerText = `${formatDate(data.event_date)}`;
        console.log("mempelai: "+countdown_timeEl);
            

        const locationE4 = document.getElementById("location");
        if (locationE4) locationE4.innerText = data.location;
        // document.getElementById("location").innerText = data.location;
        document.getElementById("mapsLink").href = data.google_maps;

        console.log("targetDateCountdown: ", data.event_date);
        global_date = data.event_date;
    });
    // startCountdown(data.event_date);
    // const targetDateCountdown = new Date(data.event_date).getTime();
    // setInterval(updateCountdown, 1000);
    // updateCountdown(targetDateCountdown);

    // Load Guest
    fetch(`${API_BASE}/public/${invitationSlug}/${guestSlug}/`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("guestName").innerText = data.name;
        document.getElementById("guestNameInvitation").innerText = data.name;
        document.getElementById("guestAddress").innerText = data.address;
        document.getElementById("invitation_title_guest").innerText = data.description;
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
// function startCountdown(date) {
//     const target = new Date(date).getTime();
//     const interval = setInterval(() => {

//         const now = new Date().getTime();
//         const diff = target - now;

//         if (diff < 0) {
//             document.getElementById("countdown").innerText =
//                 "Hari Bahagia Telah Tiba 💍";
//             clearInterval(interval);
//             return;
//         }

//         const days = Math.floor(diff / (1000*60*60*24));
//         const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
//         const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         document.getElementById("countdown").innerText =
//             `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
//     }, 1000);
// }
function updateCountdown() {

    console.log("countdown dates: ", global_date);
    const eventDateTime = new Date(global_date).getTime();
    const targetDate = eventDateTime;
    console.log("target Date:", targetDate);
    const now = new Date().getTime();
    const gap = targetDate - now;

    const d = Math.floor(gap / (1000*60*60*24));
    const h = Math.floor((gap / (1000*60*60)) % 24);
    const m = Math.floor((gap / (1000*60)) % 60);
    const s = Math.floor((gap / 1000) % 60);

    document.getElementById("countdown").innerHTML = `
        <div class="countdown-item">
            <div class="countdown-number">${d}</div>
            <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number">${h}</div>
            <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number">${m}</div>
            <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number">${s}</div>
            <div class="countdown-label">Seconds</div>
        </div>
    `;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// updateCountdown();


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

const video = document.getElementById("weddingVideo");

const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }

    });
}, { threshold: 0.6 });

videoObserver.observe(video);

window.onload = function() {
    const container = document.getElementById('flower-container');
    const flowerTypes = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐'];
    
    // Tentukan jumlah total bunga yang ingin dimunculkan sekaligus
    const jumlahBunga = 40; 

    for (let i = 0; i < jumlahBunga; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Memilih karakter bunga secara acak
        flower.innerText = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        
        // Mengatur posisi horizontal (0-100% lebar layar)
        flower.style.left = Math.random() * 100 + 'vw';
        
        // Mengatur ukuran acak (20px - 40px)
        flower.style.fontSize = Math.random() * 20 + 20 + 'px';
        
        // Durasi terbang (antara 4 sampai 8 detik)
        const duration = Math.random() * 4 + 4;
        flower.style.animationDuration = duration + 's';
        
        // Jeda muncul acak agar terlihat natural (0 sampai 2 detik)
        flower.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(flower);

        // Menghapus elemen dari DOM setelah animasi selesai agar ringan
        setTimeout(() => {
            flower.remove();
        }, (duration + 2) * 1000);
    }
};


