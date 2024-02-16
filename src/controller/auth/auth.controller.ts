import { AuthService } from "../../application/service/auth.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestAuthResendVerificationEmail,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
} from "../../requests/auth/auth.requests";
import { IAuthValidator } from "./auth.interface";

export class AuthController {
  static instance: AuthController | undefined;
  static getInstance = ({
    authService,
    authValidator,
  }: {
    authService: AuthService;
    authValidator: IAuthValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new AuthController(authValidator, authService);
    return this.instance;
  };

  constructor(
    private authValidator: IAuthValidator,
    private authService: AuthService
  ) {}

  signUp = async (body: RequestAuthSignUpBody) => {
    try {
      const dto = this.authValidator.signUp(body);
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
      const dto = this.authValidator.verifyEmail(query);
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
    body: RequestAuthResendVerificationEmail
  ) => {
    try {
      const dto = this.authValidator.resendVerificationEmail(body);
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
}
