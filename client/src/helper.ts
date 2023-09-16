import { User } from "./types/types";

export const createConfig = (user: User) => {
  return {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  };
};
