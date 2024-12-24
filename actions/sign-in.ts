"use server";

import * as z from "zod";
import  AuthError  from "next-auth";
import bcrypt from "bcryptjs";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import TwoFactorConfirmation from "@/models/TwoFactorConfirmation";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import dbConnect from "@/lib/dbConnect";
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  dbConnect();
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email Sent!" };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    return { error: "Invalid Credentials!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await TwoFactorConfirmation.deleteOne({
        _id: twoFactorToken._id,
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await TwoFactorConfirmation.deleteOne({
          _id: existingConfirmation._id,
        });
      }

      await TwoFactorConfirmation.create({
          userId: existingUser.id,
      });

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    console.log("signing in");
    await signIn("credentials", {
      email,
      password,
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });

    // return { success: "Login Sucess!" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials!" };
    } else {
      console.error(error);
      return { error: "Something went wrong!" };
    }

    throw error;
  }
};
