// MongoDB Setup
import mongoose from "mongoose";

import config from "@/config/config";

// Checking if Connected to DB
let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!config.mongoDbUrl) return console.log("MISSING MONGODB_URL");

  if (isConnected) return;

  try {
    await mongoose.connect(config.mongoDbUrl, {
      dbName: "codeoverflow",
    });

    isConnected = true;

    console.log("MongoDB is connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};
