import { eq } from "drizzle-orm";

import * as schema from "../../schema/schema";

import {
  IUserRepo,
  UpdateUserDto,
} from "../../application/interfaces/user.repo";
import { RepoCreateUserDto, UserEntitySelect } from "../../domain/user.domain";
import { Db, DrizzleClient } from "../db/drizzle.client";

export class UserRepo implements IUserRepo {
  static instance: UserRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new UserRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  getByEmail = async <T extends keyof UserEntitySelect = any>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => {
        return eq(user.email, email);
      },
      columns: columns
        ? (columns as { [key in keyof UserEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);
    return user;
  };

  updateByEmail = async (email: string, value: Partial<UserEntitySelect>) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db
      .update(schema.users)
      .set(value)
      .where(eq(schema.users.email, email));
    await this.drizzleClient.endDb(client);
  };

  getById = async <T extends keyof UserEntitySelect = any>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => {
        return eq(user.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof UserEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);
    return user;
  };

  create = async (user: RepoCreateUserDto) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db.insert(schema.users).values(user as any);
    await this.drizzleClient.endDb(client);
  };

  updateById = async (id: number, value: Partial<UserEntitySelect>) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db.update(schema.users).set(value).where(eq(schema.users.id, id));
    await this.drizzleClient.endDb(client);
  };

  deleteById = async (id: number) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db.delete(schema.users).where(eq(schema.users.id, id));
    await this.drizzleClient.endDb(client);
  };
}
