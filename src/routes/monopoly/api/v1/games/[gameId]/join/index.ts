import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { addPlayerToWaitList } from "../../../../../../../services/wait-list.service";
import { IGame } from "../../../../../../../models/game.model";
import { throwBadRequestException } from "purrts/lib/common";

export const handler: Handler = async (req, res) => {
  const gameId = req.params.gameId;
  const playerId: string = (req as any).playerId;
  const game: IGame = (req as any).game;

  const playerIds = game.players
    .filter((p) => !p.isAi)
    .map((p) => p.player?.toString());
  if (playerIds.includes(playerId)) {
    return throwBadRequestException("Already joined!");
  }

  await addPlayerToWaitList(playerId, gameId);
  res.json({
    code: 200,
    message: "Player join successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware],
};
