import { describe, test, expect, beforeAll } from "vitest";
import { db } from "../../../tests/db-setup.ts";
import { PASSWORDS } from "../../../tests/db-seed.ts";
import { PasswordStorageService } from "./password-storage.service.ts";
import type { Auth, Passwords } from "../database.ts";

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
      )
        .map((psw) => [psw.resource, psw.password])
        .sort();

      expect(expectedValues.length).toEqual(results.length);

      results.sort().forEach((value, i) => {
        // compare resource
        expect(value[0]).toEqual(expectedValues[i][0]);
        // campares password
        expect(value[1]).toEqual(expectedValues[i][1]);
      });
    });
  });
});
