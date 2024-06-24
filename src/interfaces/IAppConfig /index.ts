
export interface IAppConfig {
    // Define your configuration properties here
    siteName: string,
    log: any,
    data?: object,
    secret?: string,
    name?: string,
    jwtSecret?: string
    port: number,
}