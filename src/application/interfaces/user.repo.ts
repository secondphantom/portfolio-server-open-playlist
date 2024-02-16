import {
  RepoCreateUserDto,
  UserDomain,
  UserEntitySelect,
} from "../../domain/user.domain";

export interface IUserRepo {
  getUserByEmail: <T extends keyof UserEntitySelect>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;
  createUser: (user: RepoCreateUserDto) => Promise<void>;
}
