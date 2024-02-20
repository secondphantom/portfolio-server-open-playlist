import { ServiceMeCreateEnrollDto } from "../../application/service/me.service";
import { RequestMeCreateEnrollBody } from "../../requests/me/me.request";

export interface IMeRequestValidator {
  createEnroll: (body: RequestMeCreateEnrollBody) => ServiceMeCreateEnrollDto;
}
