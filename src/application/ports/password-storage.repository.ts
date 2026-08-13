import { Password } from "../../domain/password.ts";

export interface IPasswordStorage {
  save: (name: string, password: string) => Promise<void>;
  saveMaster: (password: Password) => Promise<void>;
}
