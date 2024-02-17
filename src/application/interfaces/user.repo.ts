import { RepoCreateUserDto, UserEntitySelect } from "../../domain/user.domain";

export interface IUserRepo {
  getUserByEmail: <T extends keyof UserEntitySelect>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;

  updateUserByEmail: (
    email: string,
    values: Partial<UserEntitySelect>
  ) => Promise<void>;

  getUserById: <T extends keyof UserEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;

  createUser: (user: RepoCreateUserDto) => Promise<void>;
}
