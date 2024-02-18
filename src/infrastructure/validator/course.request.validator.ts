import z from "zod";
import { ICourseRequestValidator } from "../../controller/course/course.interface";
import { RequestCourseCreateBody } from "../../requests/course/course.request";
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
}
