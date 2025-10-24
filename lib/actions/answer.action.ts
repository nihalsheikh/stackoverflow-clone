"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../mongoose";

import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { description, author, question, path } = params;

    // console.log("creating answer in db");

    const newAnswer = await Answer.create({ description, author, question });

    // add the Answer to Question Model's answer array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // console.log("created answer in db");

    // TODO: create the interaction...

    revalidatePath(path);
  } catch (error) {
    console.log("createAnswer Error: ", error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name pictureUrl")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log("getAnswers Error: ", error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: update the author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log("upvoteAnswer Error: ", error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: update the author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log("downvoteAnswer Error: ", error);
    throw error;
  }
}

// export async function funName(params) {
// 	try {
// 		// connect to DB
// 		connectToDatabase();
// 	} catch (error) {
// 		console.log(" Error: ", error);
// 		throw error;
// 	}
// }
