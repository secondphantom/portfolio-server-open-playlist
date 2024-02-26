import {
  ServiceCourseCreateDto,
  ServiceCourseGetByIdDto,
  ServiceCourseGetListByQueryDto,
} from "../../application/service/course.service";
import {
  RequestCourseCreateBody,
  RequestCourseGetById,
  RequestCourseListByQuery,
} from "../../spec/course/course.request";
import {
  ResponseCourseGetById,
  ResponseCourseListGetQuery,
} from "../../spec/course/course.response";

export interface ICourseRequestValidator {
  createCourse: (body: RequestCourseCreateBody) => ServiceCourseCreateDto;
  getCourseById: (query: RequestCourseGetById) => ServiceCourseGetByIdDto;
  getCourseListByQuery: (
    query: RequestCourseListByQuery
  ) => ServiceCourseGetListByQueryDto;
}

export interface ICourseResponseValidator {
  getCourseById: (data: any) => ResponseCourseGetById;
  getCourseListByQuery: (data: any) => ResponseCourseListGetQuery;
}
