import { connect } from "../../infrastructure/database.ts";
import {
  EncryptionService,
  PasswordStorageService,
} from "../../infrastructure/index.ts";
import { start, promptLogin } from "./flow.ts";
import { masterPasswordValidator } from "./utils.ts";

(async function () {
  try {
    const collections = await connect();
    const encryptionService = new EncryptionService();
    const userName = await promptLogin(
      masterPasswordValidator(collections.auth, encryptionService),
    );
    const storageService = new PasswordStorageService(collections, userName!);

    start({
      storageService,
      encryptionService,
    });
  } catch (error) {
    console.error(error);
  }
})();
