import { ServiceCourseCreateDto } from "../../application/service/course.service";
import { RequestCourseCreateBody } from "../../requests/course/course.request";

export interface ICourseRequestValidator {
  createCourse: (body: RequestCourseCreateBody) => ServiceCourseCreateDto;
}
