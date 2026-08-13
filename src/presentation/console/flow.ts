import promptModule from "prompt-sync";

import {
  EncryptionService,
  PasswordStorageService,
} from "../../infrastructure/index.ts";
import { SaveMasterPasswordUseCase } from "../../application/use-cases/index.ts";
import { Password } from "../../domain/password.ts";

const storageService = new PasswordStorageService();
const encryptionService = new EncryptionService();

import { logToConsole } from "./utils.ts";

const prompt = promptModule();

export const start = showMenu;

function showMenu() {
  console.log(`Enter the number of an option from the list.
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit
  `);

  const input = prompt("Option: ");

  switch (input) {
    case "1":
      viewPasswords();
      break;
    case "2":
      promptSaveMasterPassword();
      break;
    case "3":
      promptOldMasterPassword();
      break;
    case "4":
      process.exit();
    default:
      console.clear();
      logToConsole(`😮 "${input}" is not a valid option.`);
      showMenu();
  }
}

function viewPasswords() {
  console.log("wip");
}

/* @alias saveNewPassword() */
async function saveMasterPassword(password: string) {
  try {
    const useCase = new SaveMasterPasswordUseCase(
      storageService,
      encryptionService,
    );
    await useCase.execute(Password.create(password));
    logToConsole("✅ Password has been saved.");
  } catch (error) {
    if (error instanceof Error) {
      logToConsole(`⛔️ ${error.message}`);
    }
  } finally {
    showMenu();
  }
}
/* @alias compareHashedPassword */
async function compareMasterPassword(password: string) {
  const master = storageService.getMaster();
  if (master !== null) {
    return await encryptionService.compare(password, master);
  }

  return false;
}

function promptSaveMasterPassword() {
  const response = prompt("Enter the master password (8 chars min): ");
  saveMasterPassword(response);
}

/* @alias promptOldPassword */
/* Compares the master password to the one entered in the prompt */
async function promptOldMasterPassword() {
  let verified = false;

  console.clear();

  while (!verified) {
    const response = prompt("Enter the master password: ");
    const ok = await compareMasterPassword(response);
    if (ok) {
      verified = true;
      logToConsole("😎 The password was correctly verified.");
      showMenu();
    } else {
      logToConsole("🤔 Wrong password. Try again.");
    }
  }
}
