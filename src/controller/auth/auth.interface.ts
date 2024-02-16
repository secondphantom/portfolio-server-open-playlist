import {
  ServiceResendVerificationEmailDto,
  ServiceSignUpDto,
  ServiceVerifyEmailDto,
} from "../../application/service/auth.service";
import {
  RequestAuthResendVerificationEmail,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
} from "../../requests/auth/auth.requests";

export interface IAuthValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceSignUpDto;
  verifyEmail: (query: RequestAuthVerifyEmailQuery) => ServiceVerifyEmailDto;
  resendVerificationEmail: (
    body: RequestAuthResendVerificationEmail
  ) => ServiceResendVerificationEmailDto;
}
