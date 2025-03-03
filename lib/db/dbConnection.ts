'use server';

import sql from 'mssql';

interface PoolOptions {
  name: string;
  config: sql.config;
}

class PoolManager {
  private static instance: PoolManager;
  private pools: Map<string, sql.ConnectionPool>;

  private constructor() {
    this.pools = new Map();
  }

  public static getInstance(): PoolManager {
    if (!PoolManager.instance) {
      PoolManager.instance = new PoolManager();
    }
    return PoolManager.instance;
  }

  private async set({ name, config }: PoolOptions): Promise<sql.ConnectionPool> {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();

    // Extend pool's close method to remove from pool map
    const originalClose = pool.close.bind(pool);

    // @ts-ignore
    pool.close = async (...args) => {
      this.pools.delete(name);
      // @ts-ignore
      return await originalClose(...args);
    };

    this.pools.set(name, pool);
    return pool;
  }

  public async get(options: PoolOptions): Promise<sql.ConnectionPool> {
    if (!this.pools.has(options.name)) {
      return await this.set(options);
    }
    return this.pools.get(options.name)!;
  }

  public async close(name: string): Promise<void> {
    const pool = this.pools.get(name);
    if (!pool) {
      throw new Error(`Pool ${name} does not exist`);
    }
    await pool.close();
  }

  public async closeAll(): Promise<void> {
    const promises = Array.from(this.pools.values()).map((pool) => pool.close());
    await Promise.all(promises);
  }
}

const sysConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

interface QueryConfig {
  text: string;
  values?: any[];
}

async function executeQuery(query: string | QueryConfig) {
  const poolManager = PoolManager.getInstance();
  let connectionConfig = { ...sysConfig };

  const dbName = process.env.DB_NAME;

  if (dbName) {
    connectionConfig.database = dbName;
  }

  const poolName = `pool-${connectionConfig.database}`;

  try {
    const pool = await poolManager.get({
      name: poolName,
      config: connectionConfig,
    });

    if (typeof query === 'string') {
      return await pool.request().query(query);
    }

    let request = pool.request();
    query.values?.forEach((value, index) => {
      request = request.input(`param${index}`, value);
    });
    return await request.query(query.text);
  } catch (err) {
    console.error('SQL error', err);
    throw err;
  }
}

export async function executeQueryWithRetry(
  query: string | QueryConfig,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await executeQuery(query);
    } catch (err: any) {
      // Check if it's a deadlock error (SQL Server error code 1205)
      if (err.number === 1205 && attempt < maxRetries) {
        console.log(`Deadlock detected, retry attempt ${attempt}/${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
}
