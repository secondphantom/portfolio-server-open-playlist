export type JwtConfig = {
  AUTH_SIGN_IN_JWT_SECRET: string;
  AUTH_SIGN_IN_EXP_DURATION_SEC: number;
  AUTH_EMAIL_VERIFY_JWT_SECRET: string;
  AUTH_EMAIL_VERIFY_EXP_DURATION_SEC: number;
};

export type JwtAuthSignPayload = {
  userId: number;
  uuid: string;
  roleId: number;
};

export type JwtEmailVerifyPayload = {
  email: string;
  uuid: string;
};

export type JwtResetPasswordPayload = {
  email: string;
  uuid: string;
};

export interface IJwtUtil {
  signAuthAccessPayload: (payload: JwtAuthSignPayload) => Promise<string>;
  signAuthRefreshPayload: (payload: JwtAuthSignPayload) => Promise<string>;
  signEmailVerifyPayload: (payload: JwtEmailVerifyPayload) => Promise<string>;
  signResetPasswordPayload: (
    payload: JwtResetPasswordPayload
  ) => Promise<string>;

  verifyAuthAccessToken: (token: string) => Promise<boolean>;
  verifyAuthRefreshToken: (token: string) => Promise<boolean>;
  verifyEmailVerifyToken: (token: string) => Promise<boolean>;
  verifyResetPasswordToken: (token: string) => Promise<boolean>;

  decodePayload: <T = { [key in string]: any }>(
    token: string
  ) => { payload: T };
}
