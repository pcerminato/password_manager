import type { IPasswordStorage } from "../../application/ports/index.ts";
import { Password } from "../../domain/password.ts";

// TODO: at this iteration the store is in-memory. In a later iteration it'll be a DB.
type StoreType = {
  hash: string | null;
  passwords: {
    [key: string]: string;
  };
};

export class PasswordStorageService implements IPasswordStorage {
  private readonly store: StoreType;
  constructor() {
    this.store = { hash: "", passwords: {} };
  }
  async saveMaster(password: Password): Promise<void> {
    this.store.hash = password.encrypted;
  }
  async save(password: Password): Promise<void> {
    this.store.passwords["some-todo-key"] = password.encrypted;
  }
  getMaster() {
    return this.store.hash;
  }
}
