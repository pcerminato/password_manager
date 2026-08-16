import { Password } from "../../domain/password.ts";

export interface IPasswordStorage {
  save: (name: string, password: string) => Promise<void>;
  saveMaster: (userName: string, password: Password) => Promise<void>;
  findAll: () => Promise<[string, string][]>;
}
