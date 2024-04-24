import {
  RepoCreateUserDto,
  UserEntityInsert,
  UserEntitySelect,
} from "../../domain/user.domain";

export type UpdateUserDto = Partial<UserEntitySelect> &
  Pick<UserEntitySelect, "id">;
export interface IUserRepo {
  getByEmail: <T extends keyof UserEntitySelect>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;

  updateByEmail: (
    email: string,
    values: Partial<UserEntitySelect>
  ) => Promise<void>;

  getById: <T extends keyof UserEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;

  create: (user: RepoCreateUserDto) => Promise<void>;

  updateById: (id: number, value: Partial<UserEntitySelect>) => Promise<void>;
}
