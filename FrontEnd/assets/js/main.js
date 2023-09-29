import { updateAuthLink, updateEditLink } from "./auth.js";
import { getWorks, addWork, deleteWork } from "./api.js";
import {
  selectedFile,
  setSelectedFile,
  removePreviewUploadFile,
} from "./modal.js";

function displayWorks(works) {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

function displayCategoriesButtons(works) {
  const categories = new Set(["Tous"]);
  works.forEach((projet) => {
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
    displayWorks(works);
  } else {
    const worksFiltered = works.filter((work) => filter === work.category.name);
    displayWorks(worksFiltered);
  }
}

export async function handleDeleteWork(e) {
  e.stopPropagation();

  const id = +e.target.dataset.id;
  const token = localStorage.getItem("token");

  const messageDialog = document.querySelector("#formMessageDialog");
  messageDialog.textContent='';

  const isDeleted = await deleteWork(id, token);

  if (isDeleted) {

    works = works.filter((work) => work.id !== id);
    displayWorks(works);
    displayCategoriesButtons(works);

    const cardDeleted = document.querySelector(
      `img[data-id="${id}"]`
    ).parentNode;

    if (cardDeleted) {
      cardDeleted.remove();
    }
  } else{
    messageDialog.innerText = "Un problème s'est produit lors de la suppression";
  }
}

export async function handleAddWork(e) {
  const form = document.querySelector("#modal-form");
  const token = localStorage.getItem("token");
  const select = document.getElementById("modal-form-category");
  const messageDialog = document.querySelector("#formMessageDialog");

  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("title", document.getElementById("modal-form-title").value);
  formData.append("category", select.options[select.selectedIndex].value);

  const isAdd = await addWork(formData, token);

  if (isAdd) {
    works = await getWorks();
    displayWorks(works);
    displayCategoriesButtons(works);
    form.reset();
    removePreviewUploadFile();
    setSelectedFile(null);

    const button = document.querySelector("#modalButton");
    button.disabled = true;
    button.classList.add("modal__button--inactive");

    messageDialog.innerText = "Projet ajouté";
    document.querySelector(".modal__form p").classList.remove("error");
  } else {
    messageDialog.innerText = "Un problème s'est produit lors de l'ajout";
  }
}

export let works = await getWorks();

displayWorks(works);
displayCategoriesButtons(works);
updateAuthLink();
updateEditLink();
