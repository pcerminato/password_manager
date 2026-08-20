import { Collection } from "mongodb";
import type { IEncryption } from "../../application/ports/encryption.ts";
import type { Auth } from "../../infrastructure/database.ts";
import { ValidateMasterPasswordUseCase } from "../../application/use-cases/index.ts";

export function logToConsole(message: string) {
  console.clear();
  console.log(`${message}\n`);
}

export function masterPasswordValidator(
  authCollection: Collection<Auth>,
  encryptionService: IEncryption,
) {
  const findHashByUserName = async (userName: string) => {
    const result = await authCollection.findOne({ name: userName });
    if (result === undefined || result === null) return null;
    return { hash: result.hash };
  };
  const validatePasswordUseCase = new ValidateMasterPasswordUseCase(
    encryptionService,
    findHashByUserName,
  );
  return (userName: string, password: string) =>
    validatePasswordUseCase.execute(userName, password);
}
