declare module 'mssql' {
  namespace sql {
    interface config {
      server: string;
      port?: number;
      user?: string;
      password?: string;
      database?: string;
      options?: {
        encrypt?: boolean;
        trustServerCertificate?: boolean;
        [key: string]: unknown;
      };
      pool?: {
        max?: number;
        min?: number;
        idleTimeoutMillis?: number;
      };
    }

    interface IResult<T> {
      recordsets: T[][];
      recordset: T[];
      output: Record<string, unknown>;
      rowsAffected: number[];
    }

    interface IRequest {
      input(name: string, value: unknown): IRequest;
      query<T = Record<string, unknown>>(command: string): Promise<IResult<T>>;
    }

    interface ConnectionPool {
      request(): IRequest;
      close(): Promise<void>;
      connected: boolean;
    }

    function connect(config: config): Promise<ConnectionPool>;
  }

  export = sql;
}
