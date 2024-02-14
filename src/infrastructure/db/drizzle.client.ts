import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";
import { Connection, connect } from "@planetscale/database";
import * as schema from "../../schema/schema";
import { ENV } from "../../env";

type C_ENV = Pick<ENV, "DATABASE_URL">;
export class DrizzleClient {
  static instance: DrizzleClient | undefined;
  static getInstance = (ENV: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new DrizzleClient(ENV);
    return this.instance;
  };

  private connection: Connection;

  db: PlanetScaleDatabase<typeof schema>;

  constructor(private ENV: C_ENV) {
    this.connection = connect({
      fetch: (url, init: any) => {
        delete init["cache"];
        return fetch(url, init);
      },
      url: this.ENV.DATABASE_URL,
    });
    this.db = drizzle(this.connection, {
      schema,
    });
  }

  getDb = () => this.db;
}
