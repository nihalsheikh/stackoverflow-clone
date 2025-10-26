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
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
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

    const newUser = await User.create({
      clerkId: userData.clerkId,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      pictureUrl: userData.picture, // Map picture to pictureUrl
    });

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

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return null;
    }

    revalidatePath(path);

    // return JSON.parse(JSON.stringify(updatedUser));
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
      throw new Error("User not found");
    }

    if (!user) throw new Error("User not found");

    // iF User exists, delete all it's activities: Questions, Answers, Comments, etc...

    // delete Questions
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id",
    );

    await Question.deleteMany({ author: user._id });

    // TODO: delete Answers

    // deleting user
    const deletedUser = await User.findByIdAndDelete(user._id);

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

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error(`User not found with clerkId: ${userId}`);
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log("getUserInfo Error: ", error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name pictureUrl");

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log("getUserQuestions Error: ", error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name pictureUrl", // Make sure clerkId is included
      })
      .populate({
        path: "question",
        model: Question,
        select: "_id title",
      });

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log("getUserAnswers Error: ", error);
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
