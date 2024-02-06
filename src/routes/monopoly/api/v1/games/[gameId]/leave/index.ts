import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { IGame } from "../../../../../../../models/game.model";
import { getPlayerIndexFromPlayerId } from "../../../../../../../services/game.service";
import { leave, rotateNextPlayer } from "../../../../../../../utils/monopoly";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";

export const handler: Handler = async (req, res) => {
  const playerId: string = (req as any).playerId;
  const game: IGame = (req as any).game;

  const playerIndex = getPlayerIndexFromPlayerId(game, playerId);

  await leave(game, playerIndex);
  await rotateNextPlayer(game);

  res.json({
    code: 200,
    message: "Player has leave successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
