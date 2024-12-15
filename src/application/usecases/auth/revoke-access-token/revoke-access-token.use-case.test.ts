import { Logger } from "../../../../ports/output/logger";
import { TokenRepository } from "../../../repositories/token";
import { RevokeAccessTokenUseCase } from "./revoke-access-token.use-case";

const logger: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
  verbose: jest.fn(),
};

const tokenRepository: TokenRepository = {
  renewForUserAndType: jest.fn(),
  getByValue: jest.fn(),
  revokeToken: jest.fn(),
};

const token = "123456";

describe("RevokeAccessToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const revokeAccessTokenUseCase = new RevokeAccessTokenUseCase(
    logger,
    tokenRepository,
  );

  test("return false if token is not found", async () => {
    jest.spyOn(tokenRepository, "revokeToken").mockResolvedValue(false);

    const result = await revokeAccessTokenUseCase.execute({ token });

    expect(tokenRepository.revokeToken).toHaveBeenCalledWith(token, "ACCESS");
    expect(result).toEqual({ success: false });
  });

  test("return true if token is found", async () => {
    jest.spyOn(tokenRepository, "revokeToken").mockResolvedValue(true);

    const result = await revokeAccessTokenUseCase.execute({ token });

    expect(tokenRepository.revokeToken).toHaveBeenCalledWith(token, "ACCESS");
    expect(result).toEqual({ success: true });
  });
});
