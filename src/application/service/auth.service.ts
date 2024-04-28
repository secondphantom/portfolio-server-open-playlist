import { UserDomain } from "../../domain/user.domain";
import { ICryptoUtil } from "../interfaces/crypto.util";
import { IEmailUtil } from "../interfaces/email.util";
import { IUserRepo } from "../interfaces/user.repo";
import {
  IJwtUtil,
  JwtAuthSignPayload,
  JwtResetPasswordPayload,
} from "../interfaces/jwt.util";
import { ENV } from "../../env";
import { ServerError } from "../../dto/error";
import { UserCreditDomain } from "../../domain/user.credit.domain";
import { IUserCreditRepo } from "../interfaces/user.credit.repo";

export type ServiceAuthSignUpDto = {
  email: string;
  password: string;
  userName: string;
};

export type ServiceAuthVerifyEmailDto = {
  token: string;
};

export type ServiceAuthResendVerificationEmailDto = {
  email: string;
};

export type ServiceAuthSingInDto = {
  email: string;
  password: string;
};

export type ServiceAuthVerifyAccessTokenDto = {
  accessToken: string;
};

export type ServiceAuthRefreshAccessTokenDto = {
  refreshToken: string;
};

export type ServiceAuthFindPasswordDto = {
  email: string;
};

export type ServiceAuthVerifyResetPasswordTokenDto = {
  token: string;
};

export type ServiceAuthResetPasswordTokenDto = {
  token: string;
  password: string;
};

type C_ENV = Pick<
  ENV,
  "DATABASE_HOST" | "DOMAIN_URL" | "SERVICE_NAME" | "EMAIL_DOMAIN_URL"
>;

export class AuthService {
  static instance: AuthService | undefined;
  static getInstance = (inputs: {
    userRepo: IUserRepo;
    userCreditRepo: IUserCreditRepo;
    cryptoUtil: ICryptoUtil;
    emailUtil: IEmailUtil;
    jwtUtil: IJwtUtil;
    ENV: C_ENV;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new AuthService(inputs);
    return this.instance;
  };

  private userRepo: IUserRepo;
  private userCreditRepo: IUserCreditRepo;
  private cryptoUtil: ICryptoUtil;
  private emailUtil: IEmailUtil;
  private jwtUtil: IJwtUtil;
  private ENV: C_ENV;

  constructor({
    userRepo,
    userCreditRepo,
    cryptoUtil,
    emailUtil,
    jwtUtil,
    ENV,
  }: {
    userRepo: IUserRepo;
    userCreditRepo: IUserCreditRepo;
    cryptoUtil: ICryptoUtil;
    emailUtil: IEmailUtil;
    jwtUtil: IJwtUtil;
    ENV: C_ENV;
  }) {
    this.userRepo = userRepo;
    this.userCreditRepo = userCreditRepo;
    this.cryptoUtil = cryptoUtil;
    this.emailUtil = emailUtil;
    this.jwtUtil = jwtUtil;
    this.ENV = ENV;
  }

  // [POST] /auth/sign-up
  signUp = async ({ email, password, userName }: ServiceAuthSignUpDto) => {
    const findUser = await this.userRepo.getByEmail(email, {
      email: true,
      isEmailVerified: true,
    });

    if (findUser) {
      throw new ServerError({
        message: "This email is already registered",
        code: 409,
      });
    }

    const { key } = await this.cryptoUtil.encryptPassword(password);

    const userDomain = new UserDomain({
      email,
      hashKey: key,
      profileName: userName,
    });

    const createUserDto = userDomain.getCreateUserDto();

    const token = await this.jwtUtil.signEmailVerifyPayload({
      email: createUserDto.email,
      uuid: createUserDto.uuid,
    });

    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: `noreplay@${this.ENV.EMAIL_DOMAIN_URL}`,
        name: this.ENV.SERVICE_NAME,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Confirm Your Email Address",
      message: `Welcome to ${this.ENV.SERVICE_NAME}! We're excited to have you on board.\nTo get started, we need to confirm your email address.\nThis ensures that we have the right contact information for you and helps protect your account.\nPlease click the link below to confirm your email address:\n\n${this.ENV.DOMAIN_URL}/auth/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 500,
      });
    }

    await this.userRepo.create(createUserDto);

    const user = await this.userRepo.getByEmail(createUserDto.email, {
      id: true,
    });

    if (!user) {
      throw new ServerError({
        message: "Fail to create user",
        code: 500,
      });
    }

    const userCreditDomain = new UserCreditDomain({
      userId: user.id,
    });

    const createUserCreditDto = userCreditDomain.getCreateUserCreditDto();

    await this.userCreditRepo.create(createUserCreditDto);
  };

  // [GET] /auth/verify-email
  verifyEmail = async ({ token }: ServiceAuthVerifyEmailDto) => {
    const isValidToken = await this.jwtUtil.verifyEmailVerifyToken(token);

    if (!isValidToken) {
      throw new ServerError({
        code: 400,
        message: "Invalid Token",
      });
    }

    const { payload } = this.jwtUtil.decodePayload<{
      email: string;
      uuid: string;
    }>(token);

    const user = await this.userRepo.getByEmail(payload.email, {
      email: true,
      uuid: true,
      isEmailVerified: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (user.isEmailVerified) {
      throw new ServerError({
        code: 200,
        message: "Email is already verified",
      });
    }

    await this.userRepo.updateByEmail(user.email, {
      isEmailVerified: true,
    });
  };

  // [POST] /auth/resend-verification-email
  resendVerificationEmail = async ({
    email,
  }: ServiceAuthResendVerificationEmailDto) => {
    const user = await this.userRepo.getByEmail(email, {
      email: true,
      isEmailVerified: true,
      uuid: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found User",
      });
    }

    if (user.isEmailVerified) {
      throw new ServerError({
        code: 400,
        message: "Email is already verified",
      });
    }

    const token = await this.jwtUtil.signEmailVerifyPayload({
      email: user.email,
      uuid: user.uuid,
    });

    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: `noreplay@${this.ENV.EMAIL_DOMAIN_URL}`,
        name: this.ENV.SERVICE_NAME,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Resend: Confirm Your Email Address",
      message: `We noticed that you haven't confirmed your email address yet.\nTo ensure you can fully enjoy all the benefits of ${this.ENV.SERVICE_NAME}, it's important to verify your email.\nSimply click the link below to confirm your email address:\n\n${this.ENV.DOMAIN_URL}/auth/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 500,
      });
    }
  };

  // [POST] /auth/sign-in
  signIn = async ({ email, password }: ServiceAuthSingInDto) => {
    const user = await this.userRepo.getByEmail(email, {
      isEmailVerified: true,
      hashKey: true,
      roleId: true,
      uuid: true,
      id: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (!user.isEmailVerified) {
      throw new ServerError({
        code: 401,
        message: "Email is not verified",
        data: {
          isEmailVerified: user.isEmailVerified,
        },
      });
    }

    const isValidPassword = await this.cryptoUtil.verifyPassword(
      user.hashKey,
      password
    );

    if (!isValidPassword) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const token = this.getSignAuthToken({
      userId: user.id,
      roleId: user.roleId,
      uuid: user.uuid,
    });

    return token;
  };

  private getSignAuthToken = async (payload: JwtAuthSignPayload) => {
    const accessToken = await this.jwtUtil.signAuthAccessPayload(payload);
    const refreshToken = await this.jwtUtil.signAuthRefreshPayload(payload);
    return {
      accessToken,
      refreshToken,
    };
  };

  // GET /auth/verify-access-token
  verifyAccessToken = async ({
    accessToken,
  }: ServiceAuthVerifyAccessTokenDto) => {
    const isValidToken = await this.jwtUtil.verifyAuthAccessToken(accessToken);
    if (!isValidToken) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
        data: {
          error: {
            cause: "INVALID_TOKEN",
          },
        },
      });
    }

    const { payload } =
      this.jwtUtil.decodePayload<JwtAuthSignPayload>(accessToken);

    return {
      roleId: payload.roleId,
      userId: payload.userId,
      uuid: payload.uuid,
    };
  };

  // POST /auth/refresh-access-token
  refreshAccessToken = async ({
    refreshToken,
  }: ServiceAuthRefreshAccessTokenDto) => {
    const isValidToken = await this.jwtUtil.verifyAuthRefreshToken(
      refreshToken
    );
    if (!isValidToken) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const { payload } =
      this.jwtUtil.decodePayload<JwtAuthSignPayload>(refreshToken);

    const user = await this.userRepo.getById(payload.userId, {
      uuid: true,
      id: true,
      roleId: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (user.uuid !== payload.uuid) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const token = this.getSignAuthToken({
      userId: user.id,
      roleId: user.roleId,
      uuid: user.uuid,
    });

    return token;
  };

  // find-password [POST] /auth/find-password
  findPassword = async (dto: ServiceAuthFindPasswordDto) => {
    const user = await this.userRepo.getByEmail(dto.email, {
      id: true,
      email: true,
      uuid: true,
      profileName: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    const token = await this.jwtUtil.signResetPasswordPayload({
      email: user.email,
      uuid: user.uuid,
    });

    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: `noreplay@${this.ENV.EMAIL_DOMAIN_URL}`,
        name: this.ENV.SERVICE_NAME,
      },
      to: [
        {
          email: user.email,
        },
      ],
      subject: "Password Reset Request",
      message: `Dear ${user.profileName},\nWe received a request to reset the password for your account associated with ${user.email}. If you did not make this request, please ignore this email.\nTo reset your password, please click the link below:\n\n${this.ENV.DOMAIN_URL}/auth/reset-password?token=${token}\n\nThis link will expire in 60 minutes. If you need a new link, please start the password reset process again on our website.\nIf you encounter any issues or did not request a password reset, please contact our support team for assistance.\nThank you for using our services.\n\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send email about reset",
        code: 500,
      });
    }
  };

  // verify-reset-password-token [GET] /auth/reset-password?token=
  verifyResetPasswordToken = async (
    dto: ServiceAuthVerifyResetPasswordTokenDto
  ) => {
    const isValidToken = await this.jwtUtil.verifyResetPasswordToken(dto.token);

    if (!isValidToken) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const { payload } = this.jwtUtil.decodePayload<JwtResetPasswordPayload>(
      dto.token
    );

    return {
      email: payload.email,
      uuid: payload.uuid,
    };
  };

  // reset-password [POST] /auth/reset-password
  resetPassword = async (dto: ServiceAuthResetPasswordTokenDto) => {
    const isValidToken = await this.jwtUtil.verifyResetPasswordToken(dto.token);

    if (!isValidToken) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const { payload } = this.jwtUtil.decodePayload<JwtResetPasswordPayload>(
      dto.token
    );

    const user = await this.userRepo.getByEmail(payload.email, {
      email: true,
      uuid: true,
      id: true,
    });

    if (!user) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const { key } = await this.cryptoUtil.encryptPassword(dto.password);

    await this.userRepo.updateById(user.id, {
      hashKey: key,
      uuid: UserDomain.getUuid(),
    });
  };
}
