import * as path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
// @ts-ignore
import { servingStatus, Implementation as HealtCheckImplementation,  service as HealtCheckService } from "grpc-js-health-check";
import {ProtoGrpcType} from "../../generated/authbee";
import {GetVerifyTokenUseCase, ValidateVerifyTokenUseCase} from "../../application/usecases/auth";
import {WinstonLogger} from "../../adapters/persistence/winston-logger";
import {LocalEmailValidator} from "../../adapters/local/email-validator";
import {UserDAL} from "../../adapters/persistence/user-dal";
import {TokenDAL} from "../../adapters/persistence/token-dal";
import {LocalTokenGenerator} from "../../adapters/local/token-generator";
import {Logger} from "../../ports/output/logger";
import type {VerifyTokenRequest} from "../../generated/hive/VerifyTokenRequest";
import type {VerifyTokenResponse} from "../../generated/hive/VerifyTokenResponse";
import type {ValidateVerifyTokenRequest} from "../../generated/hive/ValidateVerifyTokenRequest";
import type {ValidateVerifyTokenResponse} from "../../generated/hive/ValidateVerifyTokenResponse";


export class Server {
    private readonly server: grpc.Server;
    private readonly host: string;
    private readonly port: string;
    private readonly healthCheckImplementation: HealtCheckImplementation;
    private readonly logger: Logger;

    private getVerifyTokenUseCase: GetVerifyTokenUseCase
    private validateVerifyTokenUseCase: ValidateVerifyTokenUseCase;

    constructor() {
        this.host = process?.env?.HOST ?? 'localhost';
        this.port = process?.env?.PORT ?? '8081';

        const PROTO_PATH = path.resolve(__dirname, "..", '..', '..', 'proto', 'authbee.proto');
        this.logger = new WinstonLogger("Hive - AuthBee");
        const tokenDAL = new TokenDAL(new LocalTokenGenerator());

        const hivePackageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
        const hivePackage = grpc.loadPackageDefinition(hivePackageDefinition) as unknown as ProtoGrpcType;

        this.getVerifyTokenUseCase = new GetVerifyTokenUseCase(
            this.logger,
            new LocalEmailValidator(),
            new UserDAL(),
            tokenDAL
        );
        this.validateVerifyTokenUseCase = new ValidateVerifyTokenUseCase(
            this.logger,
            tokenDAL
        );
        this.server = new grpc.Server();

        const statusMap = {
            'AuthBeeService': servingStatus.NOT_SERVING,
            '': servingStatus.NOT_SERVING,
        };
        this.healthCheckImplementation = new HealtCheckImplementation(statusMap);
        this.server.addService(HealtCheckService, this.healthCheckImplementation);

        this.server.addService(hivePackage.hive.AuthBee.service, {
            GetVerifyToken: this.getVerifyToken.bind(this),
            ValidateVerifyToken: this.validateVerifyToken.bind(this)
        })
    }

    private async getVerifyToken(call: any, callback: any) {
        const {email} = call.request as VerifyTokenRequest;
        if (!email) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "Email is required"
            } as grpc.ServiceError, null);
            return;
        }
        const verifyToken = await this.getVerifyTokenUseCase.getVerifyToken({email});
        return callback(null, {token: verifyToken?.token} as VerifyTokenResponse);
    }

    private async validateVerifyToken(call: any, callback: any) {
        const {token: verifyToken} = call.request as ValidateVerifyTokenRequest;
        if (!verifyToken) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "Token is required"
            } as grpc.ServiceError, null);
            return;
        }
        const {
            token,
            expiresAt,
            userId
        } = await this.validateVerifyTokenUseCase.validateVerifyToken({token: verifyToken});
        return callback(null, {token, expiresAt: expiresAt.getTime(), userId} as ValidateVerifyTokenResponse);
    }

    async start() {
        this.server.bindAsync(`${this.host}:${this.port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                this.logger.error(`Error starting server: ${error.message}`);
                return;
            }
            this.healthCheckImplementation.setStatus("AuthBeeService", servingStatus.SERVING);
            this.logger.info(`Server running at ${this.host}:${this.port}`);
        });
    }
}



