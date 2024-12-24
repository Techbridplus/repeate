import Account from "@/models/Accounts";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await Account.findOne({
      where: { userId },
    });

    return account;
  } catch (error) {
    return null;
  }
};
