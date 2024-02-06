import { Schema, model } from "mongoose";

export interface IAuction {
  _id: Schema.Types.ObjectId;
  game: Schema.Types.ObjectId;
  propertyIndex: number;
  currentTurn: number;
  currentBid: number;
  maxBiddedPlayerIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const auctionSchema = new Schema<IAuction>(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    propertyIndex: {
      type: Number,
      required: true,
    },
    currentTurn: {
      type: Number,
      default: 1,
    },
    currentBid: {
      type: Number,
      default: 10.0,
    },
    maxBiddedPlayerIndex: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IAuction>("Auction", auctionSchema);
