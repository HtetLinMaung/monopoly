import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import { handleAiAuctionTurn } from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import { createAuction } from "../../../../../../../services/auction.service";
import { getTurnOnePlayerIndex } from "../../../../../../../services/game.service";
import emitEvent from "../../../../../../../utils/emit-event";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const { propertyIndex } = req.body;

  const auction = await createAuction(game._id.toString(), propertyIndex);
  await emitEvent([game._id.toString()], "auction-start", {
    propertyIndex,
  });
  const turnOnePlayerIndex = getTurnOnePlayerIndex(game);
  const turnOnePlayer = game.players[turnOnePlayerIndex];
  if (turnOnePlayer.isAi) {
    await handleAiAuctionTurn(game, auction, turnOnePlayerIndex);
  } else {
    await emitEvent([turnOnePlayer.player!.toString()], "auction-turn", {});
  }
  res.json({
    code: 200,
    message: "Player auction property successfully.",
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
