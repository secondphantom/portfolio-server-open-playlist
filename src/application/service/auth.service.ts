import { UserDomain } from "../../domain/user.domain";
import { ICryptoUtil } from "../interfaces/crypto.util";
import { IEmailUtil } from "../interfaces/email.util";
import { IUserRepo } from "../interfaces/user.repo";

export type ServiceSignUpDto = {
  email: string;
  password: string;
  userName: string;
};

export class AuthService {
  private userRepo: IUserRepo;
  private cryptoUtil: ICryptoUtil;
  private emailUtil: IEmailUtil;

  constructor({
    userRepo,
    cryptoUtil,
    emailUtil,
  }: {
    userRepo: IUserRepo;
    cryptoUtil: ICryptoUtil;
    emailUtil: IEmailUtil;
  }) {
    this.userRepo = userRepo;
    this.cryptoUtil = cryptoUtil;
    this.emailUtil = emailUtil;
  }

  //POST
  signUp = async ({ email, password, userName }: ServiceSignUpDto) => {
    // verify email is existed
    const user = await this.userRepo.getUserByEmail(email);
    if (user) {
      throw new ServerError({
        message: "This email is already registered",
        code: 409,
      });
    }

    // create user
    const { key } = await this.cryptoUtil.encryptPassword(password);

    const userDomain = new UserDomain({
      email,
      key,
      userName,
    });

    await this.userRepo.createUser(userDomain);

    // send verify email
    await this.emailUtil.sendEmail();
  };
  // verify-email
  // sign-in
  // find-password
}
