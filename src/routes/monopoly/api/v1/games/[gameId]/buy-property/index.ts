import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import {
  buyProperty,
  rotateNextPlayer,
} from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { throwUnauthorizedException } from "purrts/lib/common";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import { properties } from "../../../../../../../data/properties";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  const { propertyIndex } = req.body;
  const player = game.players[playerIndex];
  if (player.balance < properties[propertyIndex].price) {
    return throwUnauthorizedException("Insufficient balance to buy property!");
  }
  await buyProperty(game, playerIndex, propertyIndex);
  await rotateNextPlayer(game);
  res.json({
    code: 200,
    message: "Player buy property successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
