import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import {
  incrementPlayerDiceRollCount,
  moveToJail,
  payIncomeTax,
  payRentalPrice,
  playerArriveAtJail,
  playerMoveAfterRollingDice,
  playerRollDice,
  resetDiceRollCount,
  rotateNextPlayer,
} from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import { board } from "../../../../../../../data/board";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import { throwInternalServerErrorException } from "purrts/lib/common";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  const player = game.players[playerIndex];
  const { total, numbers } = await playerRollDice(
    game._id.toString(),
    playerIndex
  );
  let data = null;
  let twoSameDice = numbers[0] == numbers[1];
  let propertyIndex = 0;
  let playerTurn = true;
  if (player.inJail) {
    if (twoSameDice) {
      await resetDiceRollCount(game, playerIndex);
      const newPosition = await playerMoveAfterRollingDice(
        game,
        playerIndex,
        total
      );
      propertyIndex = newPosition;
      data = board[newPosition];
    } else {
      await rotateNextPlayer(game);
      playerTurn = false;
    }
  } else {
    if (twoSameDice) {
      await incrementPlayerDiceRollCount(game, playerIndex, total);
    } else {
      const newPosition = await playerMoveAfterRollingDice(
        game,
        playerIndex,
        total + player.totalDiceNumber
      );
      if (player.diceRollCount != 0) {
        await resetDiceRollCount(game, playerIndex);
      }
      propertyIndex = newPosition;
      data = board[newPosition];
    }
  }

  if (data) {
    if (data.isProperty) {
      const gameProperty = game.properties.find(
        (p) => p.index == propertyIndex
      );
      if (!gameProperty) {
        return throwInternalServerErrorException("Invalid game property!");
      }
      if (gameProperty.owner != playerIndex) {
        const owner = game.players[gameProperty.owner];
        const ownerProperty = owner.properties.find(
          (p) => p.index == gameProperty.index
        )!;
        await payRentalPrice(game, playerIndex, owner, ownerProperty);
        await rotateNextPlayer(game);
        playerTurn = false;
      }
    } else if (data.label == "INCOME TAX") {
      await payIncomeTax(game, playerIndex, data);
      await rotateNextPlayer(game);
      playerTurn = false;
    } else if (data.label == "JAIL") {
      await playerArriveAtJail(game, playerIndex);
      await rotateNextPlayer(game);
      playerTurn = false;
    } else if (data.label == "GO TO JAIL") {
      await moveToJail(game, playerIndex);
      playerTurn = false;
    } else if (data.label == "GO" || data.label == "FREE LODGE") {
      await rotateNextPlayer(game);
      playerTurn = false;
    }
  }

  res.json({
    code: 200,
    message: "Player roll dices successfully.",
    twoSameDice,
    data,
    playerTurn,
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
