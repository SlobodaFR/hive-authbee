import {GetVerifyTokenUseCase} from "./get-verify-token.use-case";
import {ERRORS} from "../validate-verify-token/constants";
import {Logger} from "../../../../ports/output/logger";
import {EmailValidator} from "../../../../ports/input/email-validator";
import {UserRepository} from "../../../repositories/user";
import {TokenRepository} from "../../../repositories/token";

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


describe("GetVerifyToken", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const getVerifyTokenUseCase = new GetVerifyTokenUseCase(logger, emailValidator, userRepository, tokenRepository);

    test("throw error on invalid email", async () => {
        jest.spyOn(emailValidator, "isValid").mockResolvedValue(false);

        await expect(getVerifyTokenUseCase.getVerifyToken({email: ""})).rejects.toThrow(new Error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`));
        expect(emailValidator.isValid).toHaveBeenCalledWith("");
        await expect(getVerifyTokenUseCase.getVerifyToken({email: "foobar"})).rejects.toThrow(new Error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`));
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
        await getVerifyTokenUseCase.getVerifyToken({email});

        expect(userRepository.upsert).toHaveBeenCalledTimes(1);
    });

    test("create verify token on valid email", async () => {
        await getVerifyTokenUseCase.getVerifyToken({email});

        expect(tokenRepository.renewForUserAndType).toHaveBeenCalledWith("1", "VERIFY");
    });

    test("return token on valid email", async () => {
        const result = await getVerifyTokenUseCase.getVerifyToken({email});
        expect(result?.token).toBeTruthy();
    });
});
