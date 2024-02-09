import jwt from "@tsndr/cloudflare-worker-jwt";
import {
  IJwtUtil,
  JwtAuthSignPayload,
  JwtConfig,
  JwtEmailVerifyPayload,
} from "../../application/interfaces/jwt.util";

export class JwtUtil implements IJwtUtil {
  private AUTH_SIGN_IN_JWT_SECRET: string;
  private AUTH_SIGN_IN_EXP_DURATION_SEC: number;
  private AUTH_EMAIL_VERIFY_JWT_SECRET: string;
  private AUTH_EMAIL_VERIFY_EXP_DURATION_SEC: number;

  constructor({
    AUTH_SIGN_IN_JWT_SECRET,
    AUTH_SIGN_IN_EXP_DURATION_SEC,
    AUTH_EMAIL_VERIFY_JWT_SECRET,
    AUTH_EMAIL_VERIFY_EXP_DURATION_SEC,
  }: JwtConfig) {
    this.AUTH_SIGN_IN_JWT_SECRET = AUTH_SIGN_IN_JWT_SECRET;
    this.AUTH_SIGN_IN_EXP_DURATION_SEC = AUTH_SIGN_IN_EXP_DURATION_SEC;
    this.AUTH_EMAIL_VERIFY_JWT_SECRET = AUTH_EMAIL_VERIFY_JWT_SECRET;
    this.AUTH_EMAIL_VERIFY_EXP_DURATION_SEC =
      AUTH_EMAIL_VERIFY_EXP_DURATION_SEC;
  }

  signAuth = async (payload: JwtAuthSignPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp: nowSec + this.AUTH_SIGN_IN_EXP_DURATION_SEC,
      },
      this.AUTH_SIGN_IN_JWT_SECRET
    );
    return token;
  };

  signEmailVerify = async (payload: JwtEmailVerifyPayload) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = await jwt.sign(
      {
        ...payload,
        iat: nowSec,
        exp: nowSec + this.AUTH_EMAIL_VERIFY_EXP_DURATION_SEC,
      },
      this.AUTH_EMAIL_VERIFY_JWT_SECRET
    );
    return token;
  };

  verifyAuth = async (token: string) => {
    const isValid = await jwt.verify(token, this.AUTH_SIGN_IN_JWT_SECRET);
    return isValid;
  };

  verifyEmailVerify = async (token: string) => {
    const isValid = await jwt.verify(token, this.AUTH_EMAIL_VERIFY_JWT_SECRET);
    return isValid;
  };

  decode = <T = { [x: string]: any }>(token: string) => {
    const { payload } = jwt.decode(token);
    return { payload: payload as T };
  };
}
