import z from "zod";
import { ICourseRequestValidator } from "../../controller/course/course.interface";
import {
  RequestCourseCreate,
  RequestCourseGetById,
  RequestCourseGetByVideoId,
  RequestCourseListByQuery,
} from "../../spec/course/course.request";
import { ServerError } from "../../dto/error";
import { zodIntTransform } from "./lib/zod.util";

export class CourseRequestValidator implements ICourseRequestValidator {
  static instance: CourseRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestCourseCreateBody = z.object({
    auth: z.object({
      userId: z.number(),
    }),
    content: z.object({
      url: z
        .string()
        .regex(
          /^(https:\/\/)(www.youtube.com\/watch\?v=|youtu.be\/).+$/,
          "Invalid YouTube URL"
        ),
    }),
  });

  createCourse = (body: RequestCourseCreate) => {
    try {
      const { auth, content } = this.requestCourseCreateBody.parse(body);
      const videoId = this.getIDfromURL(content.url);
      return { videoId, userId: auth.userId };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private getIDfromURL = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    throw new Error("Invalid Youtube Url");
  };

  private requestCourseGetById = z
    .object({
      auth: z.object({
        userId: z.number().optional(),
      }),
      params: z
        .object({
          courseId: zodIntTransform,
        })
        .strict(),
    })
    .strict();

  getCourseById = (req: RequestCourseGetById) => {
    try {
      const dto = this.requestCourseGetById.parse(req);
      return {
        ...dto.params,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCourseGetByVideoId = z
    .object({
      auth: z.object({
        userId: z.number().optional(),
      }),
      params: z
        .object({
          videoId: z.string(),
        })
        .strict(),
    })
    .strict();

  getCourseByVideoId = (req: RequestCourseGetByVideoId) => {
    try {
      const dto = this.requestCourseGetByVideoId.parse(req);
      return {
        ...dto.params,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCourseListByQuery = z
    .object({
      auth: z.object({
        userId: z.number().optional(),
      }),
      query: z
        .object({
          page: zodIntTransform.optional(),
          categoryId: zodIntTransform.optional(),
          order: z
            .union([
              z.literal("popular"),
              z.literal("recent"),
              z.literal("create"),
            ])
            .optional(),
          videoId: z.string().min(2).optional(),
          search: z.string().min(2).optional(),
          channelId: z.string().min(2).optional(),
          language: z.string().min(1).optional(),
        })
        .strict(),
    })
    .strict();

  getCourseListByQuery = (req: RequestCourseListByQuery) => {
    try {
      const dto = this.requestCourseListByQuery.parse(req);
      return {
        ...dto.query,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
