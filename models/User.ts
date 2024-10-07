type User = {
  username: string;
  phone: string | null;
};

type UserState = User & {
  accessToken: string | null; // Store access token
};

export { User, UserState };
