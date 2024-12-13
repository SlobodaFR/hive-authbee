export type GetVerifyTokenParams = { email: string };
export type GetVerifyTokenResult = { token: string };

export type ValidateVerifyTokenParams = {token: string};
export type ValidateVerifyTokenResult = {token: string, expiresAt: Date, userId: string};
