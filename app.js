// ========================================
// Mike & Sharmaine Wedding RSVP
// ========================================

const App = {

    party: [],

    editMode: false,

    apiUrl: "https://script.google.com/macros/s/AKfycbyZNzIYT8Vp1zopvc_PANgV5XBeINll9oBiK4FA83tUeutjj6EpvJJhwMxdO6TjH0di/exec"

};

let pendingParty = [];
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
function renderProgress(step){

    return `

        <div class="progress-wrapper">

            <div class="progress-dots">

                ${[0,1,2,3].map(i=>`

                    <div class="progress-item">

                        <div class="progress-circle ${
                            i <= step ? "active" : ""
                        }"></div>

                        ${
                            i<3
                            ? `<div class="progress-bar ${
                                i < step ? "active" : ""
                              }"></div>`
                            : ""
                        }

                    </div>

                `).join("")}

            </div>

            <div class="progress-text">

                Step ${step+1} of 4

            </div>

        </div>

    `;

}

function renderWelcomePage() {

    App.party = [];
    App.editMode = false;

    document.getElementById("app").innerHTML = `

        ${renderProgress(0)}

        <h1>Mike & Sharmaine</h1>

        <h2>Wedding RSVP</h2>

        <div class="countdown">
            <div id="daysRemaining" class="count-number">...</div>

            <div class="count-label">
                ARAW BAGO ANG AMING PAG-IISANG DIBDIB
            </div>
        </div>

        <p class="welcome-text">
            Pakilagay ang inyong pangalan nang eksakto tulad ng nakalagay sa inyong imbitasyon.
        </p>

        <input
            id="guestName"
            type="text"
            placeholder="Ilagay ang inyong pangalan">

        <button onclick="findGuest()">
            Tingnan ang Aking Imbitasyon
        </button>

        <div class="divider"></div>

        <div class="rsvp-footer">

            <p class="info-text">
                Mangyaring mag-RSVP bago o sa
                <strong>Disyembre 15, 2026.</strong>
            </p>

            <div class="divider"></div>
            
<p class="contact-intro">
    Kung kailangan ninyo ng tulong, maaari pong makipag-ugnayan kay
</p>

<p class="contact-name">
    Sharmaine Fernandez
</p>

<p class="contact-phone">
    0917 804 5576
</p>

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
    btn.innerHTML = "⏳ Hinahanap...";

    const name = document.getElementById("guestName").value.trim();

    if (name === "") {

alert("Pakilagay ang inyong pangalan.");
        
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
        pendingParty = guests;
App.editMode = result.editMode;

console.log("Guests:");
console.log(guests);

console.log("Edit Mode:");
console.log(App.editMode);

// Check if already submitted
if (App.editMode) {

    console.log("About to show modal...");

btn.disabled = false;
btn.innerHTML = "View My Invitation";

showUpdateModal();
return;
    }
        transitionTo(renderInvitationSummary);

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
        ? "I-update ang Iyong RSVP"
        : "Para sa Iyo";

    const heading = App.editMode
        ? party[0].FirstName
        : party[0].PartyName;

    const introText = App.editMode
        ? `
        <h1 class="update-rsvp-title">
    I-update ang Iyong RSVP, ${guestName}
</h1>

<p class="update-description">
    Maaari mong baguhin ang iyong sagot kung nagbago ang iyong mga plano.
</p>
        : `
            Isang malaking karangalan para sa amin na makasama kayo sa aming espesyal na araw.
        `;

    document.getElementById("app").innerHTML = `

        ${renderProgress(1)}

        <h1>${pageTitle}</h1>

        <h2>${heading}</h2>

        <p>${introText}</p>

        <p class="guest-instruction">
            Mangyaring piliin ang tugon ng bawat inaanyayahan.
        </p>

        <div class="guest-list">

            ${party.map((guest, index) => {

                const attending =
                    guest.RSVP === "Joyfully Attending";

                return `
    <div
        class="guest-card"
        onclick="toggleGuest(${index})"
    >

        <!-- Guest Name -->
        <div class="guest-details">
            <h3>${guest.GuestName}</h3>
        </div>

        <!-- Toggle -->
        <div class="attendance-toggle">

            <label
                class="switch"
                onclick="event.stopPropagation()"
            >
                <input
                    type="checkbox"
                    id="guest${index}"
                    ${guest.RSVP === "Joyfully Attending" ? "checked" : ""}
                    onchange="toggleAttendance(${index})"
                >

                <span class="slider"></span>
            </label>

            <span
                class="attendance-text"
                id="status${index}"
            >
                ${
                    guest.RSVP === "Joyfully Attending"
                        ? "Masayang Makakadalo 💚"
                        : "Hindi Makakadalo 🤍"
                }
            </span>

        </div>

    </div>
`;
            }).join("")}

        </div>

        <div class="submit-area">

            <button onclick="continueToContact()">
                ${App.editMode ? "I-update ang RSVP" : "Magpatuloy"}
            </button>

        </div>

    `;

}
function renderContactPage() {

    document.getElementById("app").innerHTML = `

        ${renderProgress(2)}

        <h1 class="contact-update-title">
    I-update ang Detalye sa Pakikipag-ugnayan
</h1>

        <p>

            ${
                App.editMode
                ? "Pakikumpirma o i-update ang inyong mga detalye sa pakikipag-ugnayan bago i-save ang inyong na-update na RSVP."
                : "Pakibigay ang inyong mga detalye sa pakikipag-ugnayan."
            }

        </p>

        <input
            id="mobile"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="Numero ng Mobile">

        <input
            id="email"
            type="email"
            autocomplete="email"
            autocapitalize="off"
            spellcheck="false"
            placeholder="Email Address (Opsyonal)">

        <label class="field-label">
            Mag-iwan ng Mensahe
        </label>

        <textarea
            id="message"
            rows="4"
            autocapitalize="sentences"
            placeholder="Ibahagi ang inyong pagbati at mensahe para kina Mike at Sharmaine…"></textarea>

        <button
            id="submitBtn"
            onclick="submitRSVP()">

            ${
                App.editMode
                ? "I-update ang RSVP"
                : "Kumpirmahin ang RSVP"
            }

        </button>

    `;

}
async function submitRSVP() {

    const btn = document.getElementById("submitBtn");

    btn.disabled = true;
    btn.innerHTML = "♡ Sine-save ang inyong RSVP…";

    const mobile = document.getElementById("mobile").value.trim();
const email = document.getElementById("email").value.trim();
const message = document.getElementById("message").value.trim();

if (message === "") {

    alert("Mag-iwan ng mensahe bago kumpirmahin ang inyong RSVP.");

    btn.disabled = false;
    btn.innerHTML = "Kumpirmahin ang RSVP";

    document.getElementById("message").focus();

    return;
}

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

        transitionTo(renderThankYouPage);

    },800);

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

transitionTo(renderContactPage);
    
}
function toggleAttendance(index) {

    const checkbox = document.getElementById(`guest${index}`);
    const status = document.getElementById(`status${index}`);
    const card = checkbox.closest(".guest-card");

    // ⭐ IMPORTANT: Update the data
    App.party[index].RSVP = checkbox.checked
        ? "Joyfully Attending"
        : "Unable to Attend";

    if (checkbox.checked) {

        status.textContent = "Masayang Makakadalo 💚";
        status.style.color = "#7E8E65";

        card.classList.remove("declined");
        card.classList.add("selected");

    } else {

        status.textContent = "Hindi Makakadalo 🤍";
        status.style.color = "#999";

        card.classList.remove("selected");
        card.classList.add("declined");

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

    const calendarLink =
        "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent("Mike & Sharmaine's Wedding")
        + "&dates=20270115T073000Z/20270115T150000Z"
        + "&details=" + encodeURIComponent(
            "We're excited to celebrate with you! See you at Fruella's Events Place."
        )
        + "&location=" + encodeURIComponent(
            "Fruella's Events Place, Tagaytay"
        );

    // --------------------------------
    // RSVP Summary
    // --------------------------------

    const rsvpSummary = App.party.map(guest => {

        const status =
            guest.RSVP === "Joyfully Attending"
                ? "Makakadalo 💚"
                : "Hindi Makakadalo 🤍";

        return `
            <div class="summary-row">

                <span class="summary-icon">
                    ${
                        guest.RSVP === "Joyfully Attending"
                            ? "✓"
                            : "✗"
                    }
                </span>

                <span>
                    <strong>${guest.GuestName}</strong>
                    — ${status}
                </span>

            </div>
        `;

    }).join("");


    // --------------------------------
    // Page
    // --------------------------------

    document.getElementById("app").innerHTML = `

        ${renderProgress(3)}

        <div class="thank-you-page">

            <h1>
                ${isUpdate ? "Na-update na!" : "Maraming Salamat!"}
            </h1>

            <p>

                ${
                    isUpdate
                    ? `Natanggap na namin ang iyong na-update na RSVP,
                       <strong>${App.party[0].GuestName}</strong>.`
                    : `Natanggap na namin ang inyong RSVP,
                       <strong>${App.party[0].GuestName}</strong>.`
                }

            </p>


            <p class="thank-you-message">

                Hindi na kami makapaghintay na makasama kayo sa
                pagdiriwang ng isa sa pinakamahalagang araw ng aming buhay.

                <br><br>

                Nagmamahal,

                <br>

                <strong>Mike & Sharmaine 💚</strong>

            </p>


            <div class="divider"></div>


            <div class="rsvp-summary">

                <h3>
                    Ang Inyong RSVP
                </h3>

                ${rsvpSummary}

                ${
                    isUpdate
                    ? `
                        <p class="update-note">
                            Na-update lamang ang iyong RSVP.
                            <br>
                            Ang mga sagot ng ibang miyembro ng pamilya ay nananatiling pareho.
                        </p>
                    `
                    : ""
                }

            </div>


            <div class="divider"></div>


            <p>
                Magkita-kita tayo sa
            </p>

            <p class="wedding-date">
    Enero 15, 2027
</p>

            <p>
                <strong>Fruella’s Events Place</strong><br>
                Tagaytay
            </p>

<div class="thank-you-buttons">

    <button
        type="button"
        id="doneButton"
        class="done-btn">

        Tapos

    </button>

    <button
        type="button"
        class="calendar-btn"
        onclick="addToCalendar()">

        📅 Idagdag sa Google Calendar

    </button>

</div>

        </div>


`;


    const doneButton = document.getElementById("doneButton");

    doneButton.addEventListener("click", function () {

        App.party = [];
        App.editMode = false;

        transitionTo(renderWelcomePage);

    });

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

<h3>Your RSVP</h3>

<div class="rsvp-summary">

    ${rsvpSummary}

</div>

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
function addToCalendar() {

    const title = encodeURIComponent(
        "Mike & Sharmaine Wedding"
    );

    const location = encodeURIComponent(
        "Fruella's Events Place, Tagaytay"
    );

    const details = encodeURIComponent(
`We're excited to celebrate with you!

Wedding Ceremony

Mike & Sharmaine

See you there ❤️`
    );

    // January 15, 2027
    // 3:30 PM - 10:00 PM

    const start = "20270115T153000";
    const end   = "20270115T220000";

    window.open(

`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`,

"_blank"

    );

}
function showUpdateModal(){

    console.log("showUpdateModal() called");

    const modal = document.getElementById("updateModal");

    console.log("Modal element:", modal);

    modal.classList.add("show");

    console.log("Modal classes:", modal.className);

}

function cancelUpdate(){

    hideUpdateModal();

    App.party = [];

    pendingParty = [];

    App.editMode = false;

    transitionTo(renderWelcomePage);

}

function confirmUpdate(){

    // Hide the modal
    hideUpdateModal();

    // Keep the guests that were found
    App.party = pendingParty;

    // Tell the app this is an RSVP update
    App.editMode = true;

    // Clear the old Step 1 screen immediately
    document.getElementById("app").innerHTML = "";

    // Go directly to Step 2
    transitionTo(renderInvitationSummary);

}
function hideUpdateModal(){

    document
        .getElementById("updateModal")
        .classList.remove("show");

}
function toggleGuest(index) {

    const checkbox = document.getElementById(`guest${index}`);

    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;

    toggleAttendance(index);
}
