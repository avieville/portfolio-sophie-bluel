import serviceManager from "./ServiceManager.js";

export class ModalCreator {
  constructor(modalType) {
    this.modalType = modalType;

    this.modal = this.createEmptyModal();

    this.modalContent = this.modal.firstElementChild;

    modalType === "add" && this.addArrowLeftIcon();
    this.addCloseIcon();
    this.addTitle();
    this.addMainContent();
    this.addFormMessageDialog();
    this.addButton();
  }

  createEmptyModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";
    modal.role = "dialog";
    modal.addEventListener("click", () =>
      serviceManager.getModalManager().remove()
    );

    const modalContent = document.createElement("div");
    modalContent.className = "modal__content";
    modalContent.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    modal.appendChild(modalContent);

    return modal;
  }

  addArrowLeftIcon() {
    if (this.modalType === "add") {
      const arrowLeftIcon = document.createElement("img");
      arrowLeftIcon.src = "./assets/icons/arrow-left.png";
      arrowLeftIcon.alt = "arrow left";
      arrowLeftIcon.className = "modal__arrow-left";
      arrowLeftIcon.id = "modalArrowLeft";
      arrowLeftIcon.setAttribute("data-modal", "delete");
      arrowLeftIcon.addEventListener("click", (e) =>
        serviceManager.getModalManager().show(e, this.works)
      );
      this.modalContent.appendChild(arrowLeftIcon);
    }
    return this;
  }

  addCloseIcon() {
    const closeIcon = document.createElement("img");
    closeIcon.src = "./assets/icons/close.png";
    closeIcon.alt = "closing cross";
    closeIcon.className = "modal__closing-cross";
    closeIcon.id = "modal-closing-cross";
    closeIcon.addEventListener("click", () =>
      serviceManager.getModalManager().remove()
    );
    this.modalContent.appendChild(closeIcon);
    return this;
  }

  addTitle() {
    const h1 = document.createElement("h1");
    h1.className = "modal__title";
    h1.textContent =
      this.modalType === "delete" ? "Galerie Photo" : "Ajout photo";
    this.modalContent.appendChild(h1);
    return this;
  }

  addMainContent() {
    const workManager = serviceManager.getWorkManager();
    const mainContent = document.createElement("div");
    mainContent.className =
      this.modalType === "delete" ? "modal__cards" : "modal__form";

    if (this.modalType === "delete") {
      workManager.works.forEach((work) => {
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
        bin.addEventListener("click", (e) => workManager.delete(e));

        card.appendChild(image);
        card.appendChild(bin);

        mainContent.appendChild(card);
      });
    }

    if (this.modalType === "add") {
      const template = `
        <form action="#" id="modal-form">
          <div class="modal__form-photo-area" id="form-photo-area">
            <div class="modal__form-file-group">
              <img class="modal__form-landscape" src="./assets/icons/landscape.png" alt="landscape">
              <label for="file" class="modal__form-file-input-label">+ Ajouter photo</label>
              <input id="file" class="modal__form-file-input" type="file" name="modal__form-file-input">
              <span id="form-file-requirement-msg">jpg, png : 4mo max</span>
            </div>
            
          </div>
          <div class="modal__form-group form-group-title">
            <label for="modal-form-title">Titre</label>
            <input id="modal-form-title" type="text" name="title">
            <span class="form-error-message" id="modal-form-title-error">Ce champ doit contenir au minimum 3 caractères.</span>
          </div>
          <div class="modal__form-group form-group-category">
            <label for="modal-form-category">Catégorie</label>
            <select id="modal-form-category" name="category">
              <option value=""> </option>
              <option value="1">Objets</option>
              <option value="2">Appartements</option>
              <option value="3">Hotel & restaurants</option>
            </select>
            <span class="form-error-message" id="modal-form-select-error">Ce champ est invalide. Veuillez choisir une catégorie.</span>
          </div>
        </form>
      `;

      mainContent.innerHTML = template;

      const workForm = serviceManager.getWorkForm();
      workForm.initialize();

      const modalFormFile = mainContent.querySelector("#file");
      modalFormFile.addEventListener("change", (e) =>
        workForm.checkFileField(e)
      );

      const modalFormTitle = mainContent.querySelector("#modal-form-title");
      modalFormTitle.addEventListener("input", () =>
        workForm.checkTitleField()
      );

      const modalFormSelect = mainContent.querySelector("#modal-form-category");
      modalFormSelect.addEventListener("input", () =>
        workForm.checkSelectField()
      );
    }

    this.modalContent.appendChild(mainContent);

    return this;
  }

  addFormMessageDialog() {
    const formMessageDialog = document.createElement("p");
    formMessageDialog.id = "formMessageDialog";
    formMessageDialog.className = "formMessageDialog";
    this.modalContent.appendChild(formMessageDialog);
    return this;
  }

  addButton() {
    const button = document.createElement("button");
    button.className = `modal__button ${
      this.modalType === "add" ? "modal__button--inactive" : ""
    }`;
    button.id = "modalButton";
    button.setAttribute(
      "data-modal",
      this.modalType === "add" ? "delete" : "add"
    );
    button.textContent =
      this.modalType === "delete" ? "Ajouter une photo" : "Valider";
    button.disabled = this.modalType === "add";

    const callback =
      this.modalType === "delete"
        ? (e) => serviceManager.getModalManager().show(e, this.works)
        : () => serviceManager.getWorkForm().submitForm();
    button.addEventListener("click", callback);

    this.modalContent.appendChild(button);
    return this;
  }

  static create(modalType) {
    return new ModalCreator(modalType).modal;
  }
}
