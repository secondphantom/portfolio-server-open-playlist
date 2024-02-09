export interface IUserRepo {
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (user: any) => Promise<void>;
}
