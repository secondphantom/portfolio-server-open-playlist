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
    const findUser = await this.userRepo.getUserByEmail(email);
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
      message: `Welcome to ${this.ENV.SERVICE_NAME}! We're excited to have you on board.\nTo get started, we need to confirm your email address.\n This ensures that we have the right contact information for you and helps protect your account.\nPlease click the link below to confirm your email address:\n\nhttps://${this.ENV.DOMAIN_URL}/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${this.ENV.SERVICE_NAME} Team`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 400,
      });
    }
  };

  // resend-verification-email
  // verify-email
  // sign-in
  // find-password
}
