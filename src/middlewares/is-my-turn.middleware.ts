import { NextFunction, Request, Response } from "express";
import { throwUnauthorizedException } from "purrts/lib/common";

import { isMyTurn } from "../services/game.service";
import { IGame } from "../models/game.model";

export default async function (req: Request, _: Response, next: NextFunction) {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  if (!isMyTurn(game, playerIndex)) {
    return throwUnauthorizedException("You must wait for your turn!");
  }
  next();
}
