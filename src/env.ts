export type ENV = {
  LOG_LEVEL: string;
  EMAIL_DOMAIN_URL: string;
  DOMAIN_URL: string;
  SERVICE_NAME: string;
  AUTH_SIGN_IN_ACCESS_JWT_SECRET: string;
  AUTH_SIGN_IN_ACCESS_EXP_DURATION_SEC: string;
  AUTH_SIGN_IN_REFRESH_JWT_SECRET: string;
  AUTH_SIGN_IN_REFRESH_EXP_DURATION_SEC: string;
  AUTH_EMAIL_VERIFY_JWT_SECRET: string;
  AUTH_EMAIL_VERIFY_EXP_DURATION_SEC: string;
  AUTH_RESET_PASSWORD_JWT_SECRET: string;
  AUTH_RESET_PASSWORD_EXP_DURATION_SEC: string;
  DATABASE_URL: string;
  CORS_ALLOW_ORIGIN: string;
  YOUTUBE_DATA_API_KEY: string;
  CORS_CREDENTIAL: string;
};
