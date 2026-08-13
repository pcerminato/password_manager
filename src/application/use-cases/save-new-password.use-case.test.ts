import { vi, describe, test, beforeEach, type Mocked, expect } from "vitest";
import { SaveNewPasswordUseCase } from "./save-new-password.use-case";
import { IPasswordStorage, IEncryption } from "../ports";
import { Password } from "../../domain/password";

describe("Use Case > Save New Password", () => {
  let useCase: SaveNewPasswordUseCase;
  let mockPasswordStorage: Mocked<IPasswordStorage>;

  beforeEach(() => {
    mockPasswordStorage = {
      save: vi.fn(),
      saveMaster: vi.fn(),
    };
    useCase = new SaveNewPasswordUseCase(mockPasswordStorage);
  });
  test("Should create a valid password", async () => {
    const name = "https://website.com";
    const password = "abcd1234";
    await useCase.execute(name, password);

    expect(mockPasswordStorage.save).toHaveBeenCalledExactlyOnceWith(
      name,
      password,
    );
  });
});
