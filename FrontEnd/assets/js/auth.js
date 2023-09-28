import { showModal } from "./modal.js";

export function logout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  updateAuthLink();
  updateEditLink();
}

export function updateAuthLink() {
  const authLink = document.getElementById("auth-link");

  if (localStorage.getItem("token")) {
    authLink.href = "#";
    authLink.innerText = "logout";
    authLink.addEventListener("click", logout);
  } else {
    authLink.innerText = "login";
    authLink.removeEventListener("click", logout);
    authLink.href = "./login.html";
  }
}

export function updateEditLink() {
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

      editLink.addEventListener("click", showModal);
    }
  } else if (editLink) {
    editLink.remove();
  }
}
