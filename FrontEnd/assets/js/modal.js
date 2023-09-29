import { works } from "./main.js";
import { handleDeleteWork, handleAddWork } from "./main.js";
import { setEditMode } from "./edit-bar.js";

export let selectedFile = null;

export function buildModal(context, works) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal";
  modal.role = "dialog";
  modal.addEventListener("click", removeModal);

  const modalContent = document.createElement("div");
  modalContent.className = "modal__content";

  const closeIcon = document.createElement("img");
  closeIcon.src = "./assets/icons/close.png";
  closeIcon.alt = "closing cross";
  closeIcon.className = "modal__closing-cross";
  closeIcon.id = "modal-closing-cross";
  closeIcon.addEventListener("click", removeModal);

  if (context === "add") {
    const arrowLeftIcon = document.createElement("img");
    arrowLeftIcon.src = "./assets/icons/arrow-left.png";
    arrowLeftIcon.alt = "arrow left";
    arrowLeftIcon.className = "modal__arrow-left";
    arrowLeftIcon.id = "modalArrowLeft";
    arrowLeftIcon.setAttribute("data-modal", "delete");
    arrowLeftIcon.addEventListener("click", showModal);
    modalContent.appendChild(arrowLeftIcon);
  }

  const h1 = document.createElement("h1");
  h1.className = "modal__title";
  h1.textContent = context === "delete" ? "Galerie Photo" : "Ajout photo";

  const container = document.createElement("div");
  container.className = context === "delete" ? "modal__cards" : "modal__form";

  if (context === "delete") {
    works.forEach((work) => {
      const card = document.createElement("div");
      card.className = "modal__card";

      const image = document.createElement("img");
      image.src = work.imageUrl;
      image.alt = work.title;
      image.className = "modal__card-image";

      const bin = document.createElement("img");
      bin.src = "./assets/icons/bin.png";
      bin.alt = "bin";
      bin.className = "modal__card-bin";
      bin.id = "modal-card-bin";
      bin.setAttribute("data-id", work.id);
      bin.addEventListener("click", handleDeleteWork);

      card.appendChild(image);
      card.appendChild(bin);

      container.appendChild(card);
    });
  }

  if (context === "add") {
    const form = document.createElement("form");
    form.action = "#";
    form.id = "modal-form";

    const photoArea = document.createElement("div");
    photoArea.className = "modal__form-photo-area";
    photoArea.id = "form-photo-area";

    const fileGroup = document.createElement("div");
    fileGroup.className = "modal__form-file-group";

    const landscape = document.createElement("img");
    landscape.className = "modal__form-landscape";
    landscape.src = "./assets/icons/landscape.png";
    landscape.alt = "landscape";

    const fileLabel = document.createElement("label");
    fileLabel.htmlFor = "file";
    fileLabel.className = "modal__form-file-input-label";
    fileLabel.textContent = "+ Ajouter photo";

    const fileInput = document.createElement("input");
    fileInput.id = "file";
    fileInput.className = "modal__form-file-input";
    fileInput.type = "file";
    fileInput.name = "modal__form-file-input";
    const p = document.createElement("p");
    p.textContent = "jpg, png : 4mo max";

    fileGroup.appendChild(landscape);
    fileGroup.appendChild(fileLabel);
    fileGroup.appendChild(fileInput);
    fileGroup.appendChild(p);

    const titleFormGroup = document.createElement("div");
    titleFormGroup.classList.add("modal__form-group", "form-group-title");

    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "modal-form-title";
    titleLabel.textContent = "Titre";

    const titleInput = document.createElement("input");
    titleInput.id = "modal-form-title";
    titleInput.type = "text";
    titleInput.name = "title";

    const categoryFormGroup = document.createElement("div");
    categoryFormGroup.classList.add("modal__form-group", "form-group-category");

    const categoryLabel = document.createElement("label");
    categoryLabel.htmlFor = "modal-form-category";
    categoryLabel.textContent = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.id = "modal-form-category";
    categorySelect.name = "category";

    const categories = [
      { value: "", text: "" },
      { value: "1", text: "Objets" },
      { value: "2", text: "Appartements" },
      { value: "3", text: "Hotel & restaurants" },
    ];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.value;
      option.textContent = category.text;
      categorySelect.appendChild(option);
    });

    form.appendChild(photoArea);
    photoArea.appendChild(fileGroup);

    form.appendChild(titleFormGroup);
    titleFormGroup.appendChild(titleLabel);
    titleFormGroup.appendChild(titleInput);

    form.appendChild(categoryFormGroup);
    categoryFormGroup.appendChild(categoryLabel);
    categoryFormGroup.appendChild(categorySelect);

    form.addEventListener("input", checkValidityFormAndEnableButton);

    container.appendChild(form);
  }

  const formMessageDialog = document.createElement("p");
  formMessageDialog.id = "formMessageDialog";
  formMessageDialog.className = "formMessageDialog";

  const button = document.createElement("button");
  button.className = `modal__button ${
    context === "add" ? "modal__button--inactive modal__button-add-modal" : ""
  }`;
  button.id = "modalButton";
  button.setAttribute("data-modal", "add");
  button.textContent = context === "delete" ? "Ajouter une photo" : "Valider";
  button.disabled = context === "add";

  modalContent.appendChild(closeIcon);
  modalContent.appendChild(h1);
  modalContent.appendChild(container);
  context === "add" ? modalContent.appendChild(formMessageDialog) : "";
  modalContent.appendChild(button);
  modal.appendChild(modalContent);
  modal.children[0].addEventListener("click", function (e) {
    e.stopPropagation();
  });

  const cb = context === "delete" ? showModal : handleAddWork;
  button.addEventListener("click", cb);

  return modal;
}

export function showModal(e) {
  e.preventDefault();
  removeModal();
  const context = e.target.dataset.modal;
  const modal = buildModal(context, works);
  document.body.appendChild(modal);
  setEditMode(true);
}

export function removeModal() {
  const modal = document.querySelector("#modal");
  if (modal) {
    modal.remove();
    setEditMode(false);
    selectedFile = null;
  }
}

function checkValidityFormAndEnableButton(event) {
  if (event.target.id === "file") {
    selectedFile = event.target.files[0];
    showPreviewUploadFile(selectedFile);
  }

  const titleInput = document.querySelector("#modal-form-title");
  const selectInput = document.querySelector("#modal-form-category");
  const button = document.querySelector("#modalButton");
  let invalidFieldDetected = false;

  if (
    titleInput.value.trim().length < 1 ||
    selectInput.value == "" ||
    !selectedFile
  ) {
    invalidFieldDetected = true;
  }

  if (selectedFile) {
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const fileSize = selectedFile.size;
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const allowedMaxSize = 4194304;

    if (
      !allowedExtensions.includes(fileExtension) ||
      fileSize > allowedMaxSize
    ) {
      invalidFieldDetected = true;

      document.querySelector(".modal__form p").classList.add("error");

      removePreviewUploadFile();
    }
  }

  button.disabled = invalidFieldDetected;

  if (invalidFieldDetected) {
    button.classList.add("modal__button--inactive");
    document.querySelector("#formMessageDialog").innerText =
      "Tous les champs sont requis";
  } else {
    button.classList.remove("modal__button--inactive");
    document.querySelector("#formMessageDialog").innerText = "";
  }
}

function showPreviewUploadFile(selectedFile) {
  const src = URL.createObjectURL(selectedFile);
  const preview = document.querySelector("#form-photo-area");
  const fileGroup = document.querySelector(".modal__form-file-group");

  const img = document.createElement("img");
  img.className = "form__preview";
  img.id = "form-preview";
  img.src = src;
  img.alt = "preview";

  preview.appendChild(img);
  fileGroup.style.display = "none";
}

export function removePreviewUploadFile() {
  document.querySelector(".modal__form-file-group").style.display = "flex";
  const preview = document.querySelector("#form-preview");
  if (preview) {
    preview.remove();
  }
}

export function setSelectedFile(file) {
  selectedFile = file;
}
