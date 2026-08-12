import { Password } from "../../domain/password";
import { IPasswordStorage, IEncryption } from "../ports/";

export class SaveNewPasswordUseCase {
  constructor(
    private readonly storage: IPasswordStorage,
    private readonly encryptionService: IEncryption,
  ) {}
  async execute(password: Password) {
    password.validate();
    password.encrypted = this.encryptionService.hashSync(password.value);
    await this.storage.save(password);
  }
}
