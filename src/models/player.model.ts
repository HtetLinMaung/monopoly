import { Schema, model } from "mongoose";

export interface IPlayer {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  fullname: string;
  profile_image: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "online",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IPlayer>("Player", playerSchema);
