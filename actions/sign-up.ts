"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import User from "@/models/User";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import dbConnect from "@/lib/dbConnect";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  dbConnect();
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await User.create({
      name,
      email,
      password: hashedPassword,
  });

  const verificationToken = await generateVerificationToken(email);
  console.log("verificationToken : ",verificationToken);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { sucess: "Confirmation email sent!" };
};
