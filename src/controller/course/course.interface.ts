import {
  ServiceCourseCreateDto,
  ServiceCourseGetByIdDto,
  ServiceCourseGetByVideoIdDto,
  ServiceCourseGetListByQueryDto,
} from "../../application/service/course.service";
import {
  RequestCourseCreate,
  RequestCourseGetById,
  RequestCourseGetByVideoId,
  RequestCourseListByQuery,
} from "../../spec/course/course.request";
import {
  ResponseCourseGetById,
  ResponseCourseGetByVideoId,
  ResponseCourseGetListByQuery,
} from "../../spec/course/course.response";

export interface ICourseRequestValidator {
  createCourse: (req: RequestCourseCreate) => ServiceCourseCreateDto;
  getCourseById: (query: RequestCourseGetById) => ServiceCourseGetByIdDto;
  getCourseByVideoId: (
    query: RequestCourseGetByVideoId
  ) => ServiceCourseGetByVideoIdDto;
  getCourseListByQuery: (
    query: RequestCourseListByQuery
  ) => ServiceCourseGetListByQueryDto;
}

export interface ICourseResponseValidator {
  getCourseById: (data: any) => ResponseCourseGetById;
  getCourseByVideoId: (data: any) => ResponseCourseGetByVideoId;
  getCourseListByQuery: (data: any) => ResponseCourseGetListByQuery;
}
