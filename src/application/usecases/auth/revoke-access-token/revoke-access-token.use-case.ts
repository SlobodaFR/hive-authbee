import { Logger } from "../../../../ports/output/logger";
import { RevokeAccessTokenParams, RevokeAccessTokenResult } from "./types";
import { TokenRepository } from "../../../repositories/token";
import { ERRORS } from "../validate-verify-token/constants";

export class RevokeAccessTokenUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute({
    token,
  }: RevokeAccessTokenParams): Promise<RevokeAccessTokenResult> {
    const success = await this.tokenRepository.revokeToken(token, "ACCESS");
    if (!success) {
      this.logger.error(`revokeAccessToken: ${ERRORS.UNKNOWN_TOKEN}`);
    } else {
      this.logger.info(`revokeAccessToken: token revoked`);
    }
    return {
      success,
    };
  }
}
