async function login(event) {
  event.preventDefault();

  const body = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
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
      window.location.assign("index.html");
    } else {
      showInvalidCredentialMessage();
    }
  } catch (error) {
    console.error(error.message);
  }
}

function showInvalidCredentialMessage() {
  const messageExist = document.getElementById("login-form-message");
  if (!messageExist) {
    const message = document.createElement("p");
    message.id = "login-form-message";
    message.innerText = "Erreur dans l’identifiant ou le mot de passe";
    loginForm.appendChild(message);
  }
}

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", login);
