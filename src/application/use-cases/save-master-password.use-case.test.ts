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
      findAll: vi.fn(),
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
    const userName = "master-user-name";
    const password = Password.create("abcd1234");
    await useCase.execute(userName, password);

    expect(mockPasswordStorage.saveMaster).toHaveBeenCalledExactlyOnceWith(
      userName,
      password,
    );
    expect(mockEncryption.hashSync).toHaveBeenCalledExactlyOnceWith(
      password.value,
    );
  });
  test("Should throw an error for an invalid master password", async () => {
    const userName = "master-user-name";
    const password = Password.create(""); // short password

    await expect(useCase.execute(userName, password)).rejects.toThrow(
      "The password must have at least 8 characters.",
    );
    expect(mockPasswordStorage.saveMaster).not.toHaveBeenCalled();
    expect(mockEncryption.hashSync).not.toHaveBeenCalled();
  });
});
