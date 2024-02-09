import jwt from "@tsndr/cloudflare-worker-jwt";

import { UserDomain } from "../../domain/user.domain";
import { ICryptoUtil } from "../interfaces/crypto.util";
import { IEmailUtil } from "../interfaces/email.util";
import { IUserRepo } from "../interfaces/user.repo";
import { IJwtUtil } from "../interfaces/jwt.util";

export type ServiceSignUpDto = {
  email: string;
  password: string;
  userName: string;
};

export class AuthService {
  private userRepo: IUserRepo;
  private cryptoUtil: ICryptoUtil;
  private emailUtil: IEmailUtil;
  private jwtUtil: IJwtUtil;

  constructor({
    userRepo,
    cryptoUtil,
    emailUtil,
    jwtUtil,
  }: {
    userRepo: IUserRepo;
    cryptoUtil: ICryptoUtil;
    emailUtil: IEmailUtil;
    jwtUtil: IJwtUtil;
  }) {
    this.userRepo = userRepo;
    this.cryptoUtil = cryptoUtil;
    this.emailUtil = emailUtil;
    this.jwtUtil = jwtUtil;
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

    await this.userRepo.createUser(userDomain.getCreateUserDto());

    if (findUser) {
      throw new ServerError({
        message: "Internal Error",
        code: 500,
      });
    }

    const token = await this.jwtUtil.signEmailVerify({
      email: createUserDto.email,
      uuid: createUserDto.uuid,
    });

    return token;
    // send verify email
  };

  // verify-email
  // sign-in
  // find-password
}
