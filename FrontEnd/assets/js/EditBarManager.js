export class EditBarManager {
    constructor() {
      this.isEditMode = false;
    }
  
    setActivation(value) {
      this.isEditMode = value;
      this.isEditMode ? this.display() : this.delete();
    }
  
    display() {
      const element = document.querySelector("#edit-bar");
      if (!element) {
        const htmlString =
          '<div class="edit-bar" id="edit-bar"><img src="./assets/icons/edit-white.png" alt="edit">Mode édition</div>';
        document.body.insertAdjacentHTML("afterbegin", htmlString);
        document.querySelector("header").style.marginTop = "97px";
      }
    }
  
    delete() {
      const element = document.querySelector(".edit-bar");
      element ? element.remove() : "";
    }
  }
