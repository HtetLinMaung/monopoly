import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { IGame } from "../../../../../../../models/game.model";
import { getPlayerIndexFromPlayerId } from "../../../../../../../services/game.service";
import {
  bankrupt,
  rotateNextPlayer,
} from "../../../../../../../utils/monopoly";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import { throwBadRequestException } from "purrts/lib/common";

export const handler: Handler = async (req, res) => {
  const playerId: string = (req as any).playerId;
  const game: IGame = (req as any).game;

  const playerIndex = getPlayerIndexFromPlayerId(game, playerId);
  const player = game.players[playerIndex];

  if (player.balance >= 0) {
    return throwBadRequestException(
      "You can only bankrupt when you have balance less than zero!"
    );
  }

  await bankrupt(game, playerIndex);
  await rotateNextPlayer(game);

  res.json({
    code: 200,
    message: "Player has bankrupt successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
