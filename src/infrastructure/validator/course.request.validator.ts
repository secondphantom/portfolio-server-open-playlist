import z from "zod";
import { ICourseRequestValidator } from "../../controller/course/course.interface";
import {
  RequestCourseCreateBody,
  RequestCourseGetById,
} from "../../spec/course/course.request";
import { ServerError } from "../../dto/error";

export class CourseRequestValidator implements ICourseRequestValidator {
  static instance: CourseRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestCourseCreateBody = z.object({
    url: z
      .string()
      .regex(
        /^(https:\/\/)(www.youtube.com\/watch\?v=|youtu.be\/).+$/,
        "Invalid YouTube URL"
      ),
  });

  createCourse = (body: RequestCourseCreateBody) => {
    try {
      const { url } = this.requestCourseCreateBody.parse(body);
      const videoId = this.getIDfromURL(url);
      return { videoId };
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
          courseId: z.string().transform((val, ctx) => {
            const result = parseInt(val);
            if (isNaN(result)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not a number",
              });
              return z.NEVER;
            }
            return result;
          }),
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
}
