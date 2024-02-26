import {
  ServiceAuthFindPasswordDto,
  ServiceAuthRefreshAccessTokenDto,
  ServiceAuthResendVerificationEmailDto,
  ServiceAuthResetPasswordTokenDto,
  ServiceAuthSignUpDto,
  ServiceAuthSingInDto,
  ServiceAuthVerifyAccessTokenDto,
  ServiceAuthVerifyEmailDto,
  ServiceAuthVerifyResetPasswordTokenDto,
} from "../../application/service/auth.service";
import {
  RequestAuthResendVerificationEmailBody,
  RequestAuthSignInBody,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
  RequestAuthRefreshAccessTokenCookies,
  RequestAuthVerifyAccessTokenCookies,
  RequestAuthVerifyResetPasswordToken,
  RequestAuthResetPassword,
  RequestAuthFindPassword,
} from "../../spec/auth/auth.requests";

export interface IAuthRequestValidator {
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
  findPassword: (body: RequestAuthFindPassword) => ServiceAuthFindPasswordDto;
  verifyResetPasswordToken: (
    query: RequestAuthVerifyResetPasswordToken
  ) => ServiceAuthVerifyResetPasswordTokenDto;
  resetPassword: (
    body: RequestAuthResetPassword
  ) => ServiceAuthResetPasswordTokenDto;
}
