import {config} from 'dotenv';

import {AuthUseCases} from "./application/usecases/auth";
import {ConsoleLogger} from "./adapters/local/console-logger";
import {LocalEmailValidator} from "./adapters/local/email-validator";
import {LocalTokenGenerator} from "./adapters/local/token-generator";
import {UserDAL} from "./adapters/persistence/user-dal";
import {TokenDAL} from "./adapters/persistence/token-dal";
import {WinstonLogger} from "./adapters/persistence/winston-logger";

config();

const params = {
    email: "john.doe@local.org"
};

(async () => {
    const cLogger = new WinstonLogger('auth-bee|index');
    const authUseCases = new AuthUseCases(
        new ConsoleLogger('auth-bee|AuthUseCases'),
        new LocalEmailValidator(),
        new UserDAL(),
        new TokenDAL(new LocalTokenGenerator())
    );
    const token = await authUseCases.getVerifyToken(params);

    const access = await authUseCases.validateVerifyToken({token : token?.token ?? "" });
    cLogger.info(`User ${access.userId} validate access until ${access.expiresAt.toLocaleString()}`);
})()
