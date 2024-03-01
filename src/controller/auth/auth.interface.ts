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
  RequestAuthResendVerificationEmail,
  RequestAuthSignIn,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmail,
  RequestAuthRefreshAccessToken,
  RequestAuthVerifyAccessToken,
  RequestAuthVerifyResetPassword,
  RequestAuthResetPassword,
  RequestAuthFindPassword,
} from "../../spec/auth/auth.requests";

export interface IAuthRequestValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceAuthSignUpDto;
  verifyEmail: (query: RequestAuthVerifyEmail) => ServiceAuthVerifyEmailDto;
  resendVerificationEmail: (
    body: RequestAuthResendVerificationEmail
  ) => ServiceAuthResendVerificationEmailDto;
  signIn: (body: RequestAuthSignIn) => ServiceAuthSingInDto;
  verifyAccessToken: (
    cookies: RequestAuthVerifyAccessToken
  ) => ServiceAuthVerifyAccessTokenDto;
  refreshAccessToken: (
    cookies: RequestAuthRefreshAccessToken
  ) => ServiceAuthRefreshAccessTokenDto;
  findPassword: (body: RequestAuthFindPassword) => ServiceAuthFindPasswordDto;
  verifyResetPasswordToken: (
    query: RequestAuthVerifyResetPassword
  ) => ServiceAuthVerifyResetPasswordTokenDto;
  resetPassword: (
    body: RequestAuthResetPassword
  ) => ServiceAuthResetPasswordTokenDto;
}
