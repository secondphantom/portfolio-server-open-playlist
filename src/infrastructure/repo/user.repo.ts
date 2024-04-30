import { eq } from "drizzle-orm";

import * as schema from "../../schema/schema";

import { IUserRepo } from "../../application/interfaces/user.repo";
import { RepoCreateUserDto, UserEntitySelect } from "../../domain/user.domain";
import { DrizzleClient } from "../db/drizzle.client";

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
    const user = await this.drizzleClient.using((db) =>
      db.query.users.findFirst({
        where: (user, { eq }) => {
          return eq(user.email, email);
        },
        columns: columns
          ? (columns as { [key in keyof UserEntitySelect]: boolean })
          : undefined,
      })
    );
    return user;
  };

  updateByEmail = async (email: string, value: Partial<UserEntitySelect>) => {
    await this.drizzleClient.using((db) =>
      db.update(schema.users).set(value).where(eq(schema.users.email, email))
    );
  };

  getById = async <T extends keyof UserEntitySelect = any>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const user = await this.drizzleClient.using((db) =>
      db.query.users.findFirst({
        where: (user, { eq }) => {
          return eq(user.id, id);
        },
        columns: columns
          ? (columns as { [key in keyof UserEntitySelect]: boolean })
          : undefined,
      })
    );
    return user;
  };

  create = async (user: RepoCreateUserDto) => {
    await this.drizzleClient.using((db) =>
      db.insert(schema.users).values(user as any)
    );
  };

  updateById = async (id: number, value: Partial<UserEntitySelect>) => {
    await this.drizzleClient.using((db) =>
      db.update(schema.users).set(value).where(eq(schema.users.id, id))
    );
  };

  deleteById = async (id: number) => {
    await this.drizzleClient.using((db) =>
      db.delete(schema.users).where(eq(schema.users.id, id))
    );
  };
}
