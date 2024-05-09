import { Client } from "pg";
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
  drizzle,
} from "drizzle-orm/node-postgres";

import * as schema from "../../schema/schema";
import { ENV } from "../../env";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

type C_ENV = Pick<ENV, "DATABASE_URL" | "LOG_LEVEL">;

export type Db = NodePgDatabase<typeof schema>;
export type Tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
export class DrizzleClient {
  static instance: DrizzleClient | undefined;
  static getInstance = (ENV: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new DrizzleClient(ENV);
    return this.instance;
  };

  constructor(private ENV: C_ENV) {}

  endDb = async (client: Client) => {
    await client.end();
  };

  getDb = async () => {
    const client = new Client({
      connectionString: this.ENV.DATABASE_URL,
    });
    await client.connect();
    const db = drizzle(client, {
      schema,
      logger: this.ENV.LOG_LEVEL === "verbose" ? true : false,
    });

    return { db, client };
  };

  using = async <T = any>(callback: (db: Db) => Promise<T>) => {
    const { db, client } = await this.getDb();
    try {
      const result = await callback(db);
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      await this.endDb(client);
    }
  };

  usingTrx = async <T>(callback: (tx: Tx) => Promise<T>) => {
    const { db, client } = await this.getDb();
    try {
      const result = await db.transaction(async (tx) => {
        try {
          const result = await callback(tx);
          return result;
        } catch (error: any) {
          tx.rollback();
          throw new Error(error.message);
        }
      });
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      await this.endDb(client);
    }
  };
}
