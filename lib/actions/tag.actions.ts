"use server";

import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import { skip } from "node:test";

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

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questionCount: -1 };
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

    let tags;

    // For "popular", use aggregation to count questions
    if (filter === "popular") {
      tags = await Tag.aggregate([
        ...(searchQuery ? [{ $match: query }] : []),
        {
          $addFields: {
            questionCount: { $size: "$questions" },
          },
        },
        { $sort: { questionCount: -1 } },
        { $skip: skipAmount },
        { $limit: pageSize },
      ]);
    } else {
      // For other filters, use regular find
      tags = await Tag.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
    }

    // const tags = await Tag.find(query)
    //   .sort(sortOptions)
    //   .skip(skipAmount)
    //   .limit(pageSize);

    // calc if more questions exist so that we can go to "next" page
    const totalTags = await Tag.countDocuments(query);

    // Example: lets say we have 100Ques => 20Ques/page * 4 pages + 20Ques on last page = 100
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log("getAllTags Error: ", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // calc the no. of posts to skip based on the page number and pageSize
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name pictureUrl" },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
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
