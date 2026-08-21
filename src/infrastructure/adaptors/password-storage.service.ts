import type { IPasswordStorage } from "../../application/ports/index.ts";
import { Password } from "../../domain/password.ts";
import type { Collections } from "../database.ts";

/* 
The data is alway read cache-first.
- cacheRevalidation() gets fresh data from the db and fills the cache up.
- findAll(): reads from cache. If the cache is empty (ex. at startup) it revalidates it.
- when a new password is saved with save() it updates both the db and the revalidates the cache.
  - the downside is that there is no single source of truth for data (there is data duplication: cache and db).
  Also there is more a cognitive load because you need to bare in mind that you have to maintain 
  consistency for both the cache and the db. 
  Those trade-off are for the sake of performance though (fewer read roundtrips to the db).
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
      // todo: telemetry error log.
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
      // todo: telemetry error log.
      throw new Error("Could not save the password.");
    }
  }
  async findAll() {
    if (this.cache.passwords.size === 0) {
      await this.cacheRevalidation();
    }
    return Array.from(this.cache.passwords.entries()).map((v) => v);
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
      // todo: telemetry error log.
      throw new Error("Could retrieve the data.");
    }
  }
}
