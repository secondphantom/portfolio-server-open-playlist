import dotenv from "dotenv";
dotenv.config();

import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { UserRepo } from "../../../infrastructure/repo/user.repo";
import { RepoCreateUserDto } from "../../../domain/user.domain";

describe("user repo", () => {
  let userRepo: UserRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      host: process.env["DATABASE_HOST"]!,
      username: process.env["DATABASE_USERNAME"]!,
      password: process.env["DATABASE_PASSWORD"]!,
    });
    userRepo = new UserRepo(dbClient);
  });

  test("create user", async () => {
    const createUserDto = {
      email: `${new Date().toISOString()}@gmail.com`,
      extra: {},
      hashKey: "testhashkey",
      profileName: "test",
      uuid: "test_uuid",
    } satisfies RepoCreateUserDto;

    await userRepo.createUser(createUserDto);

    const user = await userRepo.getUserByEmail(createUserDto.email);

    for (const [key, value] of Object.entries(createUserDto)) {
      expect(value).toEqual(user[key as any as keyof typeof user]);
    }
  });
});
