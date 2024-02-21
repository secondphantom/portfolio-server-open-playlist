import dotenv from "dotenv";
dotenv.config();

import { IEnrollRepo } from "../../../application/interfaces/enroll.repo";
import { RepoCreateEnrollDto } from "../../../domain/enroll.domain";
import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { EnrollRepo } from "../../../infrastructure/repo/enroll.repo";
import { ServiceMeGetEnrollByCourseIdDto } from "../../../application/service/me.service";

describe("enroll repo", () => {
  let enrollRepo: IEnrollRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
    });
    enrollRepo = new EnrollRepo(dbClient);
  });

  test.skip("create enroll", async () => {
    const createEnrollDto = {
      courseId: 0,
      userId: 0,
      chapterProgress: [],
      totalProgress: 0,
    } satisfies RepoCreateEnrollDto;

    await enrollRepo.createEnroll(createEnrollDto);

    const enroll = await enrollRepo.getEnrollByUserIdAndCourseId(
      {
        courseId: createEnrollDto.courseId,
        userId: createEnrollDto.userId,
      },
      {
        courseId: true,
        userId: true,
        chapterProgress: true,
        totalProgress: true,
      }
    );

    for (const [key, value] of Object.entries(enroll!)) {
      expect(value).toEqual(createEnrollDto[key as any as keyof typeof enroll]);
    }
  });

  test.only("get enroll with course", async () => {
    const dto = {
      courseId: 1,
      userId: 1,
    } satisfies ServiceMeGetEnrollByCourseIdDto;

    const result = await enrollRepo.getEnrollByUserIdAndCourseIdWith(
      { ...dto },
      {
        enroll: {
          courseId: true,
        },
        course: {
          channelId: true,
        },
        user: {
          id: true,
        },
      }
    );

    expect(result).toMatchObject({
      courseId: 1,
      course: { channelId: "UC8butISFwT-Wl7EV0hUK0BQ" },
      user: { id: 1 },
    });
  });
});
