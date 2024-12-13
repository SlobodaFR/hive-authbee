import {TokenType} from "./token-type";
import {User} from "./user";

export interface Token {
    id: string;
    value: string;
    tokenType: TokenType;
    expiresAt: Date;
    user?: User;
    updatedAt: Date;
}
