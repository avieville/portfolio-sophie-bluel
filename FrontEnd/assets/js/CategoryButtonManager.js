import serviceManager from "./ServiceManager.js";

export class CategoryButtonManager {
  

   display() {

    const workManager = serviceManager.getWorkManager(); 
    const categories = workManager.getCategories();

    const filters = document.querySelector("#filters");
    filters.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.innerText = category;
      button.className = `filters__btn ${
        category === "Tous" ? "filters__btn--active" : ""
      }`;
      button.addEventListener("click", (e)=>this.filterAndDisplay(e));
      filters.appendChild(button);
    });
  }

  filterAndDisplay(e) {
    const workManager = serviceManager.getWorkManager(); 
    
    document.querySelectorAll(".filters__btn").forEach((btn) => {
      btn.classList.remove("filters__btn--active");
    });

    
    e.target.classList.add("filters__btn--active");

    const filter = e.target.innerText;
    
    if (filter === "Tous") {
      workManager.display(workManager.works);
    } else {
      const worksFiltered = workManager.works.filter(
        (work) => filter === work.category.name
      );
      workManager.display(worksFiltered);
    }
  }

  
}
