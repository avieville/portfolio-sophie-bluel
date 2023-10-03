import { ApiService } from "./ApiService.js";

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", handleLogin);

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const isLoggedIn = await (new ApiService()).login(email, password);

  if (isLoggedIn) {
    window.location.assign("index.html");
  } else {
    showInvalidCredentialMessage();
  }
}

function showInvalidCredentialMessage() {
  const errorMessageElement = document.getElementById("login-form-message");
  if (!errorMessageElement) {
    const message = document.createElement("p");
    message.id = "login-form-message";
    message.innerText = "Erreur dans l’identifiant ou le mot de passe";
    loginForm.appendChild(message);
  }
}
