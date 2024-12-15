import { TokenRepository } from "../../../application/repositories/token";
import { Token } from "../../../application/domains/token";
import { TokenType } from "../../../application/domains/token-type";
import { TokenGenerator } from "../../../ports/input/token-generator";
import { PrismaClient, Token as DbToken } from "@prisma/client";

export class TokenDAL implements TokenRepository {
  private prismaClient: PrismaClient;

  constructor(private readonly tokenGenerator: TokenGenerator) {
    this.prismaClient = new PrismaClient();
  }

  private mapDatabaseObjectToDomainObject({
    id,
    tokenType,
    value,
    expiresAt,
    updatedAt,
    userId,
  }: DbToken): Token {
    return {
      id,
      tokenType: tokenType as TokenType,
      value,
      expiresAt,
      updatedAt,
      user: {
        id: userId,
        email: "",
      },
    };
  }

  async renewForUserAndType(
    userId: string,
    tokenType: TokenType,
  ): Promise<Token> {
    const generatedToken = await this.tokenGenerator.generateToken();
    let expiresAt = new Date();

    await this.prismaClient.token.deleteMany({
      where: {
        userId,
        AND: {
          tokenType: { in: [`ACCESS`, "VERIFY"] },
        },
      },
    });

    switch (tokenType) {
      case "ACCESS":
        expiresAt.setHours(expiresAt.getHours() + 1);
        break;
      case "VERIFY":
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        break;
      default:
        break;
    }

    return this.mapDatabaseObjectToDomainObject(
      await this.prismaClient.token.create({
        data: {
          expiresAt,
          userId,
          tokenType,
          value: generatedToken,
        },
      }),
    );
  }

  async getByValue(value: string): Promise<Token | null> {
    return this.mapDatabaseObjectToDomainObject(
      await this.prismaClient.token.findFirstOrThrow({
        where: {
          value,
        },
        select: {
          value: true,
          id: true,
          tokenType: true,
          expiresAt: true,
          updatedAt: true,
          userId: true,
        },
      }),
    );
  }

  async revokeToken(token: string, tokenType: TokenType): Promise<boolean> {
    const { count } = await this.prismaClient.token.deleteMany({
      where: {
        value: token,
        AND: {
          tokenType: tokenType as string,
        },
      },
    });
    return count > 0;
  }
}
