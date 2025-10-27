"use server";

import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
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

    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        const popularTags = await Tag.aggregate([
          ...(searchQuery ? [{ $match: query }] : []),
          {
            $addFields: {
              questionCount: { $size: "$questions" },
            },
          },
          { $sort: { questionCount: -1 } },
        ]);

        return { tags: popularTags };
        break;

      case "recent":
        sortOptions = { createdOn: -1 };
        break;

      case "name":
        sortOptions = { name: 1 };
        break;

      case "old":
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query).sort(sortOptions);

    return { tags };
  } catch (error) {
    console.log("getAllTags Error: ", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name pictureUrl" },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log("getQuestionsByTagId Error: ", error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log("getHotTags Error: ", error);
    throw error;
  }
}

// export async function funcName(params: Props) {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.log("funcName Error: ", error);
//     throw error;
//   }
// }
