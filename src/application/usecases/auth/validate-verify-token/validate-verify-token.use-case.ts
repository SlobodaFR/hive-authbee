import {
    ValidateVerifyTokenParams,
    ValidateVerifyTokenResult
} from "./types";
import {ERRORS} from "./constants";
import {Logger} from "../../../../ports/output/logger";
import {TokenRepository} from "../../../repositories/token";

export class ValidateVerifyTokenUseCase {
    constructor(
        private readonly logger: Logger,
        private readonly tokenRepository: TokenRepository
    ) {
    }

    async validateVerifyToken({token}: ValidateVerifyTokenParams): Promise<ValidateVerifyTokenResult> {
        const tokenData = await this.tokenRepository.getByValue(token);

        if (!tokenData) {
            this.logger.error(`validateVerifyToken: ${ERRORS.UNKNOWN_TOKEN}`);
            throw new Error(`validateVerifyToken: ${ERRORS.UNKNOWN_TOKEN}`);
        }
        if (!tokenData?.user?.id) {
            this.logger.error(`validateVerifyToken: ${ERRORS.NOT_LINKED_TO_USER}`);
            throw new Error(`validateVerifyToken: ${ERRORS.NOT_LINKED_TO_USER}`);
        }

        const savedToken = await this.tokenRepository.renewForUserAndType(tokenData.user.id, "ACCESS");

        this.logger.info('validateVerifyToken: token validated');
        return {
            token: savedToken.value,
            expiresAt: savedToken.expiresAt,
            userId: tokenData.user.id
        };
    }
}
