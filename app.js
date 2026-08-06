// ========================================
// Mike & Sharmaine Wedding RSVP
// ========================================

const App = {
    party: [],
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

    document.getElementById("app").innerHTML = `
    

        <h1>Mike & Sharmaine</h1>

        <h2>Wedding RSVP</h2>

        <div class="countdown">

    <div id="daysRemaining" class="count-number">...</div>

    <div class="count-label">
        Days Until We Say "I Do"
    </div>

</div>

<p>
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

        console.log("2. Guests returned:", guests);

      if (guests.length === 0) {

    alert("Sorry, we couldn't find your invitation.");

    btn.disabled = false;
    btn.innerHTML = "View My Invitation";

    return;

}

        console.log("3. Saving party");

        App.party = guests;

        console.log("4. Calling renderInvitationSummary");

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

                            <label class="switch">

                                <input
                                    type="checkbox"
                                    id="guest${index}"
                                    checked
                                    onchange="toggleAttendance(${index})">

                                <span class="slider"></span>

                            </label>

                            <span
                                class="attendance-text"
                                id="status${index}">
                                Joyfully Attending 💚
                            </span>

                        </div>

                    </div>

                </div>
            `;

        }).join("")}

        <button onclick="continueToContact()">
            Continue
        </button>
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

       <button onclick="submitRSVP()">
    Confirm RSVP
</button>

    `;
    
}
async function submitRSVP() {

    console.log("STEP 1");

    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log("STEP 2");

    const guests = App.party.map(guest => ({
    GuestName: guest.GuestName,
    RSVP: guest.RSVP
}));

    const payload = {
        action: "submit",
        invitationID: App.party[0].InvitationID,
        mobile,
        email,
        message,
        guests
    };

    console.log("ABOUT TO FETCH");
    console.log(payload);

    const btn = document.querySelector("button");

btn.disabled = true;
btn.innerHTML = "♡ Saving your RSVP...";
    
    try {

        const response = await fetch(
    `${App.apiUrl}?action=submit&payload=${encodeURIComponent(JSON.stringify(payload))}`
);

        console.log("STATUS:", response.status);

        const result = await response.json();

        console.log(result);

        if (result.success) {
            renderThankYouPage();
        } else {
            alert(result.message);
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
            ? "Yes"
            : "No";

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
    "images/petal2.png",
    "images/petal3.png",
    "images/petal4.png",

    "images/leaf1.png",
    "images/leaf2.png",
    "images/leaf3.png",

    "images/flower1.png",
    "images/flower2.png",
    "images/flower3.png",

    "images/bud1.png",
    "images/bud2.png"

];

function createPetal() {

    const petal = document.createElement("img");

    petal.className = "petal";

    petal.src =
        floatingItems[Math.floor(Math.random() * floatingItems.length)];

    petal.style.left = Math.random() * 100 + "vw";

    petal.style.width =
        (18 + Math.random() * 22) + "px";

    petal.style.animationDuration =
        (12 + Math.random() * 8) + "s";

    petal.style.animationDelay =
        Math.random() * 2 + "s";

    petal.style.opacity =
        0.45 + Math.random() * 0.35;

    petal.style.setProperty(
        "--drift",
        (Math.random() * 160 - 80) + "px"
    );

    petal.style.setProperty(
        "--rotate",
        (Math.random() * 720 - 360) + "deg"
    );

    document.getElementById("petals").appendChild(petal);

    petal.addEventListener("animationend", () => {

        petal.remove();

    });

}

setInterval(createPetal, 1400);
console.log("Petal script loaded");
