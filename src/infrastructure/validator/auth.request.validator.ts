import z from "zod";

import { IAuthRequestValidator } from "../../controller/auth/auth.interface";
import {
  RequestAuthResendVerificationEmail,
  RequestAuthSignIn,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmail,
  RequestAuthRefreshAccessToken,
  RequestAuthVerifyAccessToken,
  RequestAuthResetPassword,
  RequestAuthVerifyResetPassword,
  RequestAuthFindPassword,
} from "../../spec/auth/auth.requests";
import { ServerError } from "../../dto/error";
import { ServiceAuthFindPasswordDto } from "../../application/service/auth.service";

export class AuthRequestValidator implements IAuthRequestValidator {
  static instance: AuthRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AuthRequestValidator();
    return this.instance;
  };

  constructor() {}

  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  private passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  private requestAuthSignUpBody = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
      password: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .regex(this.passwordValidation, {
          message:
            "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        })
        .max(64),
      userName: z
        .string()
        .min(1, { message: "Must have at least 1 character" }),
    })
    .strict();

  signUp = (body: RequestAuthSignUpBody) => {
    try {
      const dto = this.requestAuthSignUpBody.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthVerifyEmailQuery = z
    .object({
      token: z.string().min(10),
    })
    .strict();

  verifyEmail = (query: RequestAuthVerifyEmail) => {
    try {
      const dto = this.requestAuthVerifyEmailQuery.parse(query);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthResendVerificationEmailBody = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
    })
    .strict();

  resendVerificationEmail = (body: RequestAuthResendVerificationEmail) => {
    try {
      const dto = this.requestAuthResendVerificationEmailBody.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthSignInBody = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
      password: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .regex(this.passwordValidation, {
          message:
            "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
    })
    .strict();

  signIn = (body: RequestAuthSignIn) => {
    try {
      const dto = this.requestAuthSignInBody.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestVerifyAccessTokenCookies = z
    .object({
      accessToken: z.string().min(10),
    })
    .strict();

  verifyAccessToken = (cookies: RequestAuthVerifyAccessToken) => {
    try {
      const dto = this.requestVerifyAccessTokenCookies.parse(cookies);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
        data: {
          error: {
            cause: "INVALID_INPUT",
          },
        },
      });
    }
  };

  private requestAuthRefreshAccessTokenCookies = z
    .object({
      refreshToken: z.string().min(10),
    })
    .strict();

  refreshAccessToken = (cookies: RequestAuthRefreshAccessToken) => {
    try {
      const dto = this.requestAuthRefreshAccessTokenCookies.parse(cookies);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthFindPassword = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
    })
    .strict();

  findPassword = (body: RequestAuthFindPassword) => {
    try {
      const dto = this.requestAuthFindPassword.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthVerifyResetPasswordToken = z
    .object({
      token: z.string().min(10),
    })
    .strict();

  verifyResetPasswordToken = (query: RequestAuthVerifyResetPassword) => {
    try {
      const dto = this.requestAuthVerifyResetPasswordToken.parse(query);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAuthResetPassword = z
    .object({
      token: z.string().min(10),
      password: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .regex(this.passwordValidation, {
          message:
            "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
    })
    .strict();

  resetPassword = (body: RequestAuthResetPassword) => {
    try {
      const dto = this.requestAuthResetPassword.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
