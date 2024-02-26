export type RequestAuthSignUpBody = {
  username: string;
  email: string;
  password: string;
};

export type RequestAuthVerifyEmailQuery = {
  token: string;
};

export type RequestAuthResendVerificationEmailBody = {
  email: string;
};

export type RequestAuthSignInBody = {
  username: string;
  email: string;
};

export type RequestAuthVerifyAccessTokenCookies = {
  accessToken: string;
};

export type RequestAuthRefreshAccessTokenCookies = {
  refreshToken: string;
};

export type RequestAuthFindPassword = {
  email: string;
};

export type RequestAuthVerifyResetPasswordToken = {
  token: string;
};

export type RequestAuthResetPassword = {
  token: string;
  password: string;
};
