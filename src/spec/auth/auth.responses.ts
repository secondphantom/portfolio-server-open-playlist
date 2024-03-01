export type ErrorResponseAuthSignIn = { isEmailVerified: boolean } | undefined;

export type ResponseAuthVerifyAccessToken = {
  roleId: number;
  userId: number;
  uuid: string;
};
