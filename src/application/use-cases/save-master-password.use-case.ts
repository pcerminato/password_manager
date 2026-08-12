import { Password } from "../../domain/password.ts";
import type { IPasswordStorage, IEncryption } from "../ports/index.ts";

export class SaveMasterPasswordUseCase {
  private readonly storage: IPasswordStorage;
  private readonly encryptionService: IEncryption;
  constructor(storage: IPasswordStorage, encryptionService: IEncryption) {
    this.storage = storage;
    this.encryptionService = encryptionService;
  }
  async execute(password: Password) {
    password.validate();
    password.encrypted = this.encryptionService.hashSync(password.value);
    await this.storage.saveMaster(password);
  }
}
