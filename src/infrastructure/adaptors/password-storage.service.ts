import type { IPasswordStorage } from "../../application/ports/index.ts";
import { Password } from "../../domain/password.ts";

// TODO: at this iteration the store is in-memory. In a later iteration it'll be a DB.
type StoreType = {
  hash: string | null;
  passwords: Map<string, string>;
};

export class PasswordStorageService implements IPasswordStorage {
  private readonly store: StoreType;
  constructor() {
    this.store = { hash: "", passwords: new Map() };
  }
  async saveMaster(password: Password): Promise<void> {
    this.store.hash = password.encrypted;
  }
  async save(name: string, password: string): Promise<void> {
    if (this.store.passwords.has(name)) {
      throw new Error(`There already is a password named "${name}."`);
    }
    this.store.passwords.set(name, password);
  }
  getMaster() {
    return this.store.hash;
  }
}
