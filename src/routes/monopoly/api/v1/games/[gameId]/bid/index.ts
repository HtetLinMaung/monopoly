import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import {
  bidAuction,
  rotateNextAuction,
} from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import { throwUnauthorizedException } from "purrts/lib/common";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import { getAuctionByPropertyIndex } from "../../../../../../../services/auction.service";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  const player = game.players[playerIndex];
  const { propertyIndex, bidAmount, skip } = req.body;

  const auction = await getAuctionByPropertyIndex(
    game._id.toString(),
    propertyIndex
  );
  if (!auction) {
    return throwUnauthorizedException("This property is not available!");
  }

  if (!skip) {
    if (player.balance < bidAmount) {
      return throwUnauthorizedException("Insufficient balance to bid!");
    }
    await bidAuction(auction, bidAmount, playerIndex);
  }

  await rotateNextAuction(game, auction._id.toString());
  res.json({
    code: 200,
    message: "Player bid successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
