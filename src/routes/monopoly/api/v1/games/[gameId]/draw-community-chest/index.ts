import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import {
  drawCommunityChest,
  rotateNextPlayer,
} from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  const [communityChestIndex, isJailMoved] = await drawCommunityChest(
    game,
    playerIndex
  );
  if (!isJailMoved) {
    await rotateNextPlayer(game);
  }
  res.json({
    code: 200,
    message: "Draw community chest successfully.",
    data: communityChestIndex,
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
