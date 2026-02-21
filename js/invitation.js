// ====== CONFIG ======
const API_BASE = "https://emdeha2021.pythonanywhere.com/api/invitations";

// ====== GET URL PARAM ======
const pathParts = window.location.pathname.split("/");

// ====== GET SLUG FROM QUERY STRING ======
const queryString = window.location.search.substring(1); 
// hapus tanda "?"

if (!queryString) {
    alert("Link undangan tidak valid.");
}

// pisahkan berdasarkan "/"
const parts = queryString.split("/");

const invitationSlug = parts[0];
const guestSlug = parts[1];

if (!invitationSlug || !guestSlug) {
    alert("Format link salah.");
}

console.log("Invitation:", invitationSlug);
console.log("Guest:", guestSlug);

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

// ====== LOAD INVITATION DATA ======
async function loadInvitation() {
    try {
        const response = await fetch(
            `${API_BASE}/public/${invitationSlug}/${guestSlug}/`
        );

        if (!response.ok) {
            throw new Error("Undangan tidak ditemukan");
        }

        const data = await response.json();

        document.getElementById("guest-name").innerText = data.name;
        document.getElementById("guest-address").innerText = data.address || "";
        document.getElementById("invitation-title").innerText = data.invitation_title;
        document.getElementById("description").innerText = data.description;
        document.getElementById("event-date").innerText = formatDate(data.event_date);
        document.getElementById("location").innerText = data.location;
        
        // ===== AKAD =====
        if (data.akad_time) {
            document.getElementById("akad-section").style.display = "block";
            document.getElementById("akad-time").innerText =
                formatTime(data.akad_time) + " WIB";
        }

        // ===== RESEPSI =====
        if (data.reception_start_time && data.reception_end_time) {
            document.getElementById("reception-section").style.display = "block";
            document.getElementById("reception-time").innerText =
                formatTime(data.reception_start_time) +
                " - " +
                formatTime(data.reception_end_time) +
                " WIB";
        }

        if (data.rsvp_status !== "pending") {
            document.getElementById("rsvp-form").style.display = "none";
            document.getElementById("response-message").innerHTML =
                `<div class="alert alert-success">
                    Anda sudah melakukan konfirmasi: <strong>${data.rsvp_status}</strong>
                </div>`;
        }

    } catch (error) {
        alert(error.message);
    }
}

// ====== SUBMIT RSVP ======
document.getElementById("rsvp-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("rsvp-status").value;
    const guestCount = document.getElementById("guest-count").value;
    const message = document.getElementById("message").value;

    const response = await fetch(
        `${API_BASE}/public/${invitationSlug}/${guestSlug}/rsvp/`,
        {
            method: "POST",
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
        document.getElementById("response-message").innerHTML =
            `<div class="alert alert-success">${result.message}</div>`;
        document.getElementById("rsvp-form").reset();
    } else {
        document.getElementById("response-message").innerHTML =
            `<div class="alert alert-danger">${result.error}</div>`;
    }
});

// Load data saat halaman dibuka
loadInvitation();
