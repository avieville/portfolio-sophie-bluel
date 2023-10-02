import { updateAuthLink, updateEditLink } from "./auth.js";
import { WorkManager } from "./WorkManager.js";
import { CategoryButtonManager } from "./CategoryButtonManager.js";

await WorkManager.getWorks();
WorkManager.display();
CategoryButtonManager.display();

updateAuthLink();
updateEditLink();
