import {
  ServiceMeCreateEnrollDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import {
  RequestMeCreateEnrollReq,
  RequestMeUpdateProfileReq,
} from "../../spec/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (req: RequestMeCreateEnrollReq) => ServiceMeCreateEnrollDto;
  updateProfile: (req: RequestMeUpdateProfileReq) => ServiceMeUpdateProfileDto;
}
