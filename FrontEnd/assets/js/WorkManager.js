import serviceManager from "./ServiceManager.js";

export class WorkManager {
  constructor() {
    this.works = [];
  }

  async add(formData) {
    const http = serviceManager.getHttp();

    const token = localStorage.getItem("token");

    const isAdd = await http.createWork(formData, token);

    if (isAdd) {
      this.works = await http.fetchWorks();
      this.display();
      serviceManager.getFilterButtons().display();
      return true;
    } else {
      return false;
    }
  }

  async delete(e) {
    e.stopPropagation();

    const id = +e.target.dataset.id;
    const token = localStorage.getItem("token");

    const messageDialog = document.querySelector("#formMessageDialog");
    messageDialog.textContent = "";

    const isDeleted = await serviceManager.getHttp().deleteWork(id, token);

    if (isDeleted) {
      const newWorks = this.works.filter((work) => work.id !== id);
      this.works = newWorks;
      this.display(this.works);
      serviceManager.getFilterButtons().display();

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
    this.works = await serviceManager.http.fetchWorks();
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
