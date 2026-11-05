console.log("login.js est bien chargé");

// Listen to the login form submission
const loginForm = document.querySelector("#login form");
loginForm.addEventListener("submit", async function (event) {
    // Prevent the default form submission
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    console.log("Email saisi :", email);

    // Send the email and the password to the API
    const user = { email: email, password: password };
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    console.log("Code de la réponse :", response.status);
    const result = await response.json();
    console.log("Réponse de l'API :", result);

    // If the login is successful: save the token and go to the home page
    if (response.status === 200) {
        localStorage.setItem("token", result.token);
        window.location.href = "index.html";
    } else {
        // If the login fails: show an error message
        const errorMessage = document.querySelector("#error-message");
        errorMessage.innerText = "Email ou mot de passe incorrect.";
    }

    const token = localStorage.getItem("token");
    if (token !== null) {
        // connected: show the edit mode
    }
});
