import {
  ServiceMeCreateEnrollDto,
  ServiceMeCreateFreeCreditDto,
  ServiceMeDeleteAccountDto,
  ServiceMeGetCreditDto,
  ServiceMeGetEnrollByCourseIdDto,
  ServiceMeGetEnrollListByQueryDto,
  ServiceMeGetProfileDto,
  ServiceMeUpdateEnrollByCourseIdDto,
  ServiceMeUpdateEnrollProgressByCourseIdDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import {
  ResponseMeGetEnrollByCourseId,
  ResponseMeGetEnrollListByQuery,
} from "../../spec/me/me.response";
import {
  RequestMeCreateEnroll,
  RequestMeCreateFreeCredit,
  RequestMeDeleteAccount,
  RequestMeGetCredit,
  RequestMeGetEnrollByCourseId,
  RequestMeGetEnrollListByQuery,
  RequestMeGetProfile,
  RequestMeUpdateEnrollByCourseId,
  RequestMeUpdateEnrollProgressByCourseId,
  RequestMeUpdateProfile,
} from "../../spec/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (req: RequestMeCreateEnroll) => ServiceMeCreateEnrollDto;
  getProfile: (req: RequestMeGetProfile) => ServiceMeGetProfileDto;
  updateProfile: (req: RequestMeUpdateProfile) => ServiceMeUpdateProfileDto;
  getEnrollsByCourseId: (
    req: RequestMeGetEnrollByCourseId
  ) => ServiceMeGetEnrollByCourseIdDto;
  updateEnrollsByCourseId: (
    req: RequestMeUpdateEnrollByCourseId
  ) => ServiceMeUpdateEnrollByCourseIdDto;
  updateEnrollProgressByCourseId: (
    req: RequestMeUpdateEnrollProgressByCourseId
  ) => ServiceMeUpdateEnrollProgressByCourseIdDto;
  getEnrollListByQuery: (
    req: RequestMeGetEnrollListByQuery
  ) => ServiceMeGetEnrollListByQueryDto;
  getCredit: (req: RequestMeGetCredit) => ServiceMeGetCreditDto;
  createFreeCredit: (
    req: RequestMeCreateFreeCredit
  ) => ServiceMeCreateFreeCreditDto;
  deleteAccount: (req: RequestMeDeleteAccount) => ServiceMeDeleteAccountDto;
}

export interface IMeResponseValidator {
  getEnrollsByCourseId: (data: any) => ResponseMeGetEnrollByCourseId;
  getEnrollListByQuery: (data: any) => ResponseMeGetEnrollListByQuery;
}
