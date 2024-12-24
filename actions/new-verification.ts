"use server";

import VerificationToken from "@/models/VerificationToken";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
export const newVerification = async (token: string) => {
  dbConnect();
  console.log("Token : ",token);
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }
  console.log("Existing User : ",existingUser);
  try{
      await User.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          emailVerified: new Date(),
          email: existingToken.email,
        },
      }
    );
  }catch(err){
    console.log("Error in update: ",err);
  }
  
  try{
    await VerificationToken.deleteOne({ _id: existingToken._id });
  }catch(err){
    console.log("Error in delete: ",err);
  }
  

  return { success: "Email verified!" };
};
