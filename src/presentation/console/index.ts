import { connect } from "../../infrastructure/database.ts";
import { PasswordStorageService } from "../../infrastructure/index.ts";
import { start } from "./flow.ts";

(async function () {
  try {
    const collections = await connect();
    const storageService = new PasswordStorageService(collections);

    start({
      storageService,
    });
  } catch (error) {}
})();
