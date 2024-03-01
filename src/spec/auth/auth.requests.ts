export type RequestAuthSignUpBody = {
  username: string;
  email: string;
  password: string;
};

export type RequestAuthVerifyEmail = {
  token: string;
};

export type RequestAuthResendVerificationEmail = {
  email: string;
};

export type RequestAuthSignIn = {
  email: string;
  password: string;
};

export type RequestAuthVerifyAccessToken = {
  accessToken: string;
};

export type RequestAuthRefreshAccessToken = {
  refreshToken: string;
};

export type RequestAuthFindPassword = {
  email: string;
};

export type RequestAuthVerifyResetPassword = {
  token: string;
};

export type RequestAuthResetPassword = {
  token: string;
  password: string;
};
