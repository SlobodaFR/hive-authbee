import {AuthUseCases} from './auth-usecases';
import {Logger} from "../../../ports/output/logger";
import {ERRORS} from "./constants";
import {UserRepository} from "../../repositories/user";
import {EmailValidator} from "../../../ports/input/email-validator";
import {TokenRepository} from "../../repositories/token";

const logger: Logger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    verbose: jest.fn()
};

const emailValidator: EmailValidator = {
    isValid: jest.fn()
}

const userRepository: UserRepository = {
    upsert: jest.fn(),
};

const tokenRepository: TokenRepository = {
    renewForUserAndType: jest.fn(),
    getByValue: jest.fn(),
};

const email = "john.doe@example.org"
const authUseCases = new AuthUseCases(logger, emailValidator, userRepository, tokenRepository);

describe('Auth use cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("async getVerifyToken(params: GetVerifyTokenParams): Promise<GetVerifyTokenReturn | null>", () => {
        test("throw error on invalid email", async () => {
            jest.spyOn(emailValidator, "isValid").mockResolvedValue(false);

            await expect(authUseCases.getVerifyToken({email: ""})).rejects.toThrow(new Error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`));
            expect(emailValidator.isValid).toHaveBeenCalledWith("");
            await expect(authUseCases.getVerifyToken({email: "foobar"})).rejects.toThrow(new Error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`));
            expect(emailValidator.isValid).toHaveBeenCalledWith("foobar");
            expect(emailValidator.isValid).toHaveBeenCalledTimes(2);
        });

        beforeEach(() => {
            jest.spyOn(emailValidator, "isValid").mockResolvedValue(true);
            jest.spyOn(userRepository, "upsert").mockResolvedValue({id: "1", email});
            jest.spyOn(tokenRepository, "renewForUserAndType").mockResolvedValue({
                id: "1",
                user: {id: "1", email},
                tokenType: "VERIFY",
                value: "123456",
                expiresAt: new Date(),
                updatedAt: new Date()
            });


        });
        test("upsert user on valid email", async () => {
            await authUseCases.getVerifyToken({email});

            expect(userRepository.upsert).toHaveBeenCalledTimes(1);
        });

        test("create verify token on valid email", async () => {
            await authUseCases.getVerifyToken({email});

            expect(tokenRepository.renewForUserAndType).toHaveBeenCalledWith("1", "VERIFY");
        });

        test("return token on valid email", async () => {
            const result = await authUseCases.getVerifyToken({email});
            expect(result?.token).toBeTruthy();
        });
    });

    describe("async validateVerifyToken(params: ValidateVerifyTokenParams): Promise<ValidateVerifyTokenReturn | null>", () => {
        test('throw error on unknown token', async () => {
            jest.spyOn(tokenRepository, "getByValue").mockResolvedValue(null);

            await expect(authUseCases.validateVerifyToken({token: "123456"})).rejects.toThrow(new Error(`validateVerifyToken: ${ERRORS.UNKNOWN_TOKEN}`));
        });

        test('throw error on unknown token user', async () => {
            jest.spyOn(tokenRepository, "getByValue").mockResolvedValue({
                id: "1",
                tokenType: "VERIFY",
                value: "123456",
                expiresAt: new Date(),
                updatedAt: new Date()
            });

            await expect(authUseCases.validateVerifyToken({token: "123456"})).rejects.toThrow(new Error(`validateVerifyToken: ${ERRORS.UNKNOWN_TOKEN}`));
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

            await authUseCases.validateVerifyToken({token: "123456"});

            expect(tokenRepository.renewForUserAndType).toHaveBeenCalledWith("1", "ACCESS");

        });
    });
});
