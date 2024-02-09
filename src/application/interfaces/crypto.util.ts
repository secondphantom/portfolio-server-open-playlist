export interface ICryptoUtil {
  encryptPassword: (
    password: string,
    iterations?: number
  ) => Promise<{
    key: string;
  }>;

  verifyPassword: (key: string, password: string) => Promise<boolean>;
}
