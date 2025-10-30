"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../mongoose";
import { assignBadges } from "../utils";
import { FilterQuery } from "mongoose";

import page from "@/app/(root)/(home)/page";

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
import { BadgeCriteriaType } from "@/types";

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

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    // calc if more questions exist so that we can go to "next" page
    const totalUsers = await User.countDocuments(query);

    // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;

      case "oldest":
        sortOptions = { createdAt: 1 };
        break;

      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;

      case "most_viewed":
        sortOptions = { views: -1 };
        break;

      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "savedPost",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        {
          path: "author",
          model: User,
          select: "_id clerkId name pictureUrl",
        },
      ],
    });

    // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
    const isNext = user.savedPost.length > pageSize;

    if (!user) throw new Error("User not found");

    const savedQuestions = user.savedPost;

    return { questions: savedQuestions, isNext };
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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log("getUserInfo Error: ", error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name pictureUrl");

    // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log("getUserQuestions Error: ", error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
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

    // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
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

// Pagination Backend
// // calc the no. of posts to skip based on the page number and pageSize
// const skipAmount = (page - 1) * pageSize;
// .skip(skipAmount)
// .limit(pageSize)
// calc if more questions exist so that we can go to "next" page
// const totalUsers = await User.countDocuments(query);
// // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
// const isNext = totalUsers > skipAmount + users.length;
// return { users, isNext };

// Pagination frontend
// page: page ? +page : 1,
// <div className="mt-10">
// 	<Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
// </div>
