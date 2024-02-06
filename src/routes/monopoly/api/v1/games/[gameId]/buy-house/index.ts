import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import {
  buyHouseOrHotel,
  canPlayerBuyHotel,
  canPlayerBuyHouse,
  getPlayerProperty,
  rotateNextPlayer,
} from "../../../../../../../utils/monopoly";
import isAuthMiddleware from "../../../../../../../middlewares/is-auth.middleware";
import { IGame } from "../../../../../../../models/game.model";
import getGameByIdMiddleware from "../../../../../../../middlewares/get-game-by-id.middleware";
import {
  throwBadRequestException,
  throwUnauthorizedException,
} from "purrts/lib/common";
import isMyTurnMiddleware from "../../../../../../../middlewares/is-my-turn.middleware";
import {
  isEnergyProperty,
  isTransportationProperty,
  properties,
} from "../../../../../../../data/properties";

export const handler: Handler = async (req, res) => {
  const game: IGame = (req as any).game;
  const playerIndex: number = (req as any).playerIndex;
  const { propertyIndex } = req.body;
  const property = properties[propertyIndex];
  const player = game.players[playerIndex];
  const playerProperty = getPlayerProperty(propertyIndex, player);
  if (!playerProperty) {
    return throwUnauthorizedException("Player not owned this property!");
  }

  const canBuyHotel = canPlayerBuyHotel(playerProperty);
  const canBuyHouse = canPlayerBuyHouse(propertyIndex, player, playerProperty);
  if (
    isTransportationProperty(propertyIndex) ||
    isEnergyProperty(propertyIndex) ||
    (!canBuyHotel && !canBuyHouse)
  ) {
    return throwUnauthorizedException(
      "This property cannot buy house or hotel!"
    );
  }
  const houseOrHotel = canBuyHotel ? "hotel" : "house";
  const buyingPrice = property.buyingPrices.find(
    (p) => p.type == houseOrHotel
  )!.price;
  if (player.balance < buyingPrice) {
    return throwBadRequestException("Insufficient balance!");
  }
  await buyHouseOrHotel(game, houseOrHotel, playerIndex, propertyIndex);
  await rotateNextPlayer(game);
  res.json({
    code: 200,
    message: `Player buy ${houseOrHotel} successfully.`,
  });
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [isAuthMiddleware, getGameByIdMiddleware, isMyTurnMiddleware],
};
