async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}

function getCategories(projects) {
  const categories = new Set();
  projects.forEach((projet) => {
    categories.add(projet.category.name);
  });
  return categories;
}

function displayProjects(projects) {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = "";

  projects.forEach((project) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = project.title;
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

function displayCategoriesButtons(categories) {
  const filters = document.querySelector("#filters");

  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filters__btn filters__btn--active";
  button.addEventListener("click", filterAndDisplay);
  filters.appendChild(button);

  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.innerText = categorie;
    button.className = "filters__btn";
    button.addEventListener("click", filterAndDisplay);
    filters.appendChild(button);
  });
}

function filterAndDisplay(event) {
  //update style filtered button
  document.querySelectorAll(".filters__btn").forEach((btn) => {
    btn.classList.remove("filters__btn--active");
  });

  event.target.classList.add("filters__btn--active");

  //filter and display projects
  const filter = event.target.innerText;

  if (filter === "Tous") {
    displayProjects(projects);
  } else {
    const projectsFiltered = projects.filter(
      (project) => filter === project.category.name
    );
    displayProjects(projectsFiltered);
  }
}

function updateAuthLink() {
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

function updateEditLink() {
  if (localStorage.getItem("token")) {
    const editLink = document.createElement("a");
    editLink.href = "#";
    editLink.id = "edit-link";
    editLink.classList.add("edit-link");

    const icon = document.createElement("img");
    icon.src = "./assets/icons/edit.png";
    icon.alt = "Instagram";

    editLink.appendChild(icon);
    editLink.appendChild(document.createTextNode(" modifier"));

    document
      .querySelector("#portfolio h2")
      .insertAdjacentElement("afterend", editLink);
  } else {
    document.querySelector("#edit-link").remove();
  }
}

function logout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  updateAuthLink();
  updateEditLink();
}

const projects = await getProjects();
displayProjects(projects);

const categories = getCategories(projects);
displayCategoriesButtons(categories);

updateAuthLink();
updateEditLink();
