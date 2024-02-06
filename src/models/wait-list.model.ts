import { Schema, model } from "mongoose";

export interface IWaitList {
  player: Schema.Types.ObjectId;
  game: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const waitListSchema = new Schema<IWaitList>(
  {
    player: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Player",
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IWaitList>("WaitList", waitListSchema);
