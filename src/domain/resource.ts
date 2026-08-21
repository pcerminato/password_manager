import { Password } from "./password.ts";

export class Resource {
  readonly name: string;
  readonly password: Password;
  readonly userName: string;
  constructor(name: string, password: string, userName: string) {
    this.name = name;
    this.password = Password.create(password);
    this.userName = userName;
  }
}
