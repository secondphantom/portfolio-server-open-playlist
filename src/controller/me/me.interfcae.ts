import {
  ServiceMeCreateEnrollDto,
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeUpdateByCourseIdDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import { ResponseMeGetEnrollByCourseId } from "../../spec/me/me.response";
import {
  RequestMeCreateEnroll,
  RequestMeGetEnrollByCourseId,
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
}

export interface IMeResponseValidator {
  getEnrollsByCourseId: (data: any) => ResponseMeGetEnrollByCourseId;
}
