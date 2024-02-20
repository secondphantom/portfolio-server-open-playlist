import z from "zod";

import { IAuthRequestValidator } from "../../controller/auth/auth.interface";
import {
  RequestAuthResendVerificationEmailBody,
  RequestAuthSignInBody,
  RequestAuthSignUpBody,
  RequestAuthVerifyEmailQuery,
  RequestAuthRefreshAccessTokenCookies,
  RequestAuthVerifyAccessTokenCookies,
} from "../../spec/auth/auth.requests";
import { ServerError } from "../../dto/error";

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
        }),
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

  verifyEmail = (query: RequestAuthVerifyEmailQuery) => {
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

  resendVerificationEmail = (body: RequestAuthResendVerificationEmailBody) => {
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

  signIn = (body: RequestAuthSignInBody) => {
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

  verifyAccessToken = (cookies: RequestAuthVerifyAccessTokenCookies) => {
    try {
      const dto = this.requestVerifyAccessTokenCookies.parse(cookies);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }
  };

  private requestAuthRefreshAccessTokenCookies = z
    .object({
      refreshToken: z.string().min(10),
    })
    .strict();

  refreshAccessToken = (cookies: RequestAuthRefreshAccessTokenCookies) => {
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
}
