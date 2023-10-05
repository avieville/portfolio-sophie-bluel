export class FilterButtons {
  constructor(workManager) {
    this.workManager = workManager;
  }

  display() {
    const categories = this.workManager.getCategories();

    const filters = document.querySelector("#filters");
    filters.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.innerText = category;
      button.className = `filters__btn ${
        category === "Tous" ? "filters__btn--active" : ""
      }`;
      button.addEventListener("click", (e) => this.manageFilterSelection(e));
      filters.appendChild(button);
    });
  }

  manageFilterSelection(e) {
    document.querySelectorAll(".filters__btn").forEach((btn) => {
      btn.classList.remove("filters__btn--active");
    });

    e.target.classList.add("filters__btn--active");

    const filter = e.target.innerText;

    if (filter === "Tous") {
      this.workManager.display(this.workManager.works);
    } else {
      const worksFiltered = this.workManager.works.filter(
        (work) => filter === work.category.name
      );
      this.workManager.display(worksFiltered);
    }
  }
}
