"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../mongoose";

import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 }); // latest post goes on top

    return { questions };
  } catch (error) {
    console.log("getQuestions Error: ", error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { title, description, tags, author, path } = params;

    // Create the Question
    const question = await Question.create({
      title,
      description,
      author,
    });

    const tagDocuments = [];

    // create the Tags or get them if the already exists
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagDocuments.push(existingTag._id);
    }

    // update the Question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an Interaction record for the User's ask-question action

    // Increment the author's reputation by +5 for creating a question

    // do something that we don't need to rload page after creating question
    revalidatePath(path);
  } catch (error) {
    console.log("createQuestion Error: ", error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name pictureUrl",
      });

    return question;
  } catch (error) {
    console.log("getQuestionById Error: ", error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: update the author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log("upvoteQuestion Error: ", error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: update the author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log("downvoteQuestion Error: ", error);
    throw error;
  }
}

// export async function funName(params: Props) {
// 	try {
// 		// connect to DB
// 		connectToDatabase();
// 	} catch (error) {
// 		console.log(" Error: ", error);
// 		throw error;
// 	}
// }
