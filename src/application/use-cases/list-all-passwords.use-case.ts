import type { IPasswordStorage } from "../ports/index.ts";

export class ListAllPasswordsUseCase {
  private readonly storage: IPasswordStorage;
  constructor(storage: IPasswordStorage) {
    this.storage = storage;
  }
  async execute() {
    return await this.storage.findAll();
  }
}
