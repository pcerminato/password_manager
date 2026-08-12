import { vi, describe, test, beforeEach, type Mocked, expect } from "vitest";
import { SaveNewPasswordUseCase } from "./save-new-password.use-case";
import { IPasswordStorage, IEncryption } from "../ports";
import { Password } from "../../domain/password";

describe("Use Case > Save New Password", () => {
  let useCase: SaveNewPasswordUseCase;
  let mockPasswordStorage: Mocked<IPasswordStorage>;
  let mockEncryption: Mocked<IEncryption>;

  beforeEach(() => {
    mockPasswordStorage = {
      save: vi.fn(),
    };
    mockEncryption = {
      compare: vi.fn(),
      hashSync: vi.fn(),
    };
    useCase = new SaveNewPasswordUseCase(mockPasswordStorage, mockEncryption);
  });
  test("Should create a valid password", async () => {
    const password = Password.create("abcd1234");
    await useCase.execute(password);

    expect(mockPasswordStorage.save).toHaveBeenCalledExactlyOnceWith(password);
    expect(mockEncryption.hashSync).toHaveBeenCalledExactlyOnceWith(
      password.value,
    );
  });
  test("Should throw an error for an invalid password", async () => {
    const password = Password.create("abcd123"); // short password

    await expect(useCase.execute(password)).rejects.toThrow(
      "The password must have at least 8 characters.",
    );
    expect(mockPasswordStorage.save).not.toHaveBeenCalled();
    expect(mockEncryption.hashSync).not.toHaveBeenCalled();
  });
});
