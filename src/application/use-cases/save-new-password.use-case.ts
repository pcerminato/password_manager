import type { IPasswordStorage } from "../ports/index.ts";

export class SaveNewPasswordUseCase {
  private readonly storage: IPasswordStorage;
  constructor(storage: IPasswordStorage) {
    this.storage = storage;
  }
  async execute(name: string, password: string) {
    await this.storage.save(name, password);
  }
}
