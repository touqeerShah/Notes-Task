// server/config.ts



export interface IDBConfig {
    // Define your configuration properties here
    mongoUser: string,
    mongoPassword: string,
    mongoAddress?: string,
    mongoDB: string,
    mongoPort: number,

}

