import serviceManager from "./ServiceManager.js";

export class AuthManager {
  constructor() {}

  logout(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    this.updateAuthLink();
    this.updateEditLink();
  }

  updateAuthLink() {

    const AuthLink  = document.getElementById("auth-link");
    const token = localStorage.getItem("token");
    const cb = (e)=> this.logout(e);

    /**
     * the removeListener did not work (nothing seen in the debugger). 
     * so I used replaceChild to remove the properties and eventListener 
     * from the element.
    */
    const newAuthLink = AuthLink.cloneNode();
    AuthLink.parentNode.replaceChild(newAuthLink, AuthLink);
    
    newAuthLink.href = token ? "#" : "./login.html";
    newAuthLink.innerText = token ? "logout" : "login";
    token && newAuthLink.addEventListener("click", cb);

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
}
