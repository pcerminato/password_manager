export class Password {
  constructor(
    private readonly _value: string,
    private _encrypted: string,
  ) {}
  public get value(): string {
    return this._value;
  }
  public get encrypted(): string {
    return this._encrypted;
  }

  public set encrypted(v: string) {
    this._encrypted = v;
  }
  static create(value: string) {
    return new Password(value, "");
  }
  validate() {
    if (this._value === "" || this._value.length < 8) {
      throw new Error("The password must have at least 8 characters.");
    }
  }
}
