import {Logger} from "../../../ports/output/logger";

export class ConsoleLogger implements Logger {
    constructor(private context: string) {}

    error(...args: any[]): void {
        console.error(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }

    warn(...args: any[]): void {
        console.warn(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }

    info(...args: any[]): void {
        console.info(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }

    debug(...args: any[]): void {
        console.debug(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }

    verbose(...args: any[]): void {
        console.log(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }

    silly(...args: any[]): void {
        console.log(`[${this.context}] - [${new Date().toLocaleString()}]`, ...args);
    }
}
