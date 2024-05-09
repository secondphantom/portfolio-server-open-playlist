import z from "zod";

import { ICourseResponseValidator } from "../../controller/course/course.interface";
import { ServerError } from "../../dto/error";

export class CourseResponseValidator implements ICourseResponseValidator {
  static instance: CourseResponseValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseResponseValidator();
    return this.instance;
  };

  constructor() {}

  private responseCourseGetById = z
    .object({
      id: z.number(),
      videoId: z.string(),
      language: z.string(),
      title: z.string(),
      description: z.string(),
      summary: z.string().nullable(),
      chapters: z.array(z.object({ time: z.number(), title: z.string() })),
      enrollCount: z.number(),
      duration: z.number(),
      createdAt: z.date(),
      publishedAt: z.date(),
      version: z.number(),
      channel: z
        .object({
          channelId: z.string(),
          name: z.string(),
        })
        .strict(),
      enrolls: z
        .array(
          z
            .object({
              userId: z.number(),
              totalProgress: z.number(),
              updatedAt: z.date(),
              chapterProgress: z.record(z.string(), z.number()),
              recentProgress: z.object({
                chapterIndex: z.number(),
              }),
              version: z.number(),
            })
            .strict()
        )
        .optional(),
      category: z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .strict()
        .nullable(),
    })
    .strict();

  getCourseById = (data: any) => {
    try {
      const dto = this.responseCourseGetById.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };

  private responseCourseGetByVideoId = this.responseCourseGetById;

  getCourseByVideoId = (data: any) => {
    try {
      const dto = this.responseCourseGetByVideoId.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };

  private responseCourseListGetQuery = z
    .object({
      courses: z.array(
        z.object({
          id: z.number(),
          videoId: z.string(),
          title: z.string(),
          categoryId: z.number(),
          enrollCount: z.number(),
          createdAt: z.date(),
          publishedAt: z.date(),
          enrolls: z.array(z.object({ userId: z.number() })).optional(),
          channel: z.object({
            name: z.string(),
            channelId: z.string(),
          }),
        })
      ),
      pagination: z.object({
        currentPage: z.number(),
        pageSize: z.number(),
      }),
    })
    .strict();

  getCourseListByQuery = (data: any) => {
    try {
      const dto = this.responseCourseListGetQuery.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };
}
