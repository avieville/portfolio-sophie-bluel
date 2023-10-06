export class WorkForm {
  constructor() {
    this.selectedFile = null;
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

        this.removePreviewUploadFile();
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
    
    const img = document.createElement("img");
    img.className = "form__preview";
    img.id = "form-preview";
    img.src = src;
    img.alt = "preview";

    preview.appendChild(img);
    document.querySelector(".modal__form-file-group").classList.add('d-none');
  }

  removePreviewUploadFile() {
    document.querySelector(".modal__form-file-group").classList.remove('d-none');
    
    const preview = document.querySelector("#form-preview");
    if (preview) {
      preview.remove();
    }
  }
}
