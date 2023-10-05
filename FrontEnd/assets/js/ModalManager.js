import { ModalFactory } from "./ModalFactory.js";
import serviceManager from "./ServiceManager.js";

export class ModalManager {
  constructor() {}

  show(e) {
    e.preventDefault();
    const modalType = e.target.dataset.modal;
    this.remove();
    const modal = new ModalFactory(modalType);
    document.body.appendChild(modal);
    serviceManager.editBar.setActivation(true);
  }

  remove() {
    const modal = document.querySelector("#modal");
    if (modal) {
      modal.remove();
      serviceManager.editBar.setActivation(false);
      serviceManager.workForm.selectedFile = null;
    }
  }
}
