import jwt from "@tsndr/cloudflare-worker-jwt";
import {
  IJwtUtil,
  JwtAuthSignPayload,
  JwtConfig,
  JwtEmailVerifyPayload,
} from "../../application/interfaces/jwt.util";
import { ENV } from "../../env";

type C_ENV = Pick<
  ENV,
  | "AUTH_EMAIL_VERIFY_EXP_DURATION_SEC"
  | "AUTH_EMAIL_VERIFY_JWT_SECRET"
  | "AUTH_SIGN_IN_EXP_DURATION_SEC"
  | "AUTH_SIGN_IN_JWT_SECRET"
>;

export class JwtUtil implements IJwtUtil {
  static instance: JwtUtil | undefined;
  static getInstance = (ENV: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new JwtUtil(ENV);
    return this.instance;
  };

  constructor(private ENV: C_ENV) {}

  signAuth = async (payload: JwtAuthSignPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp: nowSec + parseInt(this.ENV.AUTH_SIGN_IN_EXP_DURATION_SEC),
      },
      this.ENV.AUTH_SIGN_IN_JWT_SECRET
    );
    return token;
  };

  signEmailVerify = async (payload: JwtEmailVerifyPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp: nowSec + parseInt(this.ENV.AUTH_EMAIL_VERIFY_EXP_DURATION_SEC),
      },
      this.ENV.AUTH_EMAIL_VERIFY_JWT_SECRET
    );
    return token;
  };

  verifyAuth = async (token: string) => {
    const isValid = await jwt.verify(token, this.ENV.AUTH_SIGN_IN_JWT_SECRET);
    return isValid;
  };

  verifyEmailVerify = async (token: string) => {
    const isValid = await jwt.verify(
      token,
      this.ENV.AUTH_EMAIL_VERIFY_JWT_SECRET
    );
    return isValid;
  };

  decode = <T = { [x: string]: any }>(token: string) => {
    const { payload } = jwt.decode(token);
    return { payload: payload as T };
  };
}
