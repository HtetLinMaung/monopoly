import { NextFunction, Request, Response } from "express";
import { throwNotFoundException } from "purrts/lib/common";

import {
  getGameById,
  getPlayerIndexFromPlayerId,
} from "../services/game.service";

export default async function (req: Request, _: Response, next: NextFunction) {
  const { gameId } = req.params;
  const game = await getGameById(gameId);
  if (!game) {
    return throwNotFoundException("Game not found!");
  }
  (req as any).game = game;
  const playerId = (req as any).playerId;
  (req as any).playerIndex = getPlayerIndexFromPlayerId(game, playerId);
  next();
}
