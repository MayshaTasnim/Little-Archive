// ======================================================
// ================= ADMIN PANEL ========================
// ======================================================


// Check logged-in admin
document.addEventListener(
    "DOMContentLoaded",
    function() {

        const adminData =
            localStorage.getItem(
                "littleArchiveAdmin"
            );


        // No admin logged in
        if (!adminData) {

            window.location.href =
                "admin-login.html";

            return;

        }


        let admin;

        try {

            admin =
                JSON.parse(adminData);

        } catch (error) {

            localStorage.removeItem(
                "littleArchiveAdmin"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        // Make sure the account is actually an admin
        if (
            !admin ||
            admin.role !== "admin"
        ) {

            localStorage.removeItem(
                "littleArchiveAdmin"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        // Display admin name
        const welcomeMessage =
            document.getElementById(
                "admin-welcome-message"
            );


        if (welcomeMessage) {

            welcomeMessage.textContent =
                `Welcome, ${admin.name}.`;

        }


        // ==================================================
        // ================= ADMIN LOGOUT ===================
        // ==================================================

        const logoutButton =
            document.getElementById(
                "admin-logout-btn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function() {

                    localStorage.removeItem(
                        "littleArchiveAdmin"
                    );


                    window.location.href =
                        "admin-login.html";

                }
            );

        }

    }
);