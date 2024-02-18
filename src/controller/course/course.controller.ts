import { CourseService } from "../../application/service/course.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import { RequestCourseCreateBody } from "../../requests/course/course.request";
import { ICourseRequestValidator } from "./course.interface";

export class CourseController {
  static instance: CourseController | undefined;
  static getInstance = ({
    courseService,
    courseRequestValidator,
  }: {
    courseService: CourseService;
    courseRequestValidator: ICourseRequestValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new CourseController(courseRequestValidator, courseService);
    return this.instance;
  };

  constructor(
    private courseRequestValidator: ICourseRequestValidator,
    private courseService: CourseService
  ) {}

  createCourse = async (body: RequestCourseCreateBody) => {
    try {
      const dto = this.courseRequestValidator.createCourse(body);
      await this.courseService.createCourse(dto);

      return new ControllerResponse({
        code: 201,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };
}
