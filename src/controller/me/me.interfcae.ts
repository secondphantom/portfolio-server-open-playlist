import {
  ServiceMeCreateEnrollDto,
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import { ResponseMeGetEnrollByCourseId } from "../../spec/me/me.reponse";
import {
  RequestMeCreateEnrollReq,
  RequestMeGetEnrollByCourseIdReq,
  RequestMeUpdateProfileReq,
} from "../../spec/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (req: RequestMeCreateEnrollReq) => ServiceMeCreateEnrollDto;
  updateProfile: (req: RequestMeUpdateProfileReq) => ServiceMeUpdateProfileDto;
  getEnrollsByCourseId: (
    req: RequestMeGetEnrollByCourseIdReq
  ) => ServiceMeGetEnrollByCourseIdDto;
}

export interface IMeResponseValidator {
  getEnrollsByCourseId: (data: any) => ResponseMeGetEnrollByCourseId;
}
