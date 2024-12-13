import {Token} from "../domains/token";
import {TokenType} from "../domains/token-type";

export interface TokenRepository {
    renewForUserAndType(userId: string, tokenType: TokenType): Promise<Token>;

    getByValue(value: string): Promise<Token | null>;
}
