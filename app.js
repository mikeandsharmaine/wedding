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

        <br>

        <p>
            Please enter your name exactly as it appears on your invitation.
        </p>

        <input
            id="guestName"
            type="text"
            placeholder="Enter your name">

        <button onclick="findGuest()">
            Find My Invitation
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
}

// -------------------------------
// Search Button
// -------------------------------

async function findGuest() {

    const name = document.getElementById("guestName").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    try {

        console.log("1. Searching...");

        const guests = await searchGuest(name);

        console.log("2. Guests returned:", guests);

        if (guests.length === 0) {
            alert("Sorry, we couldn't find your invitation.");
            return;
        }

        console.log("3. Saving party");

        App.party = guests;

        console.log("4. Calling renderInvitationSummary");

        renderInvitationSummary();

        console.log("5. Finished");

    } catch (error) {

        console.error("FULL ERROR:", error);

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

    <p>Please confirm the attendance of everyone in your invitation.</p>

    ${party.map((guest, index) => `
      <div class="guest-card">

        <h3>${guest.GuestName}</h3>

        <label>
          <input
            type="checkbox"
            id="guest${index}"
          >
          Will Attend
        </label>

      </div>
    `).join("")}

    <br>

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

}

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

    const guests = App.party.map((guest, index) => ({
        GuestName: guest.GuestName,
        RSVP: document.getElementById(`guest${index}`).checked ? "Yes" : "No"
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

    try {

        const response = await fetch(App.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

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
