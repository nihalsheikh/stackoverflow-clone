"use server";

import { connectToDatabase } from "../mongoose";

import User from "@/database/user.model";

export async function getUserById(params: any) {
  try {
    // connect to db
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log("User Action Error: ", error);
    throw error;
  }
}
