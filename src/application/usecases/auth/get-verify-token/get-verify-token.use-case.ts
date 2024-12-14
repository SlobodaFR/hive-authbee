import {Logger} from "../../../../ports/output/logger";
import {
    GetVerifyTokenParams,
    GetVerifyTokenResult,
} from "./types";
import {ERRORS} from "./constants";
import {UserRepository} from "../../../repositories/user";
import {EmailValidator} from "../../../../ports/input/email-validator";
import {TokenRepository} from "../../../repositories/token";

export class GetVerifyTokenUseCase {
    constructor(
        private readonly logger: Logger,
        private readonly emailValidator: EmailValidator,
        private readonly userRepository: UserRepository,
        private readonly tokenRepository: TokenRepository
    ) {
    }

    async getVerifyToken({email}: GetVerifyTokenParams): Promise<GetVerifyTokenResult | null> {
        const isValidEmail = await this.emailValidator.isValid(email);

        if (!isValidEmail) {
            this.logger.error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`);
            throw new Error(`getVerifyToken: ${ERRORS.VALID_EMAIL_REQUIRED}`);
        }

        const user = await this.userRepository.upsert(email);

        const savedToken = await this.tokenRepository.renewForUserAndType(user.id, "VERIFY");

        this.logger.info('getVerifyToken: token generated and saved');
        return {
            token: savedToken.value
        };
    }

}
