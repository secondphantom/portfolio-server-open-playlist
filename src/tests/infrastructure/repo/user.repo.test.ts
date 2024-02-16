import dotenv from "dotenv";
dotenv.config();

import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { UserRepo } from "../../../infrastructure/repo/user.repo";
import {
  RepoCreateUserDto,
  UserEntitySelect,
} from "../../../domain/user.domain";
import { IUserRepo } from "../../../application/interfaces/user.repo";

describe("user repo", () => {
  let userRepo: IUserRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
    });
    userRepo = new UserRepo(dbClient);
  });

  test.skip("create user", async () => {
    const createUserDto = {
      email: `${new Date().toISOString()}@gmail.com`,
      extra: {},
      hashKey: "testhashkey",
      profileName: "test",
      uuid: "test_uuid",
    } satisfies RepoCreateUserDto;

    await userRepo.createUser(createUserDto);

    const user = await userRepo.getUserByEmail(createUserDto.email, {
      email: true,
    });

    for (const [key, value] of Object.entries(user!)) {
      expect(value).toEqual(createUserDto[key as any as keyof typeof user]);
    }
  });

  test.only("update by email", async () => {
    const email = "test@email.com";
    const values = { emailVerified: true } satisfies Partial<UserEntitySelect>;

    await userRepo.updateUserByEmail(email, values);

    const user = await userRepo.getUserByEmail(email);

    expect(user!.emailVerified).toEqual(true);
  });
});
