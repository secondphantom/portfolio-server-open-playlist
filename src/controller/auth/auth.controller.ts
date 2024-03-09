import {
  AuthService,
  ServiceAuthRefreshAccessTokenDto,
} from "../../application/service/auth.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import { ENV } from "../../env";
import {
  RequestAuthResendVerificationEmail,
  RequestAuthSignIn,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmail,
  RequestAuthVerifyAccessToken,
  RequestAuthVerifyResetPassword,
  RequestAuthResetPassword,
  RequestAuthFindPassword,
} from "../../spec/auth/auth.requests";
import { IAuthRequestValidator } from "./auth.interface";

type C_ENV = Pick<ENV, "CORS_CREDENTIAL">;
type ConstructorInputs = {
  authService: AuthService;
  authRequestValidator: IAuthRequestValidator;
  ENV: C_ENV;
};

export class AuthController {
  static instance: AuthController | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AuthController(inputs);
    return this.instance;
  };

  private authRequestValidator: IAuthRequestValidator;
  private authService: AuthService;
  private ENV: C_ENV;
  constructor({ ENV, authRequestValidator, authService }: ConstructorInputs) {
    this.ENV = ENV;
    this.authRequestValidator = authRequestValidator;
    this.authService = authService;
  }

  signUp = async (body: RequestAuthSignUpBody) => {
    try {
      const dto = this.authRequestValidator.signUp(body);
      await this.authService.signUp(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Sign Up",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  verifyEmail = async (query: RequestAuthVerifyEmail) => {
    try {
      const dto = this.authRequestValidator.verifyEmail(query);
      await this.authService.verifyEmail(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Verify Email",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  resendVerificationEmail = async (
    body: RequestAuthResendVerificationEmail
  ) => {
    try {
      const dto = this.authRequestValidator.resendVerificationEmail(body);
      await this.authService.resendVerificationEmail(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Resend Verification Email",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  signIn = async (body: RequestAuthSignIn) => {
    try {
      const dto = this.authRequestValidator.signIn(body);
      const { accessToken, refreshToken } = await this.authService.signIn(dto);

      return new ControllerResponse({
        code: 200,
        headers: [
          {
            name: "Set-Cookie",
            value: `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
        ],
        payload: {
          success: true,
          message: "Success Sign In",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  verifyAccessToken = async (cookies: RequestAuthVerifyAccessToken) => {
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
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
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
            value: `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
        ],
        payload: {
          success: true,
          message: "Success Refresh Token",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
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
            value: `accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
        ],
        payload: {
          success: true,
          message: "Success Sign Out",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  findPassword = async (body: RequestAuthFindPassword) => {
    try {
      const dto = this.authRequestValidator.findPassword(body);
      await this.authService.findPassword(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Send Email",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  verifyResetPasswordToken = async (query: RequestAuthVerifyResetPassword) => {
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
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  resetPassword = async (body: RequestAuthResetPassword) => {
    try {
      const dto = this.authRequestValidator.resetPassword(body);
      await this.authService.resetPassword(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Reset Password",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
