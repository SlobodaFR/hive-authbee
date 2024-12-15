import * as path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { HealthImplementation, ServingStatusMap } from "grpc-health-check";
import { ProtoGrpcType } from "../../generated/authbee";
import {
  GetVerifyTokenUseCase,
  ValidateVerifyTokenUseCase,
} from "../../application/usecases/auth";
import { WinstonLogger } from "../../adapters/persistence/winston-logger";
import { LocalEmailValidator } from "../../adapters/local/email-validator";
import { UserDAL } from "../../adapters/persistence/user-dal";
import { TokenDAL } from "../../adapters/persistence/token-dal";
import { LocalTokenGenerator } from "../../adapters/local/token-generator";
import { Logger } from "../../ports/output/logger";
import type { VerifyTokenRequest } from "../../generated/hive/VerifyTokenRequest";
import type { VerifyTokenResponse } from "../../generated/hive/VerifyTokenResponse";
import type { ValidateVerifyTokenRequest } from "../../generated/hive/ValidateVerifyTokenRequest";
import type { ValidateVerifyTokenResponse } from "../../generated/hive/ValidateVerifyTokenResponse";
import { RevokeAccessTokenResponse } from "../../generated/hive/RevokeAccessTokenResponse";
import { RevokeAccessTokenRequest } from "../../generated/hive/RevokeAccessTokenRequest";
import { RevokeAccessTokenUseCase } from "../../application/usecases/auth/revoke-access-token/revoke-access-token.use-case";
import { ServingStatus } from "./types";

export class Server {
  private readonly server: grpc.Server;
  private readonly host: string;
  private readonly port: string;
  private readonly healthCheckImplementation: HealthImplementation;
  private readonly logger: Logger;

  private getVerifyTokenUseCase: GetVerifyTokenUseCase;
  private validateVerifyTokenUseCase: ValidateVerifyTokenUseCase;
  private revokeAccessTokenUseCase: RevokeAccessTokenUseCase;

  constructor() {
    this.host = process?.env?.HOST ?? "localhost";
    this.port = process?.env?.PORT ?? "8081";

    const PROTO_PATH = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "proto",
      "authbee.proto",
    );
    this.logger = new WinstonLogger("Hive - AuthBee");
    const tokenDAL = new TokenDAL(new LocalTokenGenerator());

    const hivePackageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const hivePackage = grpc.loadPackageDefinition(
      hivePackageDefinition,
    ) as unknown as ProtoGrpcType;

    this.getVerifyTokenUseCase = new GetVerifyTokenUseCase(
      this.logger,
      new LocalEmailValidator(),
      new UserDAL(),
      tokenDAL,
    );
    this.validateVerifyTokenUseCase = new ValidateVerifyTokenUseCase(
      this.logger,
      tokenDAL,
    );
    this.revokeAccessTokenUseCase = new RevokeAccessTokenUseCase(
      this.logger,
      tokenDAL,
    );

    this.server = new grpc.Server();

    const statusMap = {
      AuthBeeService: ServingStatus.NOT_SERVING,
      "": ServingStatus.NOT_SERVING,
    };
    this.healthCheckImplementation = new HealthImplementation(statusMap);
    this.healthCheckImplementation.addToServer(this.server);

    this.server.addService(hivePackage.hive.AuthBee.service, {
      GetVerifyToken: this.getVerifyToken.bind(this),
      ValidateVerifyToken: this.validateVerifyToken.bind(this),
      RevokeAccessToken: this.revokeAccessToken.bind(this),
    });
  }

  private async getVerifyToken(call: any, callback: any) {
    const { email } = call.request as VerifyTokenRequest;
    if (!email) {
      callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Email is required",
        } as grpc.ServiceError,
        null,
      );
      return;
    }
    const verifyToken = await this.getVerifyTokenUseCase.execute({ email });
    return callback(null, { token: verifyToken?.token } as VerifyTokenResponse);
  }

  private async validateVerifyToken(call: any, callback: any) {
    const { token: verifyToken } = call.request as ValidateVerifyTokenRequest;
    if (!verifyToken) {
      callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Token is required",
        } as grpc.ServiceError,
        null,
      );
      return;
    }
    const { token, expiresAt, userId } =
      await this.validateVerifyTokenUseCase.execute({ token: verifyToken });
    return callback(null, {
      token,
      expiresAt: expiresAt.getTime(),
      userId,
    } as ValidateVerifyTokenResponse);
  }

  private async revokeAccessToken(call: any, callback: any) {
    const { token } = call.request as RevokeAccessTokenRequest;
    if (!token) {
      callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Token is required",
        } as grpc.ServiceError,
        null,
      );
      return;
    }
    const { success } = await this.revokeAccessTokenUseCase.execute({ token });
    return callback(null, { success } as RevokeAccessTokenResponse);
  }

  async start() {
    this.server.bindAsync(
      `${this.host}:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          this.logger.error(`Error starting server: ${error.message}`);
          return;
        }
        this.healthCheckImplementation.setStatus(
          "AuthBeeService",
          ServingStatus.SERVING,
        );
        this.logger.info(`Server running at ${this.host}:${this.port}`);
      },
    );
  }
}
