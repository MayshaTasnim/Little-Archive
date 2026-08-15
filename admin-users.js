// ======================================================
// ADMIN USERS
// ======================================================

const usersList =
    document.getElementById(
        "admin-users-list"
    );


// ======================================================
// LOAD USERS
// ======================================================

async function loadAdminUsers() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/users"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load users."
            );

        }


        const users =
            await response.json();


        displayUsers(users);


    } catch (error) {

        console.error(
            "Load users error:",
            error
        );


        usersList.innerHTML = `
            <p class="admin-users-error">
                Unable to load users.
            </p>
        `;

    }

}


// ======================================================
// DISPLAY USERS
// ======================================================

function displayUsers(users) {

    if (!users.length) {

        usersList.innerHTML = `
            <p class="admin-users-empty">
                No registered users found.
            </p>
        `;

        return;

    }


    usersList.innerHTML = "";


    users.forEach(function(user) {

        const userCard =
            document.createElement("article");


        userCard.className =
            "admin-user-card";


        userCard.innerHTML = `

            <div class="admin-user-info">

                <h2>
                    ${user.name}
                </h2>

                <p>
                    <strong>Email:</strong>
                    ${user.email}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${user.role}
                </p>

            </div>

        `;


        usersList.appendChild(
            userCard
        );

    });

}


// ======================================================
// START
// ======================================================

loadAdminUsers();