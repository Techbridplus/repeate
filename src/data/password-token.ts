import PasswordResetToken from "@/models/PasswordResetToken";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      where: { email },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
