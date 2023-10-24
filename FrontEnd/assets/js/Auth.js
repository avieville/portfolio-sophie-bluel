import serviceManager from "./ServiceManager.js";

export class Auth {
  constructor() {
    this.refCbLogoutEventListener = (e) => this.logout(e);
  }

  async login(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const token = await serviceManager.getHttp().login(email, password);

    if (token) {
      window.localStorage.setItem("token", token);
      window.location.assign("index.html");
    } else {
      this.showInvalidCredentialMessage();
    }
  }

  logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    this.updateAuthLink();
    this.updateEditLink();
  }

  updateAuthLink() {
    const authLink = document.getElementById("auth-link");
    const token = localStorage.getItem("token");

    authLink.href = token ? "#" : "./login.html";
    authLink.innerText = token ? "logout" : "login";

    if (token) {
      authLink.addEventListener("click", this.refCbLogoutEventListener);
    } else {
      authLink.removeEventListener("click", this.refCbLogoutEventListener);
    }
  }

  updateEditLink() {
    const editLink = document.querySelector("#editLink");
    const token = localStorage.getItem("token");

    if (token) {
      if (!editLink) {
        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.id = "editLink";
        editLink.dataset.modal = "delete";
        editLink.classList.add("edit-link");

        const icon = document.createElement("img");
        icon.src = "./assets/icons/edit.png";
        icon.alt = "Instagram";

        editLink.appendChild(icon);
        editLink.appendChild(document.createTextNode(" modifier"));

        document
          .querySelector("#portfolio h2")
          .insertAdjacentElement("afterend", editLink);

        editLink.addEventListener("click", (e) =>
          serviceManager
            .getModalManager()
            .show(e, serviceManager.getWorkManager().works)
        );
      }
    } else if (editLink) {
      editLink.remove();
    }
  }

  showInvalidCredentialMessage() {
    const errorMessageElement = document.getElementById("login-form-message");
    if (!errorMessageElement) {
      const message = document.createElement("p");
      message.id = "login-form-message";
      message.innerText = "Erreur dans l’identifiant ou le mot de passe";
      const loginForm = document.getElementById("login-form");
      loginForm.appendChild(message);
    }
  }
}
