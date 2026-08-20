import { vi, describe, test, beforeEach, type Mocked, expect } from "vitest";
import { IEncryption } from "../ports";
import { Password } from "../../domain/password";
import { ValidateMasterPasswordUseCase } from "./validate-master-password.use-case";

describe("Use Case > Validate Master Password", () => {
  let useCase: ValidateMasterPasswordUseCase;
  let mockEncryption: Mocked<IEncryption>;

  beforeEach(() => {
    mockEncryption = {
      compare: vi.fn(),
      hashSync: vi.fn(),
    };
    useCase = new ValidateMasterPasswordUseCase(mockEncryption);
  });
  test("Should get a valid master password", async () => {
    const userName = "master-user-name";
    const password = Password.create("abcd1234");
    const hash = "sl9isdflh832";
    const findHashByUserName = vi.fn().mockResolvedValue({ hash });

    mockEncryption.compare.mockResolvedValueOnce(true);

    const result = await useCase.execute(
      userName,
      password.value,
      findHashByUserName,
    );

    expect(result).toBe(true);
    expect(findHashByUserName).toHaveBeenCalledExactlyOnceWith(userName);
    expect(mockEncryption.compare).toHaveBeenCalledExactlyOnceWith(
      password.value,
      hash,
    );
  });
  test("Should get an invalid master password", async () => {
    const userName = "master-user-name";
    const password = Password.create("abcd1234");
    const findHashByUserName = vi.fn().mockResolvedValue(null);

    mockEncryption.compare.mockResolvedValueOnce(false);

    const result = await useCase.execute(
      userName,
      password.value,
      findHashByUserName,
    );

    expect(result).toBe(false);
    expect(findHashByUserName).toHaveBeenCalledExactlyOnceWith(userName);
    expect(mockEncryption.compare).not.toHaveBeenCalled();
  });
});
