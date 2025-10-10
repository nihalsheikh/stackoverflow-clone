// All the Server Action Code for the Question Model
"use server";

import { connectToDatabase } from "../mongoose";

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

// All the Server Action Code for the Question Model

export async function createQuestion(params: any) {
  try {
    // connect to DB
    connectToDatabase();
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
}
