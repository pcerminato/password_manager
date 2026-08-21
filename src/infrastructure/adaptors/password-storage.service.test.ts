import { describe, test, expect, beforeAll } from "vitest";
import { PasswordStorageService } from "./password-storage.service.ts";
import type { Auth, Passwords } from "../database.ts";
import { db } from "../../../tests/db-setup.ts";
import { PASSWORDS } from "../../../tests/db-seed.ts";

describe("Service > Password Storage", () => {
  let auth: any;
  let passwords: any;

  beforeAll(() => {
    auth = db.collection<Auth>("auth");
    passwords = db.collection<Passwords>("passwords");
  });

  describe("findAll()", () => {
    test("Should retrieve only the passwords for the authenticated user", async () => {
      const userName = "pmacartney";
      const service = new PasswordStorageService({ auth, passwords }, userName);
      const results = await service.findAll();

      const expectedValues = PASSWORDS.filter(
        (psw) => psw.userName === userName,
      ).sort((prev, curr) => prev.resource.localeCompare(curr.resource));

      expect(expectedValues.length).toEqual(results.length);

      results
        .sort((prev, curr) => prev.name.localeCompare(curr.name))
        .forEach((_, i) => {
          expect(results[i].name).toEqual(expectedValues[i].resource);
          expect(results[i].password.value).toEqual(expectedValues[i].password);
        });
    });
  });
});
