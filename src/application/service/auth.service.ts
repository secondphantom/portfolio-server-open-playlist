import { UserDomain } from "../../domain/user.domain";
import { ICryptoUtil } from "../interfaces/crypto.util";
import { IEmailUtil } from "../interfaces/email.util";
import { IUserRepo } from "../interfaces/user.repo";
import { IJwtUtil } from "../interfaces/jwt.util";
import { ENV } from "../../env";
import { ServerError } from "../../dto/error";

export type ServiceSignUpDto = {
  email: string;
  password: string;
  userName: string;
};

export type ServiceVerifyEmailDto = {
  token: string;
};

export type ServiceResendVerificationEmailDto = {
  email: string;
};

export type ServiceSingInDto = {
  email: string;
  password: string;
};

type C_ENV = Pick<ENV, "DATABASE_HOST" | "DOMAIN_URL" | "SERVICE_NAME">;

export class AuthService {
  static instance: AuthService | undefined;
  static getInstance = (inputs: {
    userRepo: IUserRepo;
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
  private cryptoUtil: ICryptoUtil;
  private emailUtil: IEmailUtil;
  private jwtUtil: IJwtUtil;
  private ENV: C_ENV;

  constructor({
    userRepo,
    cryptoUtil,
    emailUtil,
    jwtUtil,
    ENV,
  }: {
    userRepo: IUserRepo;
    cryptoUtil: ICryptoUtil;
    emailUtil: IEmailUtil;
    jwtUtil: IJwtUtil;
    ENV: C_ENV;
  }) {
    this.userRepo = userRepo;
    this.cryptoUtil = cryptoUtil;
    this.emailUtil = emailUtil;
    this.jwtUtil = jwtUtil;
    this.ENV = ENV;
  }

  // [POST] /auth/sign-up
  signUp = async ({ email, password, userName }: ServiceSignUpDto) => {
    // verify email is existed
    const findUser = await this.userRepo.getUserByEmail(email, {
      email: true,
      emailVerified: true,
    });

    if (findUser) {
      throw new ServerError({
        message: "This email is already registered",
        code: 409,
      });
    }

    // create user
    const { key } = await this.cryptoUtil.encryptPassword(password);

    const userDomain = new UserDomain({
      email,
      hashKey: key,
      profileName: userName,
    });

    const createUserDto = userDomain.getCreateUserDto();

    await this.userRepo.createUser(createUserDto);

    const token = await this.jwtUtil.signEmailVerify({
      email: createUserDto.email,
      uuid: createUserDto.uuid,
    });

    // send verification email
    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: `noreplay@${this.ENV.DOMAIN_URL}`,
        name: this.ENV.SERVICE_NAME,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Confirm Your Email Address",
      message: `Welcome to ${this.ENV.SERVICE_NAME}! We're excited to have you on board.\nTo get started, we need to confirm your email address.\nThis ensures that we have the right contact information for you and helps protect your account.\nPlease click the link below to confirm your email address:\n\nhttps://${this.ENV.DOMAIN_URL}/auth/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 500,
      });
    }
  };

  // [GET] /auth/verify-email
  verifyEmail = async ({ token }: ServiceVerifyEmailDto) => {
    const isValidToken = await this.jwtUtil.verifyEmailVerify(token);

    if (!isValidToken) {
      throw new ServerError({
        code: 400,
        message: "Invalid Token",
      });
    }

    const { payload } = this.jwtUtil.decode<{ email: string; uuid: string }>(
      token
    );

    const user = await this.userRepo.getUserByEmail(payload.email, {
      email: true,
      uuid: true,
      emailVerified: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (user.emailVerified) {
      throw new ServerError({
        code: 301,
        message: "Email is already verified",
      });
    }

    await this.userRepo.updateUserByEmail(user.email, { emailVerified: true });
  };

  // [POST] /auth/resend-verification-email
  resendVerificationEmail = async ({
    email,
  }: ServiceResendVerificationEmailDto) => {
    const user = await this.userRepo.getUserByEmail(email, {
      email: true,
      emailVerified: true,
      uuid: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found User",
      });
    }

    if (user.emailVerified) {
      throw new ServerError({
        code: 400,
        message: "Email is already verified",
      });
    }

    const token = await this.jwtUtil.signEmailVerify({
      email: user.email,
      uuid: user.uuid,
    });

    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: `noreplay@${this.ENV.DOMAIN_URL}`,
        name: this.ENV.SERVICE_NAME,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Resend: Confirm Your Email Address",
      message: `We noticed that you haven't confirmed your email address yet.\nTo ensure you can fully enjoy all the benefits of ${this.ENV.SERVICE_NAME}, it's important to verify your email.\nSimply click the link below to confirm your email address:\n\nhttps://${this.ENV.DOMAIN_URL}/auth/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 500,
      });
    }
  };

  // [POST] /auth/sign-in
  signIn = async ({ email, password }: ServiceSingInDto) => {
    const user = await this.userRepo.getUserByEmail(email, {
      emailVerified: true,
      hashKey: true,
      role: true,
      uuid: true,
      id: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (!user.emailVerified) {
      throw new ServerError({
        code: 401,
        message: "Email is not verified",
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

    const token = await this.jwtUtil.signAuth({
      userId: user.id,
      role: user.role,
      uuid: user.uuid,
    });

    return { token };
  };

  // verify-is-login
  // find-password
}
