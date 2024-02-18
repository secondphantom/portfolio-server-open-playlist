import dotenv from "dotenv";
import { ICourseRepo } from "../../../application/interfaces/course.repo";
import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { CourseRepo } from "../../../infrastructure/repo/course.repo";
import { RepoCreateCourseDto } from "../../../domain/course.domain";
dotenv.config();

describe("course repo", () => {
  let courseRepo: ICourseRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL: process.env["DATABASE_URL"]!,
    });
    courseRepo = new CourseRepo(dbClient);
  });

  test("create course", async () => {
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

    await courseRepo.createCourse(createCourseDto);

    const course = await courseRepo.getCourseByVideoId(
      createCourseDto.videoId,
      {
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
      }
    );

    for (const [key, value] of Object.entries(course!)) {
      expect(value).toEqual(createCourseDto[key as any as keyof typeof course]);
    }
  });
});
