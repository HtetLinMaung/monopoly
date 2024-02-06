import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../middlewares/is-auth.middleware";
import { createMultiplayerGame } from "../../../../../services/game.service";

export const handler: Handler = async (req, res) => {
  const playerId: string = (req as any).playerId;
  const game = await createMultiplayerGame(playerId);

  res.json({
    code: 200,
    message: "Multiplayer game created successfully.",
    data: game,
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware],
};
