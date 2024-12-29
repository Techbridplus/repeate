import TwoFactorConfirmation from "@/models/TwoFactorConfirmation";
import dbConnect from "@/lib/dbConnect";
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    dbConnect();
    const twoFactorConfirmation = await TwoFactorConfirmation.findOne({ userId : userId });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
