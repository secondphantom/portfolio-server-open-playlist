import { RepoCreateUserDto, UserDomain } from "../../domain/user.domain";

export interface IUserRepo {
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (user: RepoCreateUserDto) => Promise<void>;
}
