import VerificationToken from "@/models/VerificationToken";
import dbConnect from "@/lib/dbConnect";
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationToken.findOne({ email });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationToken.findOne({ token });
    console.log("verificationToken : ",verificationToken);
    return verificationToken;
  } catch (error) {
    return null;
  }
};
