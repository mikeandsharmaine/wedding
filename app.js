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

const result = await searchGuest(name);

console.log("API Response:", result);

const guests = result.guests;

App.party = guests;          // <-- THIS IS MISSING
App.editMode = result.editMode;

console.log("Guests:");
console.log(guests);

console.log("Edit Mode:");
console.log(App.editMode);

// Check if already submitted
if (App.editMode) {

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

console.log("Edit Mode:", App.editMode);
console.log("App.party:", App.party);
function renderInvitationSummary() {

    const party = App.party;

    if (!party || party.length === 0) {
        renderWelcomePage();
        return;
    }

    const pageTitle = App.editMode
        ? "Update Your RSVP"
        : "Welcome!";

    const heading = App.editMode
        ? party[0].FirstName
        : party[0].PartyName;

    const introText = App.editMode
        ? `
            <strong>You're updating your RSVP.</strong><br>
            Feel free to review and update your response below if your plans have changed.
        `
        : `
            We're so honored to celebrate with your family.
            Please let us know who will be joining us.
        `;

    document.getElementById("app").innerHTML = `

        <h1>${pageTitle}</h1>

        <h2>${heading}</h2>

        <p>${introText}</p>

        ${party.map((guest, index) => {

            const initials = guest.GuestName
                .split(" ")
                .map(n => n[0])
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

                            <label class="switch">

                                <input
                                    type="checkbox"
                                    id="guest${index}"
                                    ${guest.RSVP === "Joyfully Attending" ? "checked" : ""}
                                    onchange="toggleAttendance(${index})">

                                <span class="slider"></span>

                            </label>

                            <span
                                class="attendance-text"
                                id="status${index}">

                                ${
                                    guest.RSVP === "Joyfully Attending"
                                    ? "Joyfully Attending 💚"
                                    : "Unable to Attend 🤍"
                                }

                            </span>

                        </div>

                    </div>

                </div>

            `;

        }).join("")}

        <div class="submit-area">

            <button onclick="continueToContact()">

                ${App.editMode ? "Update RSVP" : "Continue"}

            </button>

        </div>

    `;

}
function renderContactPage() {

    document.getElementById("app").innerHTML = `

        <h1>${App.editMode ? "Update Contact Details" : "Almost Done"}</h1>

        <p>

            ${
                App.editMode
                ? "Please confirm or update your contact details before saving your updated RSVP."
                : "Please provide your contact details."
            }

        </p>

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
            rows="4"
            placeholder="Share a note with the couple..."></textarea>

        <button
            id="submitBtn"
            onclick="submitRSVP()">

            ${
                App.editMode
                ? "Update RSVP"
                : "Confirm RSVP"
            }

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

console.log("Submit Result:", result);

if (result.success) {

    celebrateRSVP();

    setTimeout(() => {

        renderThankYouPage();

        App.editMode = false;
        App.party = [];

    }, 800);

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
function transitionTo(nextPage) {

    const app = document.getElementById("app");

    app.classList.add("fade-out");

    setTimeout(() => {

        nextPage();

        app.classList.remove("fade-out");
        app.classList.add("fade-in");

        setTimeout(() => {

            app.classList.remove("fade-in");

        },300);

    },250);

}
function celebrateRSVP() {

    // Left burst
    confetti({
        particleCount: 120,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: [
            "#7E8E65",
            "#C5C69E",
            "#EFC770",
            "#EFDECD",
            "#D58A58"
        ]
    });

    // Right burst
    confetti({
        particleCount: 120,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: [
            "#7E8E65",
            "#C5C69E",
            "#EFC770",
            "#EFDECD",
            "#D58A58"
        ]
    });

    // Center shower
    setTimeout(() => {

        confetti({
            particleCount: 180,
            spread: 120,
            origin: { y: 0.6 },
            colors: [
                "#7E8E65",
                "#C5C69E",
                "#EFC770",
                "#EFDECD",
                "#D58A58"
            ]
        });

    },300);

}
function createHeart() {

    const heart = document.createElement("div");

    heart.className = "floating-heart";

const icons = ["🤍", "✨", "🌸"];

heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    
    heart.style.left = Math.random() * 100 + "vw";

    heart.style.animationDuration =
        (4 + Math.random() * 4) + "s";

    document.body.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    },8000);

}
function renderThankYouPage() {

    const isUpdate = App.editMode;

    document.getElementById("app").innerHTML = `

        <div class="thank-you-page">

            <h1>
                ${isUpdate ? "RSVP Updated!" : "Thank You!"}
            </h1>

            <h2>
                ${
                    App.party && App.party.length
                        ? App.party[0].FirstName
                        : ""
                }
            </h2>

            <p>
                ${
                    isUpdate
                        ? "Your RSVP has been successfully updated. We can't wait to celebrate with you!"
                        : "Your RSVP has been received. We can't wait to celebrate with you!"
                }
            </p>

            <p class="thank-you-note">
                January 15, 2027 • Tagaytay
            </p>

            <button onclick="renderWelcomePage()">
                Done
            </button>

        </div>

    `;

    // Floating hearts

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
