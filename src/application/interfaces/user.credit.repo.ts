import {
  RepoCreateUserCreditDto,
  UserCreditEntitySelect,
} from "../../domain/user.credit.domain";

export interface IUserCreditRepo {
  create: (userCredit: RepoCreateUserCreditDto) => Promise<void>;

  updateByUserId: (
    userId: number,
    value: Partial<UserCreditEntitySelect>
  ) => Promise<void>;

  getByUserId: <T extends keyof UserCreditEntitySelect>(
    userId: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserCreditEntitySelect]?: boolean }
  ) => Promise<Pick<UserCreditEntitySelect, T> | undefined>;
}
