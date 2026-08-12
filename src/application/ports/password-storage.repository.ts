import { Password } from "../../domain/password.ts";

export interface IPasswordStorage {
  save: (password: Password) => Promise<void>;
  saveMaster: (password: Password) => Promise<void>;
}
