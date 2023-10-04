import { ApiService } from './ApiService.js';
import { WorkManager } from './WorkManager.js';
import { CategoryButtonManager } from './CategoryButtonManager.js';
import { ModalManager } from './ModalManager.js';
import { EditBarManager } from './EditBarManager.js';
import { AuthManager } from './AuthManager.js'


class ServiceManager {
  constructor() {
    this.apiService = new ApiService();
    this.workManager = new WorkManager();
    this.categoriyButtonManager = new CategoryButtonManager();
    this.modalManager = new ModalManager();
    this.editBarManager = new EditBarManager();
    this.authManager = new AuthManager();

  }

  getApiService() {
    return this.apiService;
  }

  getWorkManager() {
    return this.workManager;
  }

  getCategoryButtonManager() {
    return this.categoriyButtonManager;
  }

  getModalManager() {
    return this.modalManager;
  }

  getEditBarManager() {
    return this.editBarManager;
  }

  getAuthManager() {
    return this.authManager;
  }

}

const serviceManager = new ServiceManager();

export default serviceManager;



