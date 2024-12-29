import NextAuth, { DefaultSession, Session } from "next-auth";
import { UserRole } from "@/lib/auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import authConfig from "@/auth.config";
import { getAccountByUserId } from "@/data/accounts";
import { MongoClient } from "mongodb";
import User from "./models/User";
import TwoFactorConfirmation from "./models/TwoFactorConfirmation";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: typeof UserRole;
      isTwoFactorEnabled: boolean;
      name: string;
      email: string;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("linkAccount");
      await User.updateMany(
        { id: user.id },
        { $set: { emailVerified: new Date() } }
      );
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id){
        console.log("user id not exist")
        return false;
      }
      const existingUser = await getUserById(user.id);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified){
        console.log("email not verified")
          return false;
      } 

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await TwoFactorConfirmation.deleteOne({id: twoFactorConfirmation.id });
      }
      console.log("returninig from callback")
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as typeof UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  // adapter: MongoDBAdapter(async () => {
  //   if (!process.env.MONGODB_URI) {
  //     throw new Error("MONGODB_URI is not defined");
  //   }
  //   const client = await MongoClient.connect(process.env.MONGODB_URI);
  //   return client;
  // }),
  session: { strategy: "jwt" },
  ...authConfig,
});

