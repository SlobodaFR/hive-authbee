import {Logger} from "../../../ports/output/logger";
import winston from "winston";

export class WinstonLogger implements Logger {
    private transport: winston.Logger;

    constructor(context: string) {
        this.transport = winston.createLogger({
            level: '*',
            format: winston.format.json(),
            defaultMeta: {service: context},
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
                new winston.transports.File({filename: 'logs/warn.log', level: 'warn'}),
                new winston.transports.File({filename: 'logs/info.log', level: 'info'}),
                new winston.transports.File({filename: 'logs/debug.log', level: 'debug'}),
                new winston.transports.File({filename: 'logs/verbose.log', level: 'verbose'}),
                new winston.transports.File({filename: 'logs/silly.log', level: 'silly'}),
            ]
        });
    }

    error(...args: any[]): void {
        this.transport.error(args);
    }

    warn(...args: any[]): void {
        this.transport.warn(args);
    }

    info(...args: any[]): void {
        this.transport.info(args);
    }

    debug(...args: any[]): void {
        this.transport.debug(args);
    }

    verbose(...args: any[]): void {
        this.transport.verbose(args);
    }

    silly(...args: any[]): void {
        this.transport.silly(args);
    }
}
