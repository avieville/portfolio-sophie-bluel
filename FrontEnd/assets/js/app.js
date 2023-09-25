import { setEditMode } from "./edit-bar.js";

async function getProjects() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error.message);
  }
}

export function displayProjects(projects) {
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

export function displayCategoriesButtons(projects) {
  const categories = new Set(["Tous"]);
  projects.forEach((projet) => {
    categories.add(projet.category.name);
  });

  const filters = document.querySelector("#filters");
  filters.innerHTML = "";

  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.innerText = categorie;
    button.className =
      categorie != "Tous"
        ? "filters__btn"
        : "filters__btn filters__btn--active";
    button.addEventListener("click", filterAndDisplay);
    filters.appendChild(button);
  });
}

function filterAndDisplay(event) {
  document.querySelectorAll(".filters__btn").forEach((btn) => {
    btn.classList.remove("filters__btn--active");
  });

  event.target.classList.add("filters__btn--active");

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
  } else {
    document.querySelector("#editLink").remove();
  }
}

function logout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  updateAuthLink();
  updateEditLink();
}

export let projects = await getProjects();
displayProjects(projects);
displayCategoriesButtons(projects);
updateAuthLink();
updateEditLink();

/*MODAL*/

function buildModal(context){
 

  const modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  modal.setAttribute("id", "modal");
  modal.setAttribute("role", "dialog");
  modal.addEventListener("click", removeModal);

  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal__content");

  const closeIcon = document.createElement("img");
  closeIcon.setAttribute("src", "./assets/icons/close.png");
  closeIcon.setAttribute("alt", "closing cross");
  closeIcon.setAttribute("class", "modal__closing-cross");
  closeIcon.setAttribute("id", "modal-closing-cross");
  closeIcon.addEventListener("click", removeModal);

  if (context == "add") {
    const arrowLeftIcon = document.createElement("img");
    arrowLeftIcon.setAttribute("src", "./assets/icons/arrow-left.png");
    arrowLeftIcon.setAttribute("alt", "arrow left");
    arrowLeftIcon.setAttribute("class", "modal__arrow-left");
    arrowLeftIcon.setAttribute("id", "modalArrowLeft");
    arrowLeftIcon.setAttribute("data-modal", "delete");
    arrowLeftIcon.addEventListener("click", showModal);
    modalContent.appendChild(arrowLeftIcon);
  }

  const h1 = document.createElement("h1");
  h1.setAttribute("class", "modal__title");
  h1.textContent = context == "delete" ? "Galerie Photo" : "Ajout photo";

  const container = document.createElement("div");
  container.setAttribute(
    "class",
    context === "delete" ? "modal__cards" : "modal__form"
  );

  if (context == "delete") {
    projects.forEach((project) => {
      const card = document.createElement("div");
      card.setAttribute("class", "modal__card");

      const image = document.createElement("img");
      image.setAttribute("src", project.imageUrl);
      image.setAttribute("alt", project.title);
      image.setAttribute("class", "modal__card-image");

      const bin = document.createElement("img");
      bin.setAttribute("src", "./assets/icons/bin.png");
      bin.setAttribute("alt", "bin");
      bin.setAttribute("class", "modal__card-bin");
      bin.setAttribute("id", "modal-card-bin");
      bin.setAttribute("data-id", project.id);
      bin.addEventListener("click", deleteProject);

      card.appendChild(image);
      card.appendChild(bin);

      container.appendChild(card);
    });
  }

  if (context == "add") {
    const form = document.createElement("form");
    form.setAttribute("action", "#");
    form.setAttribute("id", "modal-form");

    const photoArea = document.createElement("div");
    photoArea.classList.add("modal__form-photo-area");
    photoArea.setAttribute("id", "form-photo-area");

    const fileGroup = document.createElement("div");
    fileGroup.classList.add("modal__form-file-group");

    const landscape = document.createElement("img");
    landscape.classList.add("modal__form-landscape");
    landscape.setAttribute("src", "./assets/icons/landscape.png");
    landscape.setAttribute("alt", "landscape");

    const fileLabel = document.createElement("label");
    fileLabel.setAttribute("for", "file");
    fileLabel.setAttribute("class", "modal__form-file-input-label");
    fileLabel.textContent = "+ Ajouter photo";

    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("name", "modal__form-file-input");
    fileInput.setAttribute("id", "file");
    fileInput.setAttribute("class", "modal__form-file-input");
    fileInput.setAttribute("accept", "image/*");
    fileInput.addEventListener("change", previewUploadFile);

    const p = document.createElement("p");
    p.textContent = "jpg, png : 4mo max";

    fileGroup.appendChild(landscape);
    fileGroup.appendChild(fileLabel);
    fileGroup.appendChild(fileInput);
    fileGroup.appendChild(p);

    const titleFormGroup = document.createElement("div");
    titleFormGroup.classList.add("modal__form-group", "form-group-title");

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "modal-form-title");
    titleLabel.textContent = "Titre";

    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "title");
    titleInput.setAttribute("id", "modal-form-title");

    const categoryFormGroup = document.createElement("div");
    categoryFormGroup.classList.add(
      "modal__form-group",
      "form-group-categorie"
    );

    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "modal-form-categorie");
    categoryLabel.textContent = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.setAttribute("name", "categorie");
    categorySelect.setAttribute("id", "modal-form-categorie");

    const option1 = document.createElement("option");
    option1.value = "";
    const option2 = document.createElement("option");
    option2.value = "1";
    option2.textContent = "Objets";
    const option3 = document.createElement("option");
    option3.value = "2";
    option3.textContent = "Appartements";
    const option4 = document.createElement("option");
    option4.value = "3";
    option4.textContent = "Hotel & restaurants";

    categorySelect.appendChild(option1);
    categorySelect.appendChild(option2);
    categorySelect.appendChild(option3);
    categorySelect.appendChild(option4);

    form.appendChild(photoArea);
    photoArea.appendChild(fileGroup);

    form.appendChild(titleFormGroup);
    titleFormGroup.appendChild(titleLabel);
    titleFormGroup.appendChild(titleInput);

    form.appendChild(categoryFormGroup);
    categoryFormGroup.appendChild(categoryLabel);
    categoryFormGroup.appendChild(categorySelect);

    container.appendChild(form);




  }

  const button = document.createElement("button");
  button.setAttribute("class", "modal__button");
  button.setAttribute("id", "modalButton");
  button.setAttribute("data-modal", "add");
  button.textContent = context === "delete" ? "Ajouter une photo" : "Valider";
  modalContent.appendChild(closeIcon);
  modalContent.appendChild(h1);
  modalContent.appendChild(container);
  modalContent.appendChild(button);
  modal.appendChild(modalContent);

  modal.children[0].addEventListener("click", function (e) {
    e.stopPropagation();
  });

  const cb = context=="delete" ? showModal : addProject
  button.addEventListener("click", cb)

  return modal
}

export function showModal(event) {
  event.preventDefault();

  const context = event.target.dataset.modal;

  if (document.querySelector("#modal")) {
    removeModal();
  }

  const  modal = buildModal(context);
  document.body.appendChild(modal);

  setEditMode(true);
}

function removeModal() {
  const modal = document.querySelector("#modal");
  modal.remove();
  setEditMode(false);
}

async function deleteProject(event) {
  event.stopPropagation();

  try {
    const id = +event.target.dataset.id;
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      projects = projects.filter((project) => project.id !== id);
      displayProjects(projects);
      displayCategoriesButtons(projects);
      removeModal();
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function addProject(event) {
  event.preventDefault();

  const form = document.querySelector("#modal-form");
  const token = localStorage.getItem("token");
  const formData = new FormData();
  const selectElement = form.querySelector("#modal-form-categorie");
  formData.append("image", selectedFile);
  formData.append("title", form.querySelector("#modal-form-title").value);
  formData.append(
    "category",
    parseInt(selectElement.options[selectElement.selectedIndex].value)
  );

  try {
    let response = await fetch("http://localhost:5678/api/works/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      projects = await getProjects();
      displayProjects(projects);
      displayCategoriesButtons(projects);
      removeModal();
    }
  } catch (error) {
    console.error(error.message);
  }
}

function previewUploadFile(event) {
  if (event.target.files.length > 0) {
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.querySelector("#form-photo-area");
    document.querySelector(".modal__form-file-group").style.display = "none";

    preview.innerHTML += `
      <img class="form__preview" id="form-preview" src="${src}" alt="preview">
    
    `;

    selectedFile = event.target.files[0];

    console.log(event.target.files);
    console.log(event.target);
    console.log(document.querySelector("#file").files);
  }
}

let selectedFile = null;
