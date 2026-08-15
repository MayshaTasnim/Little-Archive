// ======================================================
// ================= ADMIN LOGIN ========================
// ======================================================


const adminLoginForm =
    document.getElementById("admin-login-form");

const adminLoginMessage =
    document.getElementById("admin-login-message");


adminLoginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "admin-email"
            ).value.trim();


        const password =
            document.getElementById(
                "admin-password"
            ).value;


        adminLoginMessage.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const data =
                await response.json();


            // Login failed
            if (!response.ok) {

                adminLoginMessage.textContent =
                    data.message ||
                    "Login failed.";

                return;
            }


            // Check admin role
            if (
                !data.user ||
                data.user.role !== "admin"
            ) {

                adminLoginMessage.textContent =
                    "Access denied. Admin account required.";

                return;
            }


            // Save admin user
            localStorage.setItem(
                "littleArchiveAdmin",
                JSON.stringify(data.user)
            );


            // Login successful
            adminLoginMessage.textContent =
                "Admin login successful!";


            // Go to admin panel
            setTimeout(function() {

                window.location.href =
                    "admin-panel.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            adminLoginMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);