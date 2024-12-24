import TwoFactorToken from "@/models/TwoFactorToken";
import dbConnect from "@/lib/dbConnect";
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    dbConnect();
    const twoFactorToken = await TwoFactorToken.findOne({
      where: { token },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    dbConnect();
    const twoFactorToken = await TwoFactorToken.findOne({ email });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
