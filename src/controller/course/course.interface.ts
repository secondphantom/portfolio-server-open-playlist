import {
  ServiceCourseCreateDto,
  ServiceCourseGetByIdDto,
  ServiceCourseGetListByQueryDto,
} from "../../application/service/course.service";
import {
  RequestCourseCreate,
  RequestCourseGetById,
  RequestCourseListByQuery,
} from "../../spec/course/course.request";
import {
  ResponseCourseGetById,
  ResponseCourseGetListByQuery,
} from "../../spec/course/course.response";

export interface ICourseRequestValidator {
  createCourse: (req: RequestCourseCreate) => ServiceCourseCreateDto;
  getCourseById: (query: RequestCourseGetById) => ServiceCourseGetByIdDto;
  getCourseListByQuery: (
    query: RequestCourseListByQuery
  ) => ServiceCourseGetListByQueryDto;
}

export interface ICourseResponseValidator {
  getCourseById: (data: any) => ResponseCourseGetById;
  getCourseListByQuery: (data: any) => ResponseCourseGetListByQuery;
}
