import type { IEncryption } from "../ports/index.ts";

type FindHashByUserNameType = (
  userName: string,
) => Promise<{ hash: string } | null>;

export class ValidateMasterPasswordUseCase {
  private readonly encryption: IEncryption;
  private readonly findHashByUserName: FindHashByUserNameType;
  constructor(
    encryption: IEncryption,
    findHashByUserName: FindHashByUserNameType,
  ) {
    this.encryption = encryption;
    this.findHashByUserName = findHashByUserName;
  }
  async execute(userName: string, password: string) {
    const result = await this.findHashByUserName(userName);
    if (result !== null) {
      return await this.encryption.compare(password, result.hash);
    }
    return false;
  }
}
