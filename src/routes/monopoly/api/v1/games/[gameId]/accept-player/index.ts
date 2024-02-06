import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { removePlayersFromWaitList } from "../../../../../../../services/wait-list.service";
import { IGame } from "../../../../../../../models/game.model";
import {
  throwNotFoundException,
  throwUnauthorizedException,
} from "purrts/lib/common";
import { addPlayerToGame } from "../../../../../../../services/game.service";
import { getPlayerById } from "../../../../../../../services/player.service";

export const handler: Handler = async (req, res) => {
  const gameId = req.params.gameId;
  const creator: string = (req as any).playerId;
  const game: IGame = (req as any).game;
  const { playerId } = req.body;

  if (game.creator.toString() != creator) {
    return throwUnauthorizedException("Unauthorized!");
  }
  const player = await getPlayerById(playerId);
  if (!player) {
    return throwNotFoundException("Player not found!");
  }
  await addPlayerToGame(game, player);
  await removePlayersFromWaitList([playerId], gameId);

  res.json({
    code: 200,
    message: "Player has been accepted successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware],
};
