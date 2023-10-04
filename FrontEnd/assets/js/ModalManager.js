import { ModalBuilder } from "./ModalBuilder.js";
import serviceManager from "./ServiceManager.js";


export class ModalManager {
  constructor() {
    this.selectedFile = null;
  }

  show(e, works) {
    e.preventDefault();
    const context = e.target.dataset.modal;
    this.remove();
    const modal = ModalBuilder.create(context, works);
    document.body.appendChild(modal);
    serviceManager.editBarManager.setActivation(true);
  }

  remove() {
    const modal = document.querySelector("#modal");
    if (modal) {
      modal.remove();
      serviceManager.editBarManager.setActivation(false);
      this.selectedFile = null;
    }
  }

  checkValidityFormAndEnableButton(event) {
    if (event.target.id === "file") {
      this.selectedFile = event.target.files[0];
      this.showPreviewUploadFile(this.selectedFile);
    }

    const titleInput = document.querySelector("#modal-form-title");
    const selectInput = document.querySelector("#modal-form-category");
    const button = document.querySelector("#modalButton");
    let invalidFieldDetected = false;

    

    if (
      titleInput.value.trim().length < 1 ||
      selectInput.value == "" ||
      !this.selectedFile
    ) {
      invalidFieldDetected = true;
    }

    

    if (this.selectedFile) {
      const fileExtension = this.selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();
      const fileSize = this.selectedFile.size;
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const allowedMaxSize = 4194304;

      

      if (
        !allowedExtensions.includes(fileExtension) ||
        fileSize > allowedMaxSize
      ) {
        invalidFieldDetected = true;

        document.querySelector(".modal__form p").classList.add("error");

        ModalManager.removePreviewUploadFile();
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

  showPreviewUploadFile() {
    const src = URL.createObjectURL(this.selectedFile);
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

  removePreviewUploadFile() {
    document.querySelector(".modal__form-file-group").style.display = "flex";
    const preview = document.querySelector("#form-preview");
    if (preview) {
      preview.remove();
    }
  }
}
