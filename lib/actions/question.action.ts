// All the Server Action Code for the Question Model
"use server";

import { connectToDatabase } from "../mongoose";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

export async function createQuestion(params: any) {
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
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
}
