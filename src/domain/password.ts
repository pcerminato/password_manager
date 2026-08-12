export class Password {
  private readonly _value: string;
  private _encrypted: string;
  constructor(_value: string, _encrypted: string) {
    this._value = _value;
    this._encrypted = _encrypted;
  }
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
