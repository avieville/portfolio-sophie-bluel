import { Http } from "./Http.js";
import { WorkManager } from "./WorkManager.js";
import { FilterButtons } from "./FilterButtons.js";
import { ModalManager } from "./ModalManager.js";
import { EditBar } from "./EditBar.js";
import { Auth } from "./Auth.js";
import { WorkForm } from "./WorkForm.js";

class ServiceManager {
  constructor() {
    this.http = new Http();
    this.workManager = new WorkManager();
    this.filterButtons = new FilterButtons(this.workManager);
    this.modalManager = new ModalManager();
    this.editBar = new EditBar();
    this.auth = new Auth();
    this.workForm = new WorkForm();
  }

  getHttp() {
    return this.http;
  }

  getWorkManager() {
    return this.workManager;
  }

  getFilterButtons() {
    return this.filterButtons;
  }

  getModalManager() {
    return this.modalManager;
  }

  getEditBar() {
    return this.editBar;
  }

  getAuth() {
    return this.auth;
  }

  getWorkForm() {
    return this.workForm;
  }
}

const serviceManager = new ServiceManager();

export default serviceManager;
