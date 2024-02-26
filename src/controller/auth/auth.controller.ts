import {
  AuthService,
  ServiceAuthRefreshAccessTokenDto,
} from "../../application/service/auth.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestAuthResendVerificationEmailBody,
  RequestAuthSignInBody,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
  RequestAuthVerifyAccessTokenCookies,
  RequestAuthVerifyResetPasswordToken,
  RequestAuthResetPassword,
  RequestAuthFindPassword,
} from "../../spec/auth/auth.requests";
import { IAuthRequestValidator } from "./auth.interface";

export class AuthController {
  static instance: AuthController | undefined;
  static getInstance = ({
    authService,
    authRequestValidator,
  }: {
    authService: AuthService;
    authRequestValidator: IAuthRequestValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new AuthController(authRequestValidator, authService);
    return this.instance;
  };

  constructor(
    private authRequestValidator: IAuthRequestValidator,
    private authService: AuthService
  ) {}

  signUp = async (body: RequestAuthSignUpBody) => {
    try {
      const dto = this.authRequestValidator.signUp(body);
      await this.authService.signUp(dto);

      return new ControllerResponse({
        code: 301,
        payload: {
          success: true,
          message: "Success Sign Up",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  verifyEmail = async (query: RequestAuthVerifyEmailQuery) => {
    try {
      const dto = this.authRequestValidator.verifyEmail(query);
      await this.authService.verifyEmail(dto);

      return new ControllerResponse({
        code: 301,
        payload: {
          success: true,
          message: "Success Verify Email",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  resendVerificationEmail = async (
    body: RequestAuthResendVerificationEmailBody
  ) => {
    try {
      const dto = this.authRequestValidator.resendVerificationEmail(body);
      await this.authService.resendVerificationEmail(dto);

      return new ControllerResponse({
        code: 301,
        payload: {
          success: true,
          message: "Success Resend Verification Email",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  signIn = async (body: RequestAuthSignInBody) => {
    try {
      const dto = this.authRequestValidator.signIn(body);
      const { accessToken, refreshToken } = await this.authService.signIn(dto);

      return new ControllerResponse({
        code: 301,
        headers: [
          {
            name: "Set-Cookie",
            value: `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
        ],
        payload: {
          success: true,
          message: "Success Sign In",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  verifyAccessToken = async (cookies: RequestAuthVerifyAccessTokenCookies) => {
    try {
      const dto = this.authRequestValidator.verifyAccessToken(cookies);
      const data = await this.authService.verifyAccessToken(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  refreshAccessToken = async (cookies: ServiceAuthRefreshAccessTokenDto) => {
    try {
      const dto = this.authRequestValidator.refreshAccessToken(cookies);
      const { accessToken, refreshToken } =
        await this.authService.refreshAccessToken(dto);

      return new ControllerResponse({
        code: 200,
        headers: [
          {
            name: "Set-Cookie",
            value: `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
        ],
        payload: {
          success: true,
          message: "Success Refresh Token",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  signOut = async () => {
    try {
      return new ControllerResponse({
        code: 200,
        headers: [
          {
            name: "Set-Cookie",
            value: `accessToken=del; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=del; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
        ],
        payload: {
          success: true,
          message: "Success Sign Out",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  findPassword = async (body: RequestAuthFindPassword) => {
    try {
      const dto = this.authRequestValidator.findPassword(body);
      await this.authService.findPassword(dto);

      return new ControllerResponse({
        code: 301,
        payload: {
          success: true,
          message: "Success Send Email",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  verifyResetPasswordToken = async (
    query: RequestAuthVerifyResetPasswordToken
  ) => {
    try {
      const dto = this.authRequestValidator.verifyResetPasswordToken(query);
      const data = await this.authService.verifyResetPasswordToken(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  resetPassword = async (body: RequestAuthResetPassword) => {
    try {
      const dto = this.authRequestValidator.resetPassword(body);
      await this.authService.resetPassword(dto);

      return new ControllerResponse({
        code: 301,
        payload: {
          success: true,
          message: "Success Reset Password",
        },
      });
    } catch (error) {
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };
}
