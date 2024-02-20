type Token = {
  payload: {
    id: string;
    role: string;
    uuid: string;
    exp: number;
  };
};

export type ResponseAuthSignInHeader = {
  token: Token;
  cookies: Token;
};
