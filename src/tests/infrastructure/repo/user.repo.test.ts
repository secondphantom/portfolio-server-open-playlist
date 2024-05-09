import dotenv from "dotenv";
dotenv.config();

import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { UserRepo } from "../../../infrastructure/repo/user.repo";
import {
  RepoCreateUserDto,
  UserEntitySelect,
} from "../../../domain/user.domain";
import { IUserRepo } from "../../../application/interfaces/user.repo";
import { ServiceMeUpdateProfileDto } from "../../../application/service/me.service";

describe.skip("user repo", () => {
  let userRepo: IUserRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
      LOG_LEVEL: "verbose",
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

    await userRepo.create(createUserDto);

    const user = await userRepo.getByEmail(createUserDto.email, {
      email: true,
    });

    for (const [key, value] of Object.entries(user!)) {
      expect(value).toEqual(createUserDto[key as any as keyof typeof user]);
    }
  });

  test("update by email", async () => {
    const email = "test@email.com";
    const values = {
      isEmailVerified: true,
    } satisfies Partial<UserEntitySelect>;

    await userRepo.updateByEmail(email, values);

    const user = await userRepo.getByEmail(email);

    expect(user!.isEmailVerified).toEqual(true);
  });

  test("update user", async () => {
    const dto = {
      userId: 1,
      profileName: "zero",
    } satisfies ServiceMeUpdateProfileDto;

    await userRepo.updateById(dto.userId, {
      profileName: dto.profileName,
    });
  });
});
