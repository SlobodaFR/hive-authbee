import {Logger} from "../../../ports/output/logger";

export class ConsoleLogger implements Logger {
    constructor(private context: string) {}

    error(...args: any[]): void {
        console.error(`[${this.context}]`, ...args);
    }

    warn(...args: any[]): void {
        console.warn(`[${this.context}]`, ...args);
    }

    info(...args: any[]): void {
        console.info(`[${this.context}]`, ...args);
    }

    debug(...args: any[]): void {
        console.debug(`[${this.context}]`, ...args);
    }

    verbose(...args: any[]): void {
        console.log(`[${this.context}]`, ...args);
    }

    silly(...args: any[]): void {
        console.log(`[${this.context}]`, ...args);
    }
}
