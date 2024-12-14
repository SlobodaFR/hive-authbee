import {Logger} from "../../../../ports/output/logger";
import {TokenRepository} from "../../../repositories/token";
import {ValidateVerifyTokenUseCase} from "./validate-verify-token.use-case";
import {ERRORS} from "./constants";

const logger: Logger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    verbose: jest.fn()
};

const tokenRepository: TokenRepository = {
    renewForUserAndType: jest.fn(),
    getByValue: jest.fn(),
};

const email = "john.doe@example.org"

describe("ValidateVerifyTokenParams", () => {

    const validateVerifyTokenUseCase = new ValidateVerifyTokenUseCase(
        logger,
        tokenRepository
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('throw error on unknown token', async () => {
        jest.spyOn(tokenRepository, "getByValue").mockResolvedValue(null);

        await expect(validateVerifyTokenUseCase.validateVerifyToken({token: "123456"})).rejects.toThrow(new Error(`validateVerifyToken: ${ERRORS.UNKNOWN_TOKEN}`));
    });

    test('throw error on unknown token user', async () => {
        jest.spyOn(tokenRepository, "getByValue").mockResolvedValue({
            id: "1",
            user: undefined,
            tokenType: "VERIFY",
            value: "123456",
            expiresAt: new Date(),
            updatedAt: new Date()
        });

        await expect(validateVerifyTokenUseCase.validateVerifyToken({token: "123456"})).rejects.toThrow(new Error(`validateVerifyToken: ${ERRORS.NOT_LINKED_TO_USER}`));
    });

    test("create access token on valid token", async () => {
        jest.spyOn(tokenRepository, "getByValue").mockResolvedValue({
            id: "1",
            user: {id: "1", email},
            tokenType: "VERIFY",
            value: "123456",
            expiresAt: new Date(),
            updatedAt: new Date()
        });
        jest.spyOn(tokenRepository, "renewForUserAndType").mockResolvedValue({
            expiresAt: new Date(),
            value: "654321",
            user: {id: "1", email},
            tokenType: "ACCESS",
            updatedAt: new Date(),
            id: "2"
        });

        await validateVerifyTokenUseCase.validateVerifyToken({token: "123456"});

        expect(tokenRepository.renewForUserAndType).toHaveBeenCalledWith("1", "ACCESS");
    });
});
