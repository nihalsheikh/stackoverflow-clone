"use server";

import { connectToDatabase } from "../mongoose";

import { revalidatePath } from "next/cache";

import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/question.model";
import User from "@/database/user.model";

export async function getUserById(params: GetUserByIdParams) {
  try {
    // connect to db
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log("getUserById Error: ", error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();

    // console.log("🔄 Creating user with data:", userData);

    const newUser = await User.create({
      clerkId: userData.clerkId,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      pictureUrl: userData.picture, // Map picture to pictureUrl
    });

    // console.log("✅ User created in MongoDB:", newUser);

    return newUser;
  } catch (error) {
    console.log("createUser Error: ", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;

    // console.log("🔄 Updating user with clerkId:", clerkId);
    // console.log("📝 Update data:", updateData);

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      console.log("⚠️ User not found for update, clerkId:", clerkId);
      return null;
    }

    // console.log("✅ User updated in MongoDB:", updatedUser);

    revalidatePath(path);

    return updatedUser;
  } catch (error) {
    console.log("updateUser Error: ", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    // const user = await User.findOneAndDelete({ clerkId }); // original
    const user = await User.findOne({ clerkId });

    if (!user) {
      console.log("⚠️ User not found for deletion, clerkId:", clerkId);
      throw new Error("User not found");
    }

    // console.log("🔄 Deleting user and associated data:", user._id);

    if (!user) throw new Error("User not found");

    // iF User exists, delete all it's activities: Questions, Answers, Comments, etc...

    // delete Questions
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id",
    );

    await Question.deleteMany({ author: user._id });
    // console.log(`🗑️ Deleted ${userQuestionIds.length} questions`);

    // TODO: delete Answers

    // deleting user
    const deletedUser = await User.findByIdAndDelete(user._id);

    // console.log("✅ User deleted from MongoDB:", deletedUser?.username);

    return deletedUser;
  } catch (error) {
    console.log("deleteUser Error: ", error);
    throw error;
  }
}
