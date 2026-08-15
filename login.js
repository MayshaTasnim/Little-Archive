const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;


    loginMessage.textContent = "Logging in...";


    try {

        const response = await fetch(
            "http://localhost:3000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // Login failed
        if (!response.ok) {

            loginMessage.textContent =
                data.message || "Login failed.";

            return;
        }


        // Save logged-in user
        localStorage.setItem(
            "littleArchiveUser",
            JSON.stringify(data.user)
        );


        // Login successful
        loginMessage.textContent =
            "Login successful!";


        // Go to homepage
        setTimeout(function () {

            window.location.href = "index.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Unable to connect to the server.";

    }

});