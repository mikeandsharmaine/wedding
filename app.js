// ========================================
// Mike & Sharmaine Wedding RSVP
// ========================================

const App = {

    party: [],

    editMode: false,

    apiUrl: "https://script.google.com/macros/s/AKfycbyZNzIYT8Vp1zopvc_PANgV5XBeINll9oBiK4FA83tUeutjj6EpvJJhwMxdO6TjH0di/exec"

};
async function searchGuest(name) {

    const response = await fetch(
        `${App.apiUrl}?action=search&name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
        throw new Error("Unable to connect to RSVP server.");
    }

    return await response.json();

}

// -------------------------------
// Initial Page
// -------------------------------

function renderWelcomePage() {

App.party = [];
App.editMode = false;

    document.getElementById("app").innerHTML = `
    

        <h1>Mike & Sharmaine</h1>

        <h2>Wedding RSVP</h2>

        <div class="countdown">

    <div id="daysRemaining" class="count-number">...</div>

    <div class="count-label">
        Days Until We Say "I Do"
    </div>

</div>

<p class="welcome-text">
    Please enter your name exactly as it appears on your invitation.
</p>

        <input
            id="guestName"
            type="text"
            placeholder="Enter your name">

        <button onclick="findGuest()">
    View My Invitation
</button>

        <div class="divider"></div>

        <div class="footer">

            Kindly respond on or before

            <br><br>

            <strong>December 15, 2026</strong>

            <br><br>

            For assistance, please contact

            <br>

            <strong>Sharmaine Fernandez</strong>

            <br>

            0917 804 5576

        </div>

    `;
updateCountdown();
}

// -------------------------------
// Search Button
// -------------------------------

async function findGuest() {

    const btn = document.querySelector("button");

    btn.disabled = true;
    btn.innerHTML = "⏳ Searching...";

    const name = document.getElementById("guestName").value.trim();

    if (name === "") {

    alert("Please enter your name.");

    btn.disabled = false;
btn.innerHTML = "View My Invitation";

    return;

}

    try {

        console.log("1. Searching...");

        const guests = await searchGuest(name);

if (!guests || guests.length === 0) {

    alert("Sorry, we couldn't find your invitation.\n\nPlease check the spelling of your name.");

    btn.disabled = false;
    btn.innerHTML = "View My Invitation";

    return;
}

App.party = guests;

console.log("RSVP Submitted:", guests[0].RSVPSubmitted);

// Check if already submitted
if (guests[0].RSVPSubmitted === "Submitted") {

    const update = confirm(
`We've already received your RSVP.

Would you like to update it?`
    );

   if (!update) {

    App.party = [];
    App.editMode = false;

    renderWelcomePage();

    return;
}
        App.editMode = true;

}
renderInvitationSummary();

console.log("5. Finished");

    } catch (error) {

    console.error(error);

    btn.disabled = false;
btn.innerHTML = "View My Invitation";

    alert(error.message);

}
}

// -------------------------------

window.onload = renderWelcomePage;
function renderInvitationSummary() {

    const party = App.party;

    document.getElementById("app").innerHTML = `
        <h1>Welcome!</h1>

        <h2>${party[0].PartyName}</h2>

        <p>We're so honored to celebrate with your family. Please let us know who will be joining us.</p>

        ${party.map((guest, index) => {

            const initials = guest.GuestName
                .split(" ")
                .map(name => name[0])
                .join("")
                .substring(0,2)
                .toUpperCase();

            return `
                <div class="guest-card">

                    <div class="guest-icon">
                        ${initials}
                    </div>

                    <div class="guest-details">

                        <h3>${guest.GuestName}</h3>

                      <div class="attendance-toggle">

   ${
    guest.RSVPSubmitted === "Submitted" && !App.editMode
    ? `
        <div class="confirmed-badge">
            ✅ Already Confirmed
        </div>
    `
    : `
        <label class="switch">

            <input
    type="checkbox"
    id="guest${index}"
    ${guest.RSVP === "Yes" ? "checked" : ""}
    onchange="toggleAttendance(${index})">

            <span class="slider"></span>

        </label>

        <span
    class="attendance-text"
    id="status${index}">
    ${
        guest.RSVP === "No"
            ? "Unable to Attend 🤍"
            : "Joyfully Attending 💚"
    }
</span>
    `
}

</div>

                    </div>

                </div>
            `;

        }).join("")}

    <div class="submit-area">
    <button onclick="continueToContact()">
        Continue
    </button>
</div>
`;

}
function renderContactPage() {

    document.getElementById("app").innerHTML = `

        <h1>Almost Done</h1>

        <p>Please provide your contact details.</p>

        <input
            id="mobile"
            type="tel"
            placeholder="Mobile Number">

        <input
            id="email"
            type="email"
            placeholder="Email Address (Optional)">

        <label class="field-label">
    Leave a Message (Optional)
</label>

<textarea
    id="message"
    rows="5"
    placeholder="Share your well wishes with Mike & Sharmaine...">
</textarea>

      <button id="submitBtn" onclick="submitRSVP()">
    Confirm RSVP
</button>

    `;
    
}
async function submitRSVP() {

    const btn = document.getElementById("submitBtn");

    btn.disabled = true;
    btn.innerHTML = "♡ Saving your RSVP...";

    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const guests = App.party.map(guest => ({
        GuestName: guest.GuestName,
        RSVP: guest.RSVP
    }));

    try {

        const response = await fetch(
            `${App.apiUrl}?action=submit`
            + `&invitationId=${encodeURIComponent(App.party[0].InvitationID)}`
            + `&mobile=${encodeURIComponent(mobile)}`
            + `&email=${encodeURIComponent(email)}`
            + `&message=${encodeURIComponent(message)}`
            + `&guests=${encodeURIComponent(JSON.stringify(guests))}`
        );

        const result = await response.json();

        console.log(result);

if (result.success) {

    App.editMode = false;

    // Clear the current invitation
    App.party = [];

    renderThankYouPage();

        } else {

            alert(result.error || "Unable to submit RSVP.");

            btn.disabled = false;
            btn.innerHTML = "Confirm RSVP";

        }

    } catch (error) {

        console.error(error);

        btn.disabled = false;
        btn.innerHTML = "Confirm RSVP";

        alert("Unable to submit RSVP.");

    }

}
function continueToContact() {

    App.party.forEach((guest, index) => {

        guest.RSVP = document.getElementById(`guest${index}`).checked
    ? "Joyfully Attending"
    : "Unable to Attend";

    });

    renderContactPage();

}
function toggleAttendance(index) {

    const checkbox = document.getElementById(`guest${index}`);
    const status = document.getElementById(`status${index}`);

    if (checkbox.checked) {

        status.textContent = "Joyfully Attending 💚";
        status.style.color = "#7E8E65";

    } else {

        status.textContent = "Unable to Attend";
        status.style.color = "#999";

    }

}
function renderThankYouPage() {

    document.getElementById("app").innerHTML = `

        <h1>Thank You!</h1>

        <h2>Your RSVP has been received.</h2>

        <p>
            We are so excited to celebrate this special day with you.
        </p>

        <div class="divider"></div>

        <p>
            See you on
            <br><br>
            <strong>January 15, 2027</strong>
            <br>
            Fruella's Events Place
            <br>
            Tagaytay
        </p>

    `;

}
function showLoading(message = "Please wait...") {

    const overlay = document.getElementById("loadingOverlay");

    overlay.style.display = "flex";

    overlay.querySelector("h2").innerText = message;

}

function hideLoading() {

    document.getElementById("loadingOverlay").style.display = "none";

}
// -------------------------------
// Wedding Countdown
// -------------------------------

function updateCountdown() {

    const weddingDate = new Date(2027, 0, 15); // January = 0

    const today = new Date();

    // Remove the time portion
    today.setHours(0,0,0,0);
    weddingDate.setHours(0,0,0,0);

    const diff = weddingDate - today;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const element = document.getElementById("daysRemaining");

    console.log("Countdown element:", element);
    console.log("Days:", days);

    if (element) {
        element.textContent = days;
    }

}
// -------------------------------
// Floating Watercolor Petals
// -------------------------------

const floatingItems = [
    "images/petal1.png",
    "images/petal1.png",
    "images/petal2.png",
    "images/petal2.png",
    "images/petal3.png",
    "images/petal3.png",
    "images/leaf1.png",
    "images/leaf2.png"
];

function createPetal() {

    const petal = document.createElement("img");

    petal.className = "petal";

    petal.src =
        floatingItems[Math.floor(Math.random() * floatingItems.length)];

    // Start slightly outside the screen
    petal.style.left = (-5 + Math.random() * 110) + "vw";

    // More natural size variation
    petal.style.width =
        (22 + Math.random() * 28) + "px";

    // Slower falling
    petal.style.animationDuration =
        (18 + Math.random() * 12) + "s";

    // Random delay
    petal.style.animationDelay =
        Math.random() * 3 + "s";

    // Slight transparency
    petal.style.opacity =
        0.30 + Math.random() * 0.40;

    // Stronger side drift
    petal.style.setProperty(
        "--drift",
        (Math.random() * 240 - 120) + "px"
    );

    // Less spinning
    petal.style.setProperty(
        "--rotate",
        (Math.random() * 360 - 180) + "deg"
    );

    document.getElementById("petals").appendChild(petal);

    petal.addEventListener("animationend", () => {
        petal.remove();
    });

}

setInterval(() => {

    const count = Math.random() < 0.25 ? 3 :
                  Math.random() < 0.60 ? 2 : 1;

    for (let i = 0; i < count; i++) {
        setTimeout(createPetal, i * 180);
    }

}, 1800);
console.log("Petal script loaded");
function renderAlreadySubmittedPage() {

    document.getElementById("app").innerHTML = `

        <h1>Thank You!</h1>

        <h2>Your RSVP has already been received.</h2>

        <p>
            Our records show that your RSVP has already been submitted.
        </p>

        <div class="divider"></div>

        <p>
            If you need to make changes, please contact
            <br><br>
            <strong>Sharmaine Fernandez</strong>
            <br>
            0917 804 5576
        </p>

    `;

}
