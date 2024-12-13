export interface Logger {

    error(...args: any[]): void;

    warn(...args: any[]): void;

    info(...args: any[]): void;

    debug(...args: any[]): void;

    verbose(...args: any[]): void;

    silly(...args: any[]): void;
}
