import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import PasswordResetToken from "@/models/PasswordResetToken";
import { getPasswordResetTokenByEmail } from "@/data/password-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import VerificationToken from "@/models/VerificationToken";
import TwoFactorToken from "@/models/TwoFactorToken";
import dbConnect from "./dbConnect";
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  dbConnect();
  if (existingToken) {
    await PasswordResetToken.deleteMany({
      _id: existingToken._id,
    });
  }

  const passwordResetToken = await PasswordResetToken.create({
    
      email,
      token,
      expires,

  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await VerificationToken.deleteMany({
      _id: existingToken._id,
    });
  }

  const verificationToken = await VerificationToken.create({
      email,
      token,
      expires,
  });

  return verificationToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await TwoFactorToken.deleteMany({
      _id: existingToken._id,
    });
  }

  const twoFactorToken = await TwoFactorToken.create({
      email,
      token,
      expires,

  });

  return twoFactorToken;
};
