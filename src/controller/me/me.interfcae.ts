import {
  ServiceMeCreateEnrollDto,
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeGetEnrollListByQueryDto,
  ServiceMeUpdateByCourseIdDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import {
  ResponseMeGetEnrollByCourseId,
  ResponseMeGetEnrollListByQuery,
} from "../../spec/me/me.response";
import {
  RequestMeCreateEnroll,
  RequestMeGetEnrollByCourseId,
  RequestMeGetEnrollListByQuery,
  RequestMeUpdateEnrollByCourseId,
  RequestMeUpdateProfile,
} from "../../spec/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (req: RequestMeCreateEnroll) => ServiceMeCreateEnrollDto;
  updateProfile: (req: RequestMeUpdateProfile) => ServiceMeUpdateProfileDto;
  getEnrollsByCourseId: (
    req: RequestMeGetEnrollByCourseId
  ) => ServiceMeGetEnrollByCourseIdDto;
  updateEnrollsByCourseId: (
    req: RequestMeUpdateEnrollByCourseId
  ) => ServiceMeUpdateByCourseIdDto;
  getEnrollListByQuery: (
    req: RequestMeGetEnrollListByQuery
  ) => ServiceMeGetEnrollListByQueryDto;
}

export interface IMeResponseValidator {
  getEnrollsByCourseId: (data: any) => ResponseMeGetEnrollByCourseId;
  getEnrollListByQuery: (data: any) => ResponseMeGetEnrollListByQuery;
}
