import { CourseService } from "../../application/service/course.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestCourseCreateBody,
  RequestCourseGetById,
  RequestCourseListByQuery,
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
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
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
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getCourseListByQuery = async (req: RequestCourseListByQuery) => {
    try {
      const dto = this.courseRequestValidator.getCourseListByQuery(req);
      const data = await this.courseService.getCourseListByQuery(dto);
      const validData = this.courseResponseValidator.getCourseListByQuery(data);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: validData,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
