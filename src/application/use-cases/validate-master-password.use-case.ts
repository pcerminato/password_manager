import type { IEncryption } from "../ports/index.ts";

export class ValidateMasterPasswordUseCase {
  private readonly encryption: IEncryption;
  constructor(encryption: IEncryption) {
    this.encryption = encryption;
  }
  async execute(
    userName: string,
    password: string,
    findHashByUserName: (userName: string) => Promise<{ hash: string } | null>,
  ) {
    const result = await findHashByUserName(userName);
    if (result !== null) {
      return await this.encryption.compare(password, result.hash);
    }
    return false;
  }
}
