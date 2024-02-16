import {
  ServiceResendVerificationEmailDto,
  ServiceSignUpDto,
  ServiceSingInDto,
  ServiceVerifyEmailDto,
} from "../../application/service/auth.service";
import {
  RequestAuthResendVerificationEmailBody,
  RequestAuthSignInBody,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
} from "../../requests/auth/auth.requests";

export interface IAuthValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceSignUpDto;
  verifyEmail: (query: RequestAuthVerifyEmailQuery) => ServiceVerifyEmailDto;
  resendVerificationEmail: (
    body: RequestAuthResendVerificationEmailBody
  ) => ServiceResendVerificationEmailDto;
  signIn: (body: RequestAuthSignInBody) => ServiceSingInDto;
}
