// MongoDB Model for User
import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkid: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  pictureUrl: string; // picture
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  savedPost: Schema.Types.ObjectId[]; // saved
  joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional (for Clerk or OAuth users)
  bio: { type: String, default: "" },
  pictureUrl: { type: String, required: true },
  location: { type: String, default: "" },
  portfolioWebsite: { type: String, default: "" },
  reputation: { type: Number, default: 0 },
  savedPost: [{ type: Schema.Types.ObjectId, ref: "Question" }], // or "Post" depending on your model
  joinedAt: { type: Date, default: Date.now },
});

// Optional: add indexes to optimize frequent queries
// UserSchema.index({ username: 1 });
// UserSchema.index({ email: 1 });

const User = models.User || model("User", UserSchema);

export default User;
