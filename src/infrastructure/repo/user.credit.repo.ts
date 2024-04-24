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
    const { db, client } = await this.drizzleClient.getDb();
    await db.insert(schema.userCredits).values(userCredit);
    await this.drizzleClient.endDb(client);
  };

  updateByUserId = async (
    userId: number,
    value: Partial<UserCreditEntitySelect>
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db
      .update(schema.userCredits)
      .set(value)
      .where(eq(schema.userCredits.userId, userId));
    await this.drizzleClient.endDb(client);
  };

  getByUserId = async <T extends keyof UserCreditEntitySelect>(
    userId: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserCreditEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const userCredit = await db.query.userCredits.findFirst({
      where: (value, { eq }) => {
        return eq(value.userId, userId);
      },
      columns: columns
        ? (columns as { [key in keyof UserCreditEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);

    return userCredit;
  };
}
