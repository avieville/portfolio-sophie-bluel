import { updateAuthLink, updateEditLink } from "./auth.js";
import { getProjects, addProject, deleteProject } from "./api.js";
import {
  selectedFile,
  setSelectedFile,
  removePreviewUploadFile,
} from "./modal.js";

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

function displayCategoriesButtons(projects) {
  const categories = new Set(["Tous"]);
  projects.forEach((projet) => {
    categories.add(projet.category.name);
  });

  const filters = document.querySelector("#filters");
  filters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category;
    button.className = `filters__btn ${
      category === "Tous" ? "filters__btn--active" : ""
    }`;
    button.addEventListener("click", filterAndDisplay);
    filters.appendChild(button);
  });
}

function filterAndDisplay(e) {
  document.querySelectorAll(".filters__btn").forEach((btn) => {
    btn.classList.remove("filters__btn--active");
  });

  e.target.classList.add("filters__btn--active");

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

export function handleDeleteProject(e) {
  e.stopPropagation();

  const id = +e.target.dataset.id;
  const token = localStorage.getItem("token");

  const isDeleted = deleteProject(id, token);

  if (isDeleted) {
    projects = projects.filter((project) => project.id !== id);
    displayProjects(projects);
    displayCategoriesButtons(projects);

    const cardDeleted = document.querySelector(
      `img[data-id="${id}"]`
    ).parentNode;

    if (cardDeleted) {
      cardDeleted.remove();
    }
  }
}

export async function handleaddProject(e) {
  const form = document.querySelector("#modal-form");
  const token = localStorage.getItem("token");
  const select = document.getElementById("modal-form-category");

  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("title", document.getElementById("modal-form-title").value);
  formData.append("category", select.options[select.selectedIndex].value);

  const isAdd = await addProject(formData, token);

  if (isAdd) {
    projects = await getProjects();
    displayProjects(projects);
    displayCategoriesButtons(projects);
    form.reset();
    removePreviewUploadFile();
    setSelectedFile(null);

    const button = document.querySelector("#modalButton");
    button.disabled = true;
    button.classList.add("modal__button--inactive");

    document.querySelector("#formMessageDialog").innerText = "Projet ajouté";
    document.querySelector(".modal__form p").classList.remove("error");
  }
}

export let projects = await getProjects();

displayProjects(projects);
displayCategoriesButtons(projects);
updateAuthLink();
updateEditLink();
