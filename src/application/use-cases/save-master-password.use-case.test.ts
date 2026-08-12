import { vi, describe, test, beforeEach, type Mocked, expect } from "vitest";
import { SaveMasterPasswordUseCase } from "./save-master-password.use-case";
import { IPasswordStorage, IEncryption } from "../ports";
import { Password } from "../../domain/password";

describe("Use Case > Save New Password", () => {
  let useCase: SaveMasterPasswordUseCase;
  let mockPasswordStorage: Mocked<IPasswordStorage>;
  let mockEncryption: Mocked<IEncryption>;

  beforeEach(() => {
    mockPasswordStorage = {
      save: vi.fn(),
      saveMaster: vi.fn(),
    };
    mockEncryption = {
      compare: vi.fn(),
      hashSync: vi.fn(),
    };
    useCase = new SaveMasterPasswordUseCase(
      mockPasswordStorage,
      mockEncryption,
    );
  });
  test("Should save a valid master password", async () => {
    const password = Password.create("abcd1234");
    await useCase.execute(password);

    expect(mockPasswordStorage.saveMaster).toHaveBeenCalledExactlyOnceWith(
      password,
    );
    expect(mockEncryption.hashSync).toHaveBeenCalledExactlyOnceWith(
      password.value,
    );
  });
  test("Should throw an error for an invalid master password", async () => {
    const password = Password.create(""); // short password

    await expect(useCase.execute(password)).rejects.toThrow(
      "The password must have at least 8 characters.",
    );
    expect(mockPasswordStorage.saveMaster).not.toHaveBeenCalled();
    expect(mockEncryption.hashSync).not.toHaveBeenCalled();
  });
});
