import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
export const getUserByEmail = async (email: string) => {
  try {
    await dbConnect();
    const user = await UserModel.findOne({ email : email});
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    await dbConnect();
    const user = await UserModel.findOne({ _id : id});

    return user;
  } catch (error) {
    return null;
  }
};
