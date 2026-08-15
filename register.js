const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;


    registerMessage.textContent = "Creating account...";


    try {

        const response = await fetch(
            "http://localhost:3000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            registerMessage.textContent = data.message;

            return;
        }


        registerMessage.textContent =
            "Registration successful! Redirecting to login...";


        registerForm.reset();


        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);


    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Unable to connect to the server.";

    }

});