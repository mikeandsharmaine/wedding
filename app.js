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

async function findGuest(){

    const name = document.getElementById("guestName").value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    try{

        const guests = await searchGuest(name);

        if(guests.length===0){

            alert("Sorry, we couldn't find your invitation.");

            return;

        }

        App.party = guests;

        renderInvitationSummary();

    }
    catch(error){

        console.error(error);

        alert("Unable to connect to RSVP server.");

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

    <button onclick="submitRSVP()">
      Continue
    </button>
  `;

}
