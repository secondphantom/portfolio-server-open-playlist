import { CourseService } from "../../application/service/course.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestCourseCreateBody,
  RequestCourseGetById,
} from "../../spec/course/course.request";
import {
  ICourseRequestValidator,
  ICourseResponseValidator,
} from "./course.interface";

export class CourseController {
  static instance: CourseController | undefined;
  static getInstance = ({
    courseService,
    courseRequestValidator,
    courseResponseValidator,
  }: {
    courseService: CourseService;
    courseRequestValidator: ICourseRequestValidator;
    courseResponseValidator: ICourseResponseValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new CourseController(
      courseService,
      courseRequestValidator,
      courseResponseValidator
    );
    return this.instance;
  };

  constructor(
    private courseService: CourseService,
    private courseRequestValidator: ICourseRequestValidator,
    private courseResponseValidator: ICourseResponseValidator
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

  getCourseById = async (req: RequestCourseGetById) => {
    try {
      const dto = this.courseRequestValidator.getCourseById(req);
      const data = await this.courseService.getCourseById(dto);
      const validData = this.courseResponseValidator.getCourseById(data);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: validData,
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
