import promptModule from "prompt-sync";

import { logToConsole } from "./utils.ts";
import {
  EncryptionService,
  PasswordStorageService,
} from "../../infrastructure/index.ts";
import { SaveMasterPasswordUseCase } from "../../application/use-cases/index.ts";
import { Password } from "../../domain/password.ts";

const storageService = new PasswordStorageService();
const encryptionService = new EncryptionService();
const prompt = promptModule();

export async function start() {
  const master = storageService.getMaster();

  console.log("Hi there 👋");

  if (!master) {
    await promptSetMasterPassword();
  } else {
    await promptVerifyMasterPassword();
  }
}

function showMenu() {
  const master = storageService.getMaster();
  let menu = `Enter the number of an option from the list. \n`;

  menu += master && "  1. List all passwords. \n";
  menu += "  2. Set a new master password. \n";
  menu += master && "  3. Verify the master password. \n";
  menu += "  4. Exit.";

  console.log(menu);

  const input = prompt("Option: ");

  if (master && input === "1") {
    viewPasswordsList();
    return;
  }
  if (input === "2") {
    promptSetMasterPassword();
    return;
  }
  if (master && input === "3") {
    promptVerifyMasterPassword();
    return;
  }
  if (input === "4") {
    process.exit();
  }

  console.clear();
  logToConsole(`😮 "${input}" is not a valid option.`);
  showMenu();
}

function viewPasswordsList() {
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

async function promptSetMasterPassword() {
  const response = prompt("Set the master password (8 chars min): ");
  await saveMasterPassword(response);
}

/* @alias promptOldPassword */
/* Compares the master password to the one entered in the prompt */
async function promptVerifyMasterPassword() {
  const response = prompt("Enter the master password: ");
  const ok = await compareMasterPassword(response);

  if (ok) {
    logToConsole("😎 The password was correctly verified.");
  } else {
    logToConsole("🤔 Wrong password. Try again.");
  }
  showMenu();
}
