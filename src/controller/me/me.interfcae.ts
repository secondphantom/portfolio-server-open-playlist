import {
  ServiceMeCreateEnrollDto,
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeUpdateByCourseIdDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import { ResponseMeGetEnrollByCourseId } from "../../spec/me/me.response";
import {
  RequestMeCreateEnrollReq,
  RequestMeGetEnrollByCourseIdReq,
  RequestMeUpdateEnrollByCourseIdReq,
  RequestMeUpdateProfileReq,
} from "../../spec/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (req: RequestMeCreateEnrollReq) => ServiceMeCreateEnrollDto;
  updateProfile: (req: RequestMeUpdateProfileReq) => ServiceMeUpdateProfileDto;
  getEnrollsByCourseId: (
    req: RequestMeGetEnrollByCourseIdReq
  ) => ServiceMeGetEnrollByCourseIdDto;
  updateEnrollsByCourseId: (
    req: RequestMeUpdateEnrollByCourseIdReq
  ) => ServiceMeUpdateByCourseIdDto;
}

export interface IMeResponseValidator {
  getEnrollsByCourseId: (data: any) => ResponseMeGetEnrollByCourseId;
}
