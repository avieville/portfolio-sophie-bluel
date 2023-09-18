async function login(event) {
  event.preventDefault();

  const body = {
    email: loginForm.querySelector('input[name="email"]').value,
    password: loginForm.querySelector('input[name="password"]').value,
  };

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    window.localStorage.setItem("token", data.token);
    window.location.assign(
      "index.html"
    );
  } else {
    loginForm.reset();
    showInvalidCredentialMessage();
  }
}

function showInvalidCredentialMessage() {
  const message = document.createElement("p");
  message.innerText = "Identifiant ou mot de passe invalide";
  loginForm.appendChild(message);
}

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", login);
