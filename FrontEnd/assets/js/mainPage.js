import serviceManager from "./ServiceManager.js";

const workManager = serviceManager.getWorkManager();
const categoryButtonManager = serviceManager.getCategoryButtonManager();
const authManager = serviceManager.getAuthManager();

await workManager.getWorks();
workManager.display();
categoryButtonManager.display();
authManager.updateAuthLink();
authManager.updateEditLink();

