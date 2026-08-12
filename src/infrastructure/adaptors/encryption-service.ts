import bcrypt from "bcrypt";
import type { IEncryption } from "../../application/ports/index.ts";

export class EncryptionService implements IEncryption {
  async compare(value: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(value, encrypted);
  }
  hashSync(value: string): string {
    return bcrypt.hashSync(value, 10);
  }
}
