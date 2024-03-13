import dotenv from "dotenv";
dotenv.config();

import { IEnrollRepo } from "../../../application/interfaces/enroll.repo";
import { RepoCreateEnrollDto } from "../../../domain/enroll.domain";
import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { EnrollRepo } from "../../../infrastructure/repo/enroll.repo";
import {
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeUpdateEnrollProgressByCourseIdDto,
} from "../../../application/service/me.service";
import { EnrollListQueryDto } from "../../../dto/enroll.list.query.dto";

describe.skip("enroll repo", () => {
  let enrollRepo: IEnrollRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
      LOG_LEVEL: "verbose",
    });
    enrollRepo = new EnrollRepo(dbClient);
  });

  test("create enroll", async () => {
    const createEnrollDto = {
      courseId: 1,
      userId: 0,
      chapterProgress: {},
      totalProgress: 0,
      recentProgress: { chapterIndex: 0 },
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

  test("get enroll with course", async () => {
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

  test("update progress", async () => {
    const dto = {
      courseId: 1,
      userId: 1,
      partialChapterProgress: { "234": 1 },
      recentProgress: { chapterIndex: 1 },
    } satisfies ServiceMeUpdateEnrollProgressByCourseIdDto;

    await enrollRepo.updateEnrollProgressByCourseId(
      {
        courseId: dto.courseId,
        userId: dto.userId,
      },
      {
        partialChapterProgress: dto.partialChapterProgress,
        recentProgress: dto.recentProgress,
      }
    );
  });
});
