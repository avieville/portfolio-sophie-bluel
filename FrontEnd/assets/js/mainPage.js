import serviceManager from "./ServiceManager.js";

const workManager = serviceManager.getWorkManager();
const filterButtons = serviceManager.getFilterButtons();
const auth = serviceManager.getAuth();

await workManager.getWorks();
workManager.display();
filterButtons.display();
auth.updateAuthLink();
auth.updateEditLink();
