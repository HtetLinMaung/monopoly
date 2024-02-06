import { Schema, model } from "mongoose";

export interface IGame {
  _id: Schema.Types.ObjectId | string;
  currentTurn: number;
  communityChests: IGameCommunityChestOrChance[];
  chances: IGameCommunityChestOrChance[];
  properties: IGameProperty[];
  lastDrawnCommunityChest: number;
  lastDrawnChance: number;
  players: IPlayerState[];
  status: string;
  creator: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameProperty {
  index: number;
  isAvailable: boolean;
  owner: number | null;
}

export interface IPlayerState {
  player: Schema.Types.ObjectId | string | null;
  name: string;
  avatar: string;
  balance: number;
  position: number;
  status: string;
  isAi: boolean;
  properties: IPlayerProperty[];
  cards: IPlayerCard[];
  turn: number;
  totalDiceNumber: number;
  diceRollCount: number;
  inJail: boolean;
}

export interface IPlayerProperty {
  index: number;
  houseCount: number;
  hotelCount: number;
}

export interface IGameCommunityChestOrChance {
  index: number;
  isAvailable: boolean;
}

export interface IPlayerCard {
  type: string;
  index: number;
}

const gameSchema = new Schema<IGame>(
  {
    currentTurn: {
      type: Number,
      default: 1,
    },
    communityChests: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
    chances: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
    properties: [
      {
        index: {
          type: Number,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        owner: {
          type: Number,
          default: null,
        },
      },
    ],
    lastDrawnCommunityChest: {
      type: Number,
      default: -1,
    },
    lastDrawnChance: {
      type: Number,
      default: -1,
    },
    players: [
      {
        player: {
          type: Schema.Types.ObjectId,
          ref: "Player",
          default: null,
        },
        name: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          default: "",
        },
        balance: {
          type: Number,
          default: 1500.0,
        },
        position: {
          type: Number,
          default: 0,
        },
        turn: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          default: "waiting",
        },
        isAi: {
          type: Boolean,
          default: false,
        },
        properties: [
          {
            index: {
              type: Number,
              required: true,
            },
            houseCount: {
              type: Number,
              default: 0,
            },
            hotelCount: {
              type: Number,
              default: 0,
            },
          },
        ],
        cards: [
          {
            type: {
              type: String,
              required: true,
            },
            index: {
              type: Number,
              required: true,
            },
          },
        ],
        totalDiceNumber: {
          type: Number,
          default: 0,
        },
        diceRollCount: {
          type: Number,
          default: 0,
        },
        inJail: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      default: "pending",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IGame>("Game", gameSchema);
