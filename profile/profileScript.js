import { displayErrorList, displayMessage } from "../components/loader.js"
import { connectNotifications, logOut } from "../index/index.js"
import { toggleView } from "../games/pong/pongScript.js"
import { drawTournament } from "../components/tournamentTable.js"

let editProfileView, setMFAView, changePasswordView,
    profileOptionsView;


export function initDivs() {
    editProfileView = document.getElementById('edit_profile');
    setMFAView = document.getElementById('set_MFA');
    changePasswordView = document.getElementById('change_password');
    profileOptionsView = document.getElementById('profileOptions');
    document.getElementById('root').addEventListener('click', gameEventHandler);
}

export function init(customData = null) {
    loadUserInfo(customData);
    getTournaments(customData);
    getMatches(customData);
    initTabListener();
}

function initTabListener() {
    const navLinks = document.querySelectorAll('#profileTabs .nav-link');
    
    const userStats       = document.getElementById('secStats');
    const userMatches     = document.getElementById('secMatches');
    const userTournaments = document.getElementById('secTournaments');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            const listToShow = this.getAttribute('data-list');
            if (listToShow === 'stats') {
                this.classList.add('active');
                userStats.classList.remove("mshide");
                userMatches.classList.add("mshide");
                userTournaments.classList.add("mshide");
            } else if (listToShow === 'matches') {
                this.classList.add('active');
                userStats.classList.add("mshide");
                userMatches.classList.remove("mshide");
                userTournaments.classList.add("mshide");
            } else if (listToShow === 'tournaments') {
                this.classList.add('active');
                userStats.classList.add("mshide");
                userMatches.classList.add("mshide");
                userTournaments.classList.remove("mshide");
            }

        });
    });
}

function gameEventHandler(e) {
    if (e.target.matches('#editProfile') === true) {
        toggleView(editProfileView, true);
        toggleView(profileOptionsView, false);
    }
    else if (e.target.matches('#setMFA') === true) {
        toggleView(setMFAView, true);
        toggleView(profileOptionsView, false);
    }
    else if (e.target.matches('#backToEditProfile') === true) {
        toggleView(editProfileView, false);
        toggleView(setMFAView, false);
        toggleView(changePasswordView, false);
        toggleView(profileOptionsView, true);
    }
    else if (e.target.matches('#changePassword') === true) {
        toggleView(changePasswordView, true);
        toggleView(profileOptionsView, false);
    }
};

export async function loadUserInfo(customData = null) {
    const token = sessionStorage.getItem('token')
    try {
        let url = 'api/user_management/user_list/';
        if (customData)
            url = `/api/user_management/user_specific/${customData}/`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let user_info = document.getElementById("user_info");
        
        const h1Element = document.createElement('h1');
        h1Element.textContent = `${data.username} Profile`;
        const profileTitle = document.getElementById('profileTitle');
        profileTitle.appendChild(h1Element);

        document.getElementById("WINS_PONG").textContent      = data.wins;
        document.getElementById("LOSSES_PONG").textContent    = data.losses;
        document.getElementById("ELO_PONG").textContent       = data.elo;
        document.getElementById("WINS_POOL").textContent      = data.wins_pool;
        document.getElementById("LOSSES_POOL").textContent    = data.losses_pool;
        document.getElementById("ELO_POOL").textContent       = data.elo_pool;
        if (data.profile_picture != null)
            document.getElementById("userPhoto").src = 'data:image/png;base64,' + data.profile_picture;
        if (data.qr != null)
        { 
            const divContenedor = document.createElement('div');
            divContenedor.classList.add('vertical-center');
            const imagenQR = document.createElement('img');
            imagenQR.classList.add('qrcode');
            imagenQR.src = 'data:image/png;base64,' + data.qr;
            imagenQR.alt = 'QR code';
            divContenedor.appendChild(imagenQR);
            const user_info = document.getElementById("user_info");
            user_info.appendChild(divContenedor);
        }
        user_info.classList.remove("mshide");
    }
    catch (error) {
    }
}

async function getMatches(customData = null) {
    const token = sessionStorage.getItem('token')
    try {
        let url = `api/game/getMatches/`;
        if(customData)
            url = `api/game/getMatches/${customData}/`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }}
        );
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const matches = data.matches;
        const profileMatchesList = document.getElementById("profileMatchesList");
        matches.forEach(game => {
            const listItem = document.createElement("li");
            listItem.classList.add("game-item");
            
            const playersText = document.createTextNode(`${game.username} vs ${game.opponent_username}`);
            const playerScoreText = document.createTextNode(`Player Score: ${game.player_score}`);
            const opponentScoreText = document.createTextNode(`Opponent Score: ${game.opponent_score}`);
            const dateText = document.createTextNode(`Date: ${new Date(game.date).toLocaleString()}`);
            const gameTypeText = document.createTextNode(`Game: ${game.game_type}`);
            
            listItem.appendChild(playersText);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(playerScoreText);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(opponentScoreText);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(dateText);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(gameTypeText);

            profileMatchesList.appendChild(listItem);
        });
    }
    catch (error) {
    }
}

async function getTournaments(customData = null) {
    const token = sessionStorage.getItem('token')
    try {
        let url = 'api/blockchain/getTournaments/';
        if(customData != null)
            url = `api/blockchain/getTournaments/${customData}/`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const tournaments = data.tournaments_participated;
        const profileTournamentsList = document.getElementById("profileTournamentList");
        tournaments.forEach(element => {
            const listItem = document.createElement("li");
            listItem.classList.add("tournament-item");
            listItem.setAttribute("id", element.id);
            
            const tournamentName = document.createTextNode(`${element.name}`);
            const dateText = document.createTextNode(`Date: ${new Date(element.created_at).toLocaleString()}`);

            listItem.appendChild(tournamentName);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(dateText);

            profileTournamentsList.appendChild(listItem);

            listItem.addEventListener("click", function() {
                const clickedId = this.id;
                getTournamentTable(clickedId)
            });
        });
        

    }
    catch (error) {
    }
}

export async function getTournamentTable(tournament_id) {
    const token = sessionStorage.getItem('token')
    try {
        let url = `api/blockchain/getTournamentTable/?tournament_id=${tournament_id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        let tableDiv = document.getElementById("tournamentHistory");
        tableDiv.classList.remove("mshide");
        let UserInfo = document.getElementById("user_info");
        UserInfo.classList.add("mshide");
        drawTournament(data["tournament"], "tournamentCanva2");
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

export function loadEditProfilePage() {
    
    let profile = document.getElementById("root");
    Promise.all([
        fetch('./profile/editProfile.html').then(response => response.text()),
        fetch('./profile/editProfileStyle.css').then(response => response.text()),
        import('./profileScript.js').then(module => module)
    ]).then(([html, css, javascript]) => {
        window.location.hash = '#/edit-profile';
        html += `<style>${css}</style>`;
        profile.innerHTML = html;

        connectNotifications();

        javascript.initDivs();
        editProfileListener();
    }).catch(error => {
        console.error('Error al cargar el formulario:', error);
    });
}

async function deleteProfilePicture(e) {
    if (e.target.matches('#deleteProfilePicture') !== true)
        return ;
    const token = sessionStorage.getItem('token');;
    try {
        const response = await fetch('/api/user_management/user_update/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }
    const data = await response.json();
    displayMessage(data.message, 'small', 'editProfileForm');
    } catch (error) {
        console.log(error)
        displayMessage(error.message, 'small', 'editProfileForm');
}
}

function updateUser(e) {
    e.preventDefault();
    if (e.target.matches('#editProfileForm') === true)
        updateProfile();
    else if (e.target.matches('#changePasswordForm') === true)
        updatePassword();
    else if (e.target.matches('#activateTwoFactorAuthForm') == true)
        update2FA();
    else if (e.target.matches('#confirmOTP') == true)
        TwoFactorAuthConfirmOTPUpdate();
}

async function update2FA() {
    const token = sessionStorage.getItem('token');
    const formData = {
        TwoFactorAuth: document.querySelector('input[name="twoFactorAuth"]:checked').value
    };
    try {
        const response = await fetch('/api/user_management/user_update_2FA/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok && response.status !== 307) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        console.log(data.message);
        displayMessage(data.message, 'small', 'activateTwoFactorAuthForm', 'green');
        if (response.status === 307) {
            displayMessage('', 'small', 'confirmOTP');
            document.getElementById('qrCodeImg').src = 'data:image/png;base64,' + data.qr;
            const buttons = document.querySelectorAll('.modal-footer button');
            buttons.forEach(button => {
                button.style.display = 'flex';
            });
            $('#twoFactorAuthModal').modal('show');
        }
    } catch (error) {
        displayMessage(error.message, 'small', 'activateTwoFactorAuthForm');
    }
}

async function updateProfile() {
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    if (document.querySelector('#new_username').value) {
        formData.append('username', document.querySelector('#new_username').value);
    }
    if (document.querySelector('#new_profilePicture').files.length > 0) {
        const file = document.querySelector('#new_profilePicture').files[0];
        try {
            if (file.size > 1024 * 1024)
                throw new Error('Image too large!');
            formData.append('profile_picture', file);
        } catch (error) {
            displayMessage(error.message, 'small', 'editProfileForm')
            return;
        }
    }
    try {
        const response = await fetch('/api/user_management/user_update/', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            console.log(error)
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        console.log(data)
        displayMessage(data.message, 'small', 'editProfileForm', 'green');
    } catch (error) {
        console.log(error)
        displayErrorList(JSON.parse(error.message), 'editProfileForm');
    }
}

async function updatePassword() {
    const token = sessionStorage.getItem('token');
    const old_password = document.querySelector('#old_password').value;
    const new_password = document.querySelector('#new_password').value;
    const new_password2 = document.querySelector('#confirm_password').value;

    const passwordData = {
        old_password: old_password,
        new_password: new_password,
        new_password2: new_password2,
    };
    try {
        const response = await fetch('/api/user_management/user_update_password/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(passwordData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        displayMessage(data.message, 'small', 'changePasswordForm', 'green');
    } catch (error) {
        displayErrorList(JSON.parse(error.message), 'changePasswordForm');
    }
}

async function TwoFactorAuthConfirmOTPUpdate() {
    const token = sessionStorage.getItem('token')
    const userOTP = document.querySelector('#OTP').value;
    const otpMessageDiv = document.getElementById('otpMessage');
    const UserData = {
        otp: userOTP,
    };
    try {
        const response = await fetch('api/user_management/user_update_validate_2FA/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(UserData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        document.getElementById('qrCodeImg').src = '../assets/condom.svg';
        const buttons = document.querySelectorAll('.modal-footer button');
        buttons.forEach(button => {
            button.style.display = 'none';
        });
        displayMessage(data.message, 'small', 'confirmOTP', 'green');
    } catch (error) {
        console.error('Error:', error.message);
        displayMessage(error.message, 'small', 'confirmOTP');
    }
}

function editProfileListener() {
	document.getElementById('root').addEventListener('submit', updateUser);
    document.getElementById('root').addEventListener('click', deleteProfilePicture);
    document.getElementById('root').addEventListener('click', logOut);
}
