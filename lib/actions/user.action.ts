"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import path from "path";

import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
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

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.log("getAllUsers Error: ", error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    // connect to db
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const isQuestionSaved = user.savedPost.includes(questionId);

    if (isQuestionSaved) {
      // if already saved then remove, because we clicked 2 times on it, once to save and other to unsave
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { savedPost: questionId },
        },
        { new: true },
      );
    } else {
      // if not saved then save
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { savedPost: questionId },
        },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log("toggleSaveQuestion Error: ", error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    // connect to db
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "savedPost",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name pictureUrl" },
      ],
    });

    if (!user) throw new Error("User not found");

    const savedQuestions = user.savedPost;

    return { questions: savedQuestions };
  } catch (error) {
    console.log("toggleSaveQuestion Error: ", error);
    throw error;
  }
}

// export async function getAllUsers(params: GetAllUsersParams) {
// 	try {
// 		await connectToDatabase();
// 	} catch (error) {
// 		console.log("getAllUsers Error: ", error)
// 		throw error
// 	}
// }
