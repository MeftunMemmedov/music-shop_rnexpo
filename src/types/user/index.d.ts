export type User = {
  id: string;
  email: string;
  user_name: string;
  user_id: string;
  app_metadata?: { provider: 'email' | 'google' };
  user_metadata?: {
    name: string;
  };
};

export type UserAuthState = { user: User; isAuth: boolean };
