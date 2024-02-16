import {
  ServiceSignUpDto,
  ServiceVerifyEmailDto,
} from "../../application/service/auth.service";
import {
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
} from "../../requests/auth/auth.requests";

export interface IAuthValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceSignUpDto;
  verifyEmail: (params: RequestAuthVerifyEmailQuery) => ServiceVerifyEmailDto;
}
