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

.field-label{
    display:block;
    margin:18px 0 8px;
    text-align:left;
    font-weight:600;
    color:#666;
}

textarea{
    width:100%;
    min-height:140px;
    padding:18px 22px;
    border:1px solid #ddd;
    border-radius:28px;
    font-size:16px;
    font-family:'Poppins',sans-serif;
    resize:none;
    margin-bottom:24px;
    box-sizing:border-box;
}

textarea:focus{
    outline:none;
    border-color:#7E8E65;
    box-shadow:0 0 0 4px rgba(126,142,101,.15);
}

       <button onclick="submitRSVP()">
    Confirm RSVP
</button>

    `;

}
async function submitRSVP() {

    alert("submitRSVP is working!");


    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Collect attendance
const guests = App.party.map(guest => ({
    InvitationID: guest.InvitationID,
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

    console.log(payload);

    alert("Next step: Sending RSVP to Google Sheets.");
}
function continueToContact() {

    App.party.forEach((guest, index) => {

        guest.RSVP = document.getElementById(`guest${index}`).checked
            ? "Yes"
            : "No";

    });

    renderContactPage();

}
