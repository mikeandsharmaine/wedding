// ========================================
// Mike & Sharmaine Wedding RSVP
// ========================================

const App = {
    party: [],
    apiUrl: "https://script.google.com/macros/s/AKfycbyZNzIYT8Vp1zopvc_PANgV5XBeINll9oBiK4FA83tUeutjj6EpvJJhwMxdO6TjH0di/exec"
};

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

function findGuest(){

    const name = document.getElementById("guestName").value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    alert("Next step: Connecting to Google Apps Script.");

}

// -------------------------------

window.onload = renderWelcomePage;
