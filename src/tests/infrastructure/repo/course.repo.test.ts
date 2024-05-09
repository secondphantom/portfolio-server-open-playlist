import dotenv from "dotenv";
import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import CourseRepo from "../../../infrastructure/repo/course.repo";
import { RepoCreateCourseDto } from "../../../domain/course.domain";
import { ICourseRepo } from "../../../application/interfaces/course.repo";
import { CourseListQueryDto as CourseListQueryDto } from "../../../dto/course.list.query.dto";
dotenv.config();

describe.skip("course repo", () => {
  let courseRepo: ICourseRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
      LOG_LEVEL: "verbose",
    });
    courseRepo = new CourseRepo(dbClient);
  });

  test.skip("create course", async () => {
    const createCourseDto = {
      videoId: "videoId",
      channelId: "channelId",
      categoryId: 0,
      language: "language",
      title: "title",
      description: "description",
      summary: "summary",
      chapters: [],
      enrollCount: 0,
      generatedAi: false,
      duration: 10000,
      extra: {},
      publishedAt: new Date(),
    } satisfies RepoCreateCourseDto;

    await courseRepo.create(createCourseDto);

    const course = await courseRepo.getByVideoId(createCourseDto.videoId, {
      videoId: true,
      channelId: true,
      categoryId: true,
      language: true,
      title: true,
      description: true,
      summary: true,
      chapters: true,
      enrollCount: true,
      generatedAi: true,
      duration: true,
      extra: true,
      // publishedAt: true,
    });

    for (const [key, value] of Object.entries(course!)) {
      expect(value).toEqual(createCourseDto[key as any as keyof typeof course]);
    }
  });

  test("get course by id", async () => {
    const course = await courseRepo.getById(1, { id: true });

    expect(course?.id).toEqual(1);
  });

  test("get course by id with", async () => {
    const where = {
      courseId: 1,
      userId: 1,
    };
    const columns = {
      channel: {
        channelId: true,
      },
      category: {
        id: true,
        name: true,
      },
      enrolls: {
        courseId: true,
        userId: true,
      },
      course: {
        id: true,
      },
    };

    const course = await courseRepo.getByIdWith(where, columns);

    expect(course).toMatchObject({
      id: 1,
      enrolls: [{ courseId: 1, userId: 1 }],
      channel: { channelId: "UC8butISFwT-Wl7EV0hUK0BQ" },
      category: null,
    });
  });

  test("get courses by query", async () => {
    const queryDto = new CourseListQueryDto({
      userId: 1,
      // categoryId: 1,
      // order: "recent",
      search: "aws",
      // videoId: "zA8guDqfv40",
    });

    const inputs = queryDto.getRepoQueryDto();
    const courses = await courseRepo.getListByQuery(inputs);

    for (const course of courses) {
      if (inputs.categoryId) {
        expect(course.categoryId).toEqual(inputs.categoryId);
      }
      if (course.enrolls && course.enrolls?.length > 0) {
        expect(course.enrolls[0].userId).toEqual(inputs.userId!);
      }
    }
  });
});
