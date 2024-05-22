import jwt from "@tsndr/cloudflare-worker-jwt";

import {
  IJwtUtil,
  JwtAuthSignPayload,
  JwtConfig,
  JwtEmailVerifyPayload,
  JwtResetPasswordPayload,
} from "../../application/interfaces/jwt.util";
import { ENV } from "../../env";

type C_ENV = Pick<
  ENV,
  | "AUTH_EMAIL_VERIFY_EXP_DURATION_SEC"
  | "AUTH_EMAIL_VERIFY_JWT_SECRET"
  | "AUTH_SIGN_IN_ACCESS_EXP_DURATION_SEC"
  | "AUTH_SIGN_IN_ACCESS_JWT_SECRET"
  | "AUTH_SIGN_IN_REFRESH_JWT_SECRET"
  | "AUTH_SIGN_IN_REFRESH_EXP_DURATION_SEC"
  | "AUTH_RESET_PASSWORD_JWT_SECRET"
  | "AUTH_RESET_PASSWORD_EXP_DURATION_SEC"
>;

export class JwtUtil implements IJwtUtil {
  static instance: JwtUtil | undefined;
  static getInstance = (ENV: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new JwtUtil(ENV);
    return this.instance;
  };

  constructor(private ENV: C_ENV) {}

  signAuthAccessPayload = async (payload: JwtAuthSignPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const exp =
      nowSec + parseInt(this.ENV.AUTH_SIGN_IN_ACCESS_EXP_DURATION_SEC);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp,
      },
      this.ENV.AUTH_SIGN_IN_ACCESS_JWT_SECRET
    );
    const expirationDate = new Date(exp * 1000);

    return { token, expirationDate };
  };

  signAuthRefreshPayload = async (payload: JwtAuthSignPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const exp =
      nowSec + parseInt(this.ENV.AUTH_SIGN_IN_REFRESH_EXP_DURATION_SEC);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp,
      },
      this.ENV.AUTH_SIGN_IN_REFRESH_JWT_SECRET
    );
    const expirationDate = new Date(exp * 1000);
    return { token, expirationDate };
  };

  signEmailVerifyPayload = async (payload: JwtEmailVerifyPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const exp = nowSec + parseInt(this.ENV.AUTH_EMAIL_VERIFY_EXP_DURATION_SEC);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp,
      },
      this.ENV.AUTH_EMAIL_VERIFY_JWT_SECRET
    );
    const expirationDate = new Date(exp * 1000);
    return { token, expirationDate };
  };

  signResetPasswordPayload = async (payload: JwtResetPasswordPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const exp =
      nowSec + parseInt(this.ENV.AUTH_RESET_PASSWORD_EXP_DURATION_SEC);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp,
      },
      this.ENV.AUTH_RESET_PASSWORD_JWT_SECRET
    );
    const expirationDate = new Date(exp * 1000);
    return { token, expirationDate };
  };

  verifyAuthAccessToken = async (token: string) => {
    const isValid = await jwt.verify(
      token,
      this.ENV.AUTH_SIGN_IN_ACCESS_JWT_SECRET
    );
    return isValid;
  };

  verifyAuthRefreshToken = async (token: string) => {
    const isValid = await jwt.verify(
      token,
      this.ENV.AUTH_SIGN_IN_REFRESH_JWT_SECRET
    );
    return isValid;
  };

  verifyEmailVerifyToken = async (token: string) => {
    const isValid = await jwt.verify(
      token,
      this.ENV.AUTH_EMAIL_VERIFY_JWT_SECRET
    );
    return isValid;
  };

  verifyResetPasswordToken = async (token: string) => {
    const isValid = await jwt.verify(
      token,
      this.ENV.AUTH_RESET_PASSWORD_JWT_SECRET
    );
    return isValid;
  };

  decodePayload = <T = { [x: string]: any }>(token: string) => {
    const { payload } = jwt.decode(token);
    return { payload: payload as T };
  };
}
