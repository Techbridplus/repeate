import { auth, User as AuthUser } from "@/auth";

// Extend the User type to include the role property
declare module "@/auth" {
  interface User {
    role?: string;
  }
}

export interface User extends AuthUser {
  role?: string;
}

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return (session?.user as unknown as User)?.role;
};
export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
};