import serviceManager from './ServiceManager.js';

export class WorkManager {
  
  constructor() {
    this.works = [];
  }

   async add() {
    const modalManager = serviceManager.getModalManager();
    const form = document.querySelector("#modal-form");
    const token = localStorage.getItem("token");
    const select = document.getElementById("modal-form-category");
    const messageDialog = document.querySelector("#formMessageDialog");

    const formData = new FormData();
    formData.append("image", serviceManager.getModalManager().selectedFile);
    formData.append("title", document.getElementById("modal-form-title").value);
    formData.append("category", select.options[select.selectedIndex].value);

    const isAdd = await serviceManager.getApiService().createWork(formData, token);

    if (isAdd) {
      this.works = await serviceManager.getApiService().getWorks();
      this.display();
      serviceManager.getCategoryButtonManager().display(this.works);
      form.reset();
      modalManager.removePreviewUploadFile();
      modalManager.selectedFile = null;

      const button = document.querySelector("#modalButton");
      button.disabled = true;
      button.classList.add("modal__button--inactive");

      messageDialog.innerText = "Projet ajouté";
      document.querySelector(".modal__form p").classList.remove("error");
    } else {
      messageDialog.innerText = "Un problème s'est produit lors de l'ajout";
    }
  }

   async delete(e) {
    e.stopPropagation();

    const id = +e.target.dataset.id;
    const token = localStorage.getItem("token");

    const messageDialog = document.querySelector("#formMessageDialog");
    messageDialog.textContent = "";

    const isDeleted = await serviceManager.getApiService().deleteWork(id, token);

    if (isDeleted) {
      const newWorks = this.works.filter((work) => work.id !== id);
      this.works = newWorks;
      this.display(this.works);
      serviceManager.getCategoryButtonManager().display(this.works);

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

  async getWorks() {
    this.works = await serviceManager.apiService.getWorks();
  }

  getCategories() {
    const categories = new Set(["Tous"]);
    this.works.forEach((work) => {
      categories.add(work.category.name);
    });
    return categories;
  }

  display(work = null) {
    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";

    const worksToDisplay = work || this.works;

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

  
}
