import * as schema from "../../schema/schema";
import { IUserCreditRepo } from "../../application/interfaces/user.credit.repo";
import {
  RepoCreateUserCreditDto,
  UserCreditEntitySelect,
} from "../../domain/user.credit.domain";
import { DrizzleClient } from "../db/drizzle.client";
import { eq } from "drizzle-orm";

export class UserCreditRepo implements IUserCreditRepo {
  static instance: UserCreditRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new UserCreditRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  create = async (userCredit: RepoCreateUserCreditDto) => {
    await this.drizzleClient.using((db) =>
      db.insert(schema.userCredits).values(userCredit)
    );
  };

  updateByUserId = async (
    userId: number,
    value: Partial<UserCreditEntitySelect>
  ) => {
    await this.drizzleClient.using((db) =>
      db
        .update(schema.userCredits)
        .set(value)
        .where(eq(schema.userCredits.userId, userId))
    );
  };

  getByUserId = async <T extends keyof UserCreditEntitySelect>(
    userId: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserCreditEntitySelect]?: boolean }
  ) => {
    const userCredit = await this.drizzleClient.using((db) =>
      db.query.userCredits.findFirst({
        where: (value, { eq }) => {
          return eq(value.userId, userId);
        },
        columns: columns
          ? (columns as { [key in keyof UserCreditEntitySelect]: boolean })
          : undefined,
      })
    );

    return userCredit;
  };
}
