"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
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
import { redirect } from 'next/navigation'
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
  console.log("existingUser", existingUser);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    console.log("verificationToken", verificationToken);
    try{
        await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
    }catch(e){
        console.log("error sending email", e);
    }
    

    return { success: "Confirmation email Sent!" };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    return { error: "Invalid Credentials!" };
  }

  if (!existingUser.isTwoFactorEnabled && existingUser.email) {
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

      try{
        await TwoFactorConfirmation.deleteOne({
        _id: twoFactorToken._id,
      });
      }catch(e){
          console.log("error deleting two factor token", e);
      }
      
      try{
          const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser._id,
        );

        if (existingConfirmation) {
          await TwoFactorConfirmation.deleteOne({
            _id: existingConfirmation._id,
          });
        }
      }catch(e){
          console.log("error deleting two factor confirmation", e);
      }
      
      try{
          await TwoFactorConfirmation.create({
            userId: existingUser._id,
            user: existingUser._id,
        });
      }catch(e){
          console.log("error creating two factor confirmation", e);
      }
      

    } else {
      try{
          const twoFactorToken = await generateTwoFactorToken(existingUser.email);
          await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      }catch(e){
          console.log("error sending two factor token", e);
      }
      

      return { twoFactor: true };
    }
  }

  try {
    console.log("signing in");
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/settings",
    });
  } catch(e){
        
    if(e instanceof AuthError){
        switch((e.type) ){
            case "CredentialsSignin": return {error: "Invalid credentials"};
            default: return {success: "something went wrong"};
        }
    }
    throw e;
}
}