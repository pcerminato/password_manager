export class Password {
  readonly value: string;
  readonly encrypted: string;
  constructor(value: string, encrypted: string) {
    this.value = value;
    this.encrypted = encrypted;
  }
  static create(value: string, encrypted?: string) {
    return new Password(value, encrypted || "");
  }
  validate() {
    if (this.value === "" || this.value.length < 8) {
      throw new Error("The password must have at least 8 characters.");
    }
  }
}
