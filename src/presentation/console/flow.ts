import promptModule from "prompt-sync";

import { logToConsole } from "./utils.ts";
import {
  EncryptionService,
  PasswordStorageService,
} from "../../infrastructure/index.ts";
import {
  SaveMasterPasswordUseCase,
  SaveNewPasswordUseCase,
} from "../../application/use-cases/index.ts";
import { Password } from "../../domain/password.ts";

const prompt = promptModule();

export async function promptLogin(
  validateMasterPassword: (
    userName: string,
    password: string,
  ) => Promise<boolean>,
): Promise<string | undefined> {
  let verified = false;
  let validUserName;

  logToConsole(`Hi there 👋
🔐 Enter your user name and the master password.`);

  while (!verified) {
    const userName = prompt("User name: ");
    const password = prompt("Password: ");

    if (userName === null || password === null) {
      logToConsole(
        "❌ The user name and the master password must be filled in.",
      );
      continue;
    }

    const ok = await validateMasterPassword(userName, password); //TODO: this is a use case

    if (ok) {
      logToConsole("😎 The password was correctly verified.");
      verified = true;
      validUserName = userName;
    } else {
      logToConsole("🤔 Wrong password. Try again.");
    }
  }
  //await showMenu();
  return Promise.resolve(validUserName);
}

export async function start({
  storageService,
  encryptionService,
}: {
  storageService: PasswordStorageService;
  encryptionService: EncryptionService;
}) {
  console.log("Hi there 👋");

  await showMenu();

  async function showMenu() {
    console.log(`Enter the number of an option from the list.
    1. List all passwords.
    2. Store a new password.
    3. Set a new master password.
    4. Exit.
  `);
    const input = prompt("Option: ");

    switch (input) {
      case "1":
        await viewPasswordsList();
        break;
      case "2":
        await promptAddPassword();
        break;
      case "3":
        await promptSetMasterPassword();
        break;
      case "4":
        process.exit();
      default:
        console.clear();
        logToConsole(`😮 "${input}" is not a valid option.`);
    }
    await showMenu();
  }

  async function viewPasswordsList() {
    logToConsole("📋 Passwords List");
    const passwordsList = await storageService.findAll();
    console.table(passwordsList);
  }

  async function saveMasterPassword(userName: string, password: string) {
    try {
      const useCase = new SaveMasterPasswordUseCase(
        storageService,
        encryptionService,
      );
      await useCase.execute(userName, Password.create(password));
      logToConsole("✅ The new master password has been set.");
    } catch (error) {
      if (error instanceof Error) {
        logToConsole(`⛔️ ${error.message}`);
      }
    }
  }

  async function savePassword(name: string, password: string) {
    try {
      const useCase = new SaveNewPasswordUseCase(storageService);
      await useCase.execute(name, password);
      logToConsole("✅ Password has been saved.");
    } catch (error) {
      if (error instanceof Error) {
        logToConsole(`⛔️ ${error.message}`);
      }
    }
  }

  async function promptSetMasterPassword() {
    logToConsole("🔐 Set a user name and a new master password.");
    const userName = prompt("User name (cannot be empty): ");
    const password = prompt("Password (8 chars min): ");

    await saveMasterPassword(userName, password);
  }

  async function promptAddPassword() {
    logToConsole("Save a new password");
    const name = prompt("Enter an identifier name: ");
    const password = prompt("Enter the password: ");

    if (!name.trim() || !password.trim()) {
      logToConsole(
        "⚠️  Cannot save the password. Either the name or the password are missing.",
      );
    } else {
      try {
        await savePassword(name, password);
      } catch (error) {
        if (error instanceof Error) {
          logToConsole(`⛔️ ${error.message}`);
        }
      }
    }
  }
}
