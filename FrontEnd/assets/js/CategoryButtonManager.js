import { WorkManager } from "./WorkManager.js";

export class CategoryButtonManager {
  static categories = [];

  static getList(works) {
    const categories = new Set(["Tous"]);
    works.forEach((projet) => {
      categories.add(projet.category.name);
    });
    return categories;
  }

  static display() {
    const works = WorkManager.works;
    const categories = this.getList(works);
    

    const filters = document.querySelector("#filters");
    filters.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.innerText = category;
      button.className = `filters__btn ${
        category === "Tous" ? "filters__btn--active" : ""
      }`;
      button.addEventListener("click", (e)=>WorkManager.filterAndDisplay(e));
      filters.appendChild(button);
    });
  }

  
}
