import type { IPasswordStorage } from "../../application/ports/index.ts";
import { Password } from "../../domain/password.ts";
import { Resource } from "../../domain/resource.ts";
import type { Collections } from "../database.ts";

/* 
The approach is of that data is read from the db only at startup and always from cache after that.
- cacheRevalidation() gets fresh data from the db and fills up the cache (in memory Map).
- findAll(): reads from cache. If the cache is empty, it revalidates it. This case happens only at startup.
- save(): when a new password is saved it updates both the db and the cache.
*/
type Cache = {
  passwords: Map<string, string>;
};

export class PasswordStorageService implements IPasswordStorage {
  private readonly cache: Cache;
  private readonly db: Collections;
  private readonly userName: string;
  constructor({ auth, passwords }: Collections, userName: string) {
    this.cache = { passwords: new Map() };
    this.db = { auth, passwords };
    this.userName = userName;
  }
  async saveMaster(userName: string, password: Password) {
    try {
      await this.db.auth.insertOne({
        name: userName,
        hash: password.encrypted,
      });
    } catch (_) {
      throw new Error("Could not save the master password.");
    }
  }
  async save(resource: string, password: string) {
    if (this.cache.passwords.size === 0) {
      await this.cacheRevalidation();
    }
    if (this.cache.passwords.has(resource)) {
      throw new Error(`There already is a password named "${resource}".`);
    }

    try {
      await this.db.passwords.insertOne({
        resource,
        password,
        userName: this.userName,
      });
      this.cache.passwords.set(resource, password);
    } catch (_) {
      throw new Error("Could not save the password.");
    }
  }
  async findAll() {
    if (this.cache.passwords.size === 0) {
      await this.cacheRevalidation();
    }
    return Array.from(this.cache.passwords.entries()).map(
      ([resource, password]) => new Resource(resource, password, this.userName),
    );
  }
  private async cacheRevalidation() {
    try {
      const data = await this.db.passwords
        .find({ userName: this.userName })
        .toArray();
      const result = data.map<[string, string]>(({ resource, password }) => [
        resource,
        password,
      ]);
      this.cache.passwords = new Map(result);
    } catch (_) {
      throw new Error("Could retrieve the data.");
    }
  }
}
