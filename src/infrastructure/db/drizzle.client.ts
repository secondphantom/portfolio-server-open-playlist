import "dotenv/config";
import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";
import { Connection, connect } from "@planetscale/database";
import * as schema from "../../schema/schema";

export class DrizzleClient {
  private connection: Connection;

  db: PlanetScaleDatabase<typeof schema>;
  constructor({
    host,
    username,
    password,
  }: {
    host: string;
    username: string;
    password: string;
  }) {
    this.connection = connect({
      host,
      username,
      password,
    });
    this.db = drizzle(this.connection, {
      schema,
    });
  }

  getDb = () => this.db;
}
