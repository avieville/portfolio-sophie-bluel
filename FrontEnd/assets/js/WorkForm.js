import serviceManager from "./ServiceManager.js";

export class WorkForm {
  constructor() {
    this.selectedFile = null;
    this.isValidInputFileField = false;
    this.isValidInputTitleField = false;
    this.isValidInputSelectField = false;
  }

  checkFileField(event) {
    this.selectedFile = event.target.files[0];

    const fileExtension = this.selectedFile.name.split(".").pop().toLowerCase();
    const fileSize = this.selectedFile.size;
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const allowedMaxSize = 4194304;

    const isValid =
      allowedExtensions.includes(fileExtension) && fileSize < allowedMaxSize;

    const formPhotoArea = document.getElementById("form-photo-area");
    const requirementMessage = document.getElementById(
      "form-file-requirement-msg"
    );

    if (isValid) {
      this.showPreviewUploadFile(this.selectedFile);
      this.isValidInputFileField = true;
      formPhotoArea.classList.remove("form-error-border");
      requirementMessage.classList.remove(
        "form-error-message",
        "form-error-visible"
      );
      requirementMessage.innerText = "jpg, png : 4mo max";
    } else {
      this.isValidInputFileField = false;
      formPhotoArea.classList.add("form-error-border");
      requirementMessage.classList.add(
        "form-error-message",
        "form-error-visible"
      );
      requirementMessage.innerText =
        "⛔ Fichier invalide. Format jpg ou png, 4Mo Max.";
    }

    this.checkValidityForm();
  }

  checkTitleField() {
    const titleInput = document.querySelector("#modal-form-title");
    const errorSpan = document.querySelector("#modal-form-title-error");
    const isValid = titleInput.value.trim().length > 2;
    if (isValid) {
      errorSpan.classList.remove("form-error-visible");
      this.isValidInputTitleField = true;
    } else {
      errorSpan.classList.add("form-error-visible");
      this.isValidInputTitleField = false;
    }
    this.checkValidityForm();
  }

  checkSelectField() {
    const selectInput = document.querySelector("#modal-form-category");
    const errorSpan = document.querySelector("#modal-form-select-error");
    const isValid = selectInput.value;
    if (isValid) {
      errorSpan.classList.remove("form-error-visible");
      this.isValidInputSelectField = true;
    } else {
      errorSpan.classList.add("form-error-visible");
      this.isValidInputSelectField = false;
    }
    this.checkValidityForm();
  }

  checkValidityForm() {
    const button = document.querySelector("#modalButton");

    const isValid =
      this.isValidInputFileField &&
      this.isValidInputTitleField &&
      this.isValidInputSelectField;

    button.disabled = !isValid;

    if (isValid) {
      button.classList.remove("modal__button--inactive");
    } else {
      button.classList.add("modal__button--inactive");
    }
  }

  showPreviewUploadFile() {
    const src = URL.createObjectURL(this.selectedFile);
    const preview = document.querySelector("#form-photo-area");

    const img = document.createElement("img");
    img.className = "form__preview";
    img.id = "form-preview";
    img.src = src;
    img.alt = "preview";

    preview.appendChild(img);
    document.querySelector(".modal__form-file-group").classList.add("d-none");
  }

  removePreviewUploadFile() {
    document
      .querySelector(".modal__form-file-group")
      .classList.remove("d-none");

    const preview = document.querySelector("#form-preview");
    if (preview) {
      preview.remove();
    }
  }

  async submitForm() {
    const messageDialog = document.querySelector("#formMessageDialog");

    const formData = new FormData();

    formData.append("image", this.selectedFile);
    formData.append("title", document.getElementById("modal-form-title").value);
    formData.append(
      "category",
      document.querySelector("#modal-form-category").value
    );

    const workManager = serviceManager.getWorkManager();

    const hasBeenAdded = await workManager.add(formData);

    if (hasBeenAdded) {
      messageDialog.innerText = "Projet ajouté";

      const form = document.querySelector("#modal-form");
      form.reset();
      this.removePreviewUploadFile();
      this.selectedFile = null;
      this.isValidInputFileField = false;
      this.isValidInputTitleField = false;
      this.isValidInputSelectField = false;

      const button = document.querySelector("#modalButton");
      button.disabled = true;
      button.classList.add("modal__button--inactive");
    } else {
      messageDialog.innerText = "Un problème s'est produit lors de l'ajout";
    }
  }

  initialize() {
    this.selectedFile = null;
    this.isValidInputFileField = false;
    this.isValidInputTitleField = false;
    this.isValidInputSelectField = false;
  }
}
