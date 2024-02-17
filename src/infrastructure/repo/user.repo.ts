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

  private db: ReturnType<typeof this.drizzleClient.getDb>;
  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getUserByEmail = async <T extends keyof UserEntitySelect = any>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const user = await this.db.query.users.findFirst({
      where: (user, { eq }) => {
        return eq(user.email, email);
      },
      columns: columns
        ? (columns as { [key in keyof UserEntitySelect]: boolean })
        : undefined,
    });
    return user;
  };

  updateUserByEmail = async (
    email: string,
    value: Partial<UserEntitySelect>
  ) => {
    await this.db
      .update(schema.users)
      .set(value)
      .where(eq(schema.users.email, email));
  };

  getUserById = async <T extends keyof UserEntitySelect = any>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const user = await this.db.query.users.findFirst({
      where: (user, { eq }) => {
        return eq(user.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof UserEntitySelect]: boolean })
        : undefined,
    });
    return user;
  };

  createUser = async (user: RepoCreateUserDto) => {
    await this.db.insert(schema.users).values(user);
  };
}
