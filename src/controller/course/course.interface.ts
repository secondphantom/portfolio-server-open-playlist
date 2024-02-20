import {
  ServiceCourseCreateDto,
  ServiceCourseGetByIdDto,
} from "../../application/service/course.service";
import {
  RequestCourseCreateBody,
  RequestCourseGetById,
} from "../../spec/course/course.request";
import { ResponseCourseGetById } from "../../spec/course/course.response";

export interface ICourseRequestValidator {
  createCourse: (body: RequestCourseCreateBody) => ServiceCourseCreateDto;
  getCourseById: (query: RequestCourseGetById) => ServiceCourseGetByIdDto;
}

export interface ICourseResponseValidator {
  getCourseById: (data: any) => ResponseCourseGetById;
}
