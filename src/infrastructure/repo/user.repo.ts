import { IUserRepo } from "../../application/interfaces/user.repo";
import { RepoCreateUserDto } from "../../domain/user.domain";
import { DrizzleClient } from "../db/drizzle.client";
import * as schema from "../../schema/schema";

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

  getUserByEmail = async (email: string) => {
    const user = await this.db.query.users.findFirst({
      where: (user, { eq }) => {
        return eq(user.email, email);
      },
    });

    if (!user) {
      throw new ServerError({ code: 404, message: "Not Found" });
    }

    return user;
  };

  createUser = async (user: RepoCreateUserDto) => {
    await this.db.insert(schema.users).values(user);
  };
}
