"use server";

import { connectToDatabase } from "../mongoose";

import { revalidatePath } from "next/cache";

import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

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
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
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
