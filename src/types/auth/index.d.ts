type AuthForm = {
  email?: string;
  password: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type SignInResponse = AuthTokens & {
  user: {
    id: string;
  };
};
