import serviceManager from "./ServiceManager.js";

const auth = serviceManager.getAuth();

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => auth.login(e));
