import {
  ServiceAuthRefreshAccessTokenDto,
  ServiceAuthResendVerificationEmailDto,
  ServiceAuthSignUpDto,
  ServiceAuthSingInDto,
  ServiceAuthVerifyAccessTokenDto,
  ServiceAuthVerifyEmailDto,
} from "../../application/service/auth.service";
import {
  RequestAuthResendVerificationEmailBody,
  RequestAuthSignInBody,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
  RequestAuthRefreshAccessTokenCookies,
  RequestAuthVerifyAccessTokenCookies,
} from "../../requests/auth/auth.requests";

export interface IAuthValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceAuthSignUpDto;
  verifyEmail: (
    query: RequestAuthVerifyEmailQuery
  ) => ServiceAuthVerifyEmailDto;
  resendVerificationEmail: (
    body: RequestAuthResendVerificationEmailBody
  ) => ServiceAuthResendVerificationEmailDto;
  signIn: (body: RequestAuthSignInBody) => ServiceAuthSingInDto;
  verifyAccessToken: (
    cookies: RequestAuthVerifyAccessTokenCookies
  ) => ServiceAuthVerifyAccessTokenDto;
  refreshAccessToken: (
    cookies: RequestAuthRefreshAccessTokenCookies
  ) => ServiceAuthRefreshAccessTokenDto;
}
