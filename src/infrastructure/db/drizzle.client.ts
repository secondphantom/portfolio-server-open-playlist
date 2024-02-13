import "dotenv/config";
import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";
import { Connection, connect } from "@planetscale/database";
import * as schema from "../../schema/schema";
import { ENV } from "../../env";

export class DrizzleClient {
  static instance: DrizzleClient | undefined;
  static getInstance = (ENV: ENV) => {
    if (this.instance) return this.instance;
    this.instance = new DrizzleClient(ENV);
    return this.instance;
  };

  private connection: Connection;

  db: PlanetScaleDatabase<typeof schema>;
  constructor(private ENV: ENV) {
    this.connection = connect({
      host: this.ENV.DATABASE_HOST,
      username: this.ENV.DATABASE_USERNAME,
      password: this.ENV.DATABASE_PASSWORD,
    });
    this.db = drizzle(this.connection, {
      schema,
    });
  }

  getDb = () => this.db;
}
