import { ModalBuilder } from "./ModalBuilder.js";
import { setEditMode } from "./edit-bar.js";

export class ModalManager {
  static selectedFile = null;

  static show(e, works) {
    e.preventDefault();
    const context = e.target.dataset.modal;
    this.remove();
    const modal = ModalBuilder.create(context, works);
    document.body.appendChild(modal);
    setEditMode(true);
  }

  static remove() {
    const modal = document.querySelector("#modal");
    if (modal) {
      modal.remove();
      setEditMode(false);
      ModalManager.selectedFile = null;
    }
  }

  static checkValidityFormAndEnableButton(event) {
    if (event.target.id === "file") {
      ModalManager.selectedFile = event.target.files[0];
      this.showPreviewUploadFile(ModalManager.selectedFile);
    }

    const titleInput = document.querySelector("#modal-form-title");
    const selectInput = document.querySelector("#modal-form-category");
    const button = document.querySelector("#modalButton");
    let invalidFieldDetected = false;

    if (
      titleInput.value.trim().length < 1 ||
      selectInput.value == "" ||
      !ModalManager.selectedFile
    ) {
      invalidFieldDetected = true;
    }

    if (ModalManager.selectedFile) {
      const fileExtension = ModalManager.selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();
      const fileSize = ModalManager.selectedFile.size;
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

  static showPreviewUploadFile() {
    const src = URL.createObjectURL(ModalManager.selectedFile);
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

  static removePreviewUploadFile() {
    document.querySelector(".modal__form-file-group").style.display = "flex";
    const preview = document.querySelector("#form-preview");
    if (preview) {
      preview.remove();
    }
  }
}
