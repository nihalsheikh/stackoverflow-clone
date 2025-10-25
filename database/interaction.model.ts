// MongoDB Model for Views
import { Document, Schema, model, models } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // this is reference to the user
  action: string;
  question: Schema.Types.ObjectId; // reference to all the questions viewed
  answer: Schema.Types.ObjectId; // reference to all the answers viewed
  tags: Schema.Types.ObjectId[]; // reference to all the tags viewed
  createdAt: Date; // when did the interaction happen
}

const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
