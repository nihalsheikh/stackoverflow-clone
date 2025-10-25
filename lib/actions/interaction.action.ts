"use server";

import { connectToDatabase } from "../mongoose";

import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    // connect to DB
    await connectToDatabase();

    const { questionId, userId } = params;

    // Update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User has alreqady viewed.");

      // if not viewed then create an Interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log("viewQuestion Error: ", error);
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
