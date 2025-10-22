"use server";

import { connectToDatabase } from "../mongoose";

import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();

    const { userId } = params; // use later: limit = 3

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // if user is found, find it's interaction for the User and group by tags...
    // create new db called Interactions later...

    return [
      { _id: "01", name: "tag1" },
      { _id: "02", name: "tag2" },
      { _id: "03", name: "tag3" },
    ];
  } catch (error) {
    console.log("getTopInteractedTags Error: ", error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();

    // const { page, pageSize, filter, searchQuery } = params;

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log("getAllTags Error: ", error);
    throw error;
  }
}

// export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.log("getTopInteractedTags Error: ", error);
//     throw error;
//   }
// }
