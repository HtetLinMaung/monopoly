import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import { startGame } from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import {
  throwBadRequestException,
  throwUnauthorizedException,
} from "purrts/lib/common";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerId: string = (req as any).playerId;

  if (game.creator.toString() != playerId) {
    return throwUnauthorizedException("Unauthorized!");
  }

  const playerCount = game.players.length;
  if (playerCount <= 1 || playerCount > 8) {
    return throwBadRequestException(
      "The game must have a minimum of two and a maximum of eight players!"
    );
  }

  await startGame(game);
  res.json({
    code: 200,
    message: "Game started successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware],
};
