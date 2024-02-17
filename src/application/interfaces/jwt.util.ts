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

export interface IJwtUtil {
  signAuthAccess: (payload: JwtAuthSignPayload) => Promise<string>;
  signAuthRefresh: (payload: JwtAuthSignPayload) => Promise<string>;
  signEmailVerify: (payload: JwtEmailVerifyPayload) => Promise<string>;

  verifyAuthAccess: (token: string) => Promise<boolean>;
  verifyAuthRefresh: (token: string) => Promise<boolean>;
  verifyEmailVerify: (token: string) => Promise<boolean>;

  decode: <T = { [key in string]: any }>(token: string) => { payload: T };
}
