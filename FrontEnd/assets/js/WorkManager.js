import { CategoryButtonManager } from "./CategoryButtonManager.js";
import { ModalManager } from "./ModalManager.js";
import { ApiService } from "./ApiService.js";

export class WorkManager {
  static works = [];

  static async add() {
    const form = document.querySelector("#modal-form");
    const token = localStorage.getItem("token");
    const select = document.getElementById("modal-form-category");
    const messageDialog = document.querySelector("#formMessageDialog");

    const formData = new FormData();
    formData.append("image", ModalManager.selectedFile);
    formData.append("title", document.getElementById("modal-form-title").value);
    formData.append("category", select.options[select.selectedIndex].value);

    const isAdd = await (new ApiService()).addWork(formData, token);

    if (isAdd) {
      this.works = await (new ApiService()).getWorks();
      this.display(this.works);
      CategoryButtonManager.display(WorkManager.works);
      form.reset();
      ModalManager.removePreviewUploadFile();
      ModalManager.selectedFile = null;

      const button = document.querySelector("#modalButton");
      button.disabled = true;
      button.classList.add("modal__button--inactive");

      messageDialog.innerText = "Projet ajouté";
      document.querySelector(".modal__form p").classList.remove("error");
    } else {
      messageDialog.innerText = "Un problème s'est produit lors de l'ajout";
    }
  }

  static async delete(e) {
    e.stopPropagation();

    const id = +e.target.dataset.id;
    const token = localStorage.getItem("token");

    const messageDialog = document.querySelector("#formMessageDialog");
    messageDialog.textContent = "";

    const isDeleted = await (new ApiService()).deleteWork(id, token);

    if (isDeleted) {
      const newWorks = WorkManager.works.filter((work) => work.id !== id);
      WorkManager.works = newWorks;
      this.display(this.works);
      CategoryButtonManager.display(WorkManager.works);

      const cardDeleted = document.querySelector(
        `img[data-id="${id}"]`
      ).parentNode;

      if (cardDeleted) {
        cardDeleted.remove();
      }
    } else {
      messageDialog.innerText =
        "Un problème s'est produit lors de la suppression";
    }
  }

  static async getWorks() {
    this.works = await (new ApiService()).getWorks();
  }

  static async display(works = null) {
    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";

    const worksToDisplay = works || this.works;

    worksToDisplay.forEach((work) => {
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

  static filterAndDisplay(e) {

    document.querySelectorAll(".filters__btn").forEach((btn) => {
      btn.classList.remove("filters__btn--active");
    });

    e.target.classList.add("filters__btn--active");

    const filter = e.target.innerText;
 
    if (filter === "Tous") {
      WorkManager.display(this.works);
    } else {
      const worksFiltered = this.works.filter(
        (work) => filter === work.category.name
      );
      WorkManager.display(worksFiltered);
    }
  }
}
