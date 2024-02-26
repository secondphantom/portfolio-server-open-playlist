import z from "zod";

import { IMeResponseValidator } from "../../controller/me/me.interfcae";
import { ServerError } from "../../dto/error";

export class MeResponseValidator implements IMeResponseValidator {
  static instance: MeResponseValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new MeResponseValidator();
    return this.instance;
  };

  constructor() {}

  private responseMeGetEnrollByCourseId = z.object({
    userId: z.number(),
    courseId: z.number(),
    chapterProgress: z.array(
      z.object({
        time: z.number(),
        progress: z.number(),
      })
    ),
    totalProgress: z.number(),
    updatedAt: z.date(),
    course: z.object({
      title: z.string(),
      chapters: z.array(z.object({ time: z.number(), title: z.string() })),
      videoId: z.string(),
    }),
  });

  getEnrollsByCourseId = (data: any) => {
    try {
      const dto = this.responseMeGetEnrollByCourseId.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };

  private responseMeGetEnrollListByQuery = z.object({
    enrolls: z.array(
      z.object({
        createdAt: z.date(),
        updatedAt: z.date(),
        courseId: z.number(),
        totalProgress: z.number(),
        course: z.object({
          id: z.number(),
          videoId: z.string(),
          title: z.string(),
        }),
      })
    ),
    pagination: z.object({
      currentPage: z.number(),
      pageSize: z.number(),
    }),
  });

  getEnrollListByQuery = (data: any) => {
    try {
      const dto = this.responseMeGetEnrollListByQuery.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };
}
