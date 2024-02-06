import { sendTopic } from "../config/kafka.config";
import { IBoardItem, board, jailIndex } from "../data/board";
import { chances } from "../data/chances";
import { CREDIT, communityChests } from "../data/community-chests";
import {
  countColor,
  isEnergyProperty,
  isTransportationProperty,
  properties,
} from "../data/properties";
import { IAuction } from "../models/auction.model";
import { IGame, IPlayerProperty, IPlayerState } from "../models/game.model";
import {
  createAuction,
  getAuctionById,
  updateAuctionByFilter,
} from "../services/auction.service";
import {
  getGameById,
  getTurnOnePlayerIndex,
  updateGameByFilter,
} from "../services/game.service";
import emitEvent from "./emit-event";
import rollTwoDices from "./roll-two-dices";
import timeout from "./timeout";

export const playerRollDice = async (gameId: string, playerIndex: number) => {
  const numbers = rollTwoDices();
  const total = numbers[0] + numbers[1];
  await emitEvent([gameId], "player-roll-dice", {
    playerIndex,
    numbers,
    total,
  });
  return { total, numbers };
};

export const startGame = async (game: IGame) => {
  await updateGameByFilter(
    { _id: game._id },
    { status: "started", "players.$[].status": "playing" }
  );
  await emitEvent([game._id.toString()], "game-started", {});
  const turnOnePlayerIndex = await determinePlayersTurn(game);
  const turnOnePlayer = game.players[turnOnePlayerIndex];
  if (!turnOnePlayer.isAi) {
    await emitEvent([turnOnePlayer.player!.toString()], "player-turn", {
      gameId: game._id,
    });
  } else {
    await handleAiTurn(game, turnOnePlayerIndex);
  }
};

export const determinePlayersTurn = async (game: IGame) => {
  const playerDiceNumbers: { playerIndex: number; total: number }[] = [];
  for (const [index] of game.players.entries()) {
    const numbers = rollTwoDices();
    playerDiceNumbers.push({
      playerIndex: index,
      total: numbers[0] + numbers[1],
    });
    await emitEvent([game._id.toString()], "player-roll-dice", {
      playerIndex: index,
      numbers,
    });
  }
  playerDiceNumbers.sort((a, b) => {
    return b.total - a.total;
  });

  let turnOnePlayerIndex = 0;
  const playersGetTurnPayload: any = {};
  for (const [i, pdn] of playerDiceNumbers.entries()) {
    if (i + 1 == 1) {
      turnOnePlayerIndex = pdn.playerIndex;
    }
    game.players[pdn.playerIndex].turn = i + 1;
    playersGetTurnPayload[pdn.playerIndex] = game.players[pdn.playerIndex].turn;
  }
  await updateGameByFilter(
    { _id: game._id },
    {
      players: game.players,
    }
  );
  await emitEvent(
    [game._id.toString()],
    "players-get-turn",
    playersGetTurnPayload
  );
  return turnOnePlayerIndex;
};

export const getGameByIdAndHandleAiTurn = async (
  gameId: string,
  currentPlayerIndex: number
) => {
  const game = await getGameById(gameId);
  if (game) {
    await handleAiTurn(game, currentPlayerIndex);
  }
};

export const playerMoveAfterRollingDice = async (
  game: IGame,
  currentPlayerIndex: number,
  total: number
) => {
  const currentPlayer = game.players[currentPlayerIndex];
  const currentPosition = currentPlayer.position;

  const newPosition = (currentPlayer.position + total) % board.length;

  game.players[currentPlayerIndex].position = newPosition;
  if (currentPosition + total >= board.length) {
    game.players[currentPlayerIndex].balance += 200.0;
  }

  await updateGameByFilter(
    {
      _id: game._id,
    },
    { players: game.players }
  );
  await emitEvent([game._id.toString()], "player-change-position", {
    playerIndex: currentPlayerIndex,
    from: currentPosition,
    to: newPosition,
  });
  if (currentPosition + total > board.length) {
    await emitEvent([game._id.toString()], "player-get-go-pass-bonus", {
      playerIndex: currentPlayerIndex,
      balance: currentPlayer.balance,
      amount: 200.0,
    });
  }
  return newPosition;
};

export const getPlayerOwnEnergyCount = (player: IPlayerState) => {
  return player.properties.filter((p) => isEnergyProperty(p.index)).length;
};

export const getPlayerOwnTransportationCount = (player: IPlayerState) => {
  return player.properties.filter((p) => isTransportationProperty(p.index))
    .length;
};

export const handleAiTurn = async (game: IGame, currentPlayerIndex: number) => {
  await timeout(1000);
  const currentPlayer = game.players[currentPlayerIndex];
  const { total, numbers } = await playerRollDice(
    game._id.toString(),
    currentPlayerIndex
  );
  let twoSameDice = numbers[0] == numbers[1];
  let boardItem: IBoardItem | null = null;
  if (currentPlayer.inJail) {
    if (twoSameDice) {
      await resetDiceRollCount(game, currentPlayerIndex);
      const newPosition = await playerMoveAfterRollingDice(
        game,
        currentPlayerIndex,
        total
      );
      boardItem = board[newPosition];
    } else {
      return await rotateNextPlayer(game);
    }
  } else {
    if (twoSameDice) {
      await incrementPlayerDiceRollCount(game, currentPlayerIndex, total);
      if (currentPlayer.diceRollCount < 3) {
        await handleAiTurn(game, currentPlayerIndex);
        return;
      }
      if (currentPlayer.inJail) {
        return await rotateNextPlayer(game);
      }
    } else {
      const newPosition = await playerMoveAfterRollingDice(
        game,
        currentPlayerIndex,
        total + currentPlayer.totalDiceNumber
      );
      if (currentPlayer.diceRollCount != 0) {
        await resetDiceRollCount(game, currentPlayerIndex);
      }
      boardItem = board[newPosition];
    }
  }

  if (!boardItem) {
    throw new Error("Board item not found!");
  }

  if (boardItem.isProperty) {
    const gameProperty = game.properties.find(
      (p) => p.index == boardItem!.propertyIndex!
    );
    if (!gameProperty) {
      throw new Error("Invalid game property!");
    }
    if (gameProperty.isAvailable) {
      if (currentPlayer.balance >= boardItem.property?.price!) {
        await buyProperty(game, currentPlayerIndex, boardItem.propertyIndex!);
      } else {
        const auction = await createAuction(
          game._id.toString(),
          boardItem.propertyIndex!
        );
        await emitEvent([game._id.toString()], "auction-start", {
          propertyIndex: boardItem.propertyIndex,
        });
        const turnOnePlayerIndex = getTurnOnePlayerIndex(game);
        const turnOnePlayer = game.players[turnOnePlayerIndex];
        if (turnOnePlayer.isAi) {
          await handleAiAuctionTurn(game, auction, turnOnePlayerIndex);
        } else {
          await emitEvent(
            [turnOnePlayer.player!.toString()],
            "auction-turn",
            {}
          );
        }
      }
    } else {
      const owner = game.players[gameProperty.owner];
      const ownerProperty = owner.properties.find(
        (p) => p.index == gameProperty.index
      )!;

      if (gameProperty.owner != currentPlayerIndex) {
        await payRentalPrice(game, currentPlayerIndex, owner, ownerProperty);
      } else {
        if (
          !isTransportationProperty(ownerProperty.index) &&
          !isEnergyProperty(ownerProperty.index)
        ) {
          if (canPlayerBuyHotel(ownerProperty)) {
            await buyHouseOrHotel(
              game,
              "hotel",
              currentPlayerIndex,
              gameProperty.index
            );
          } else if (
            canPlayerBuyHouse(gameProperty.index, owner, ownerProperty)
          ) {
            await buyHouseOrHotel(
              game,
              "house",
              currentPlayerIndex,
              gameProperty.index
            );
          }
        }
      }
    }
  } else if (boardItem.label == "COMMUNITY CHEST") {
    await drawCommunityChest(game, currentPlayerIndex);
  } else if (boardItem.label == "CHANCE") {
    await drawChance(game, currentPlayerIndex);
  } else if (boardItem.label == "INCOME TAX") {
    await payIncomeTax(game, currentPlayerIndex, boardItem);
  } else if (boardItem.label == "JAIL") {
    await playerArriveAtJail(game, currentPlayerIndex);
  } else if (boardItem.label == "GO TO JAIL") {
    return moveToJail(game, currentPlayerIndex);
  }

  await rotateNextPlayer(game);
};

export const handleAiAuctionTurn = async (
  game: IGame,
  auction: IAuction,
  playerIndex: number
) => {
  const player = game.players[playerIndex];
  const auctionProperty = properties[auction.propertyIndex];
  const playerOwnSameColorProperties = player.properties.filter(
    (p) => properties[p.index].color == auctionProperty.color
  ).length;
  const availableProperties = game.properties.filter(
    (p) => properties[p.index].color == auctionProperty.color && p.isAvailable
  ).length;
  const count = countColor(auctionProperty.color);

  let bidAmount = 0;
  if (playerOwnSameColorProperties + availableProperties == count) {
    bidAmount = Math.ceil(auction.currentBid / 100) * 100;
    if (auction.currentBid % 100 == 0) {
      bidAmount = (Math.ceil(auction.currentBid / 100) + 1) * 100;
    }
  } else {
    bidAmount = auction.currentBid + 10;
  }
  if (bidAmount != 0 && bidAmount <= player.balance) {
    await bidAuction(auction, bidAmount, playerIndex);
  }
  await rotateNextAuction(game, auction._id.toString());
};

export const bidAuction = async (
  auction: IAuction,
  bidAmount: number,
  playerIndex: number
) => {
  if (auction.maxBiddedPlayerIndex == null) {
    await sendTopic("auction-timer", {
      auctionId: auction._id,
      gameId: auction.game.toString(),
    });
  }
  auction.maxBiddedPlayerIndex = playerIndex;
  auction.currentBid = bidAmount;
  await updateAuctionByFilter(
    { _id: auction._id },
    {
      maxBiddedPlayerIndex: playerIndex,
      currentBid: bidAmount,
    }
  );
};

export const buyProperty = async (
  game: IGame,
  currentPlayerIndex: number,
  propertyIndex: number,
  price = 0.0
) => {
  const gameProperty = game.properties.find((p) => p.index == propertyIndex)!;
  gameProperty.isAvailable = false;
  gameProperty.owner = currentPlayerIndex;
  const player = game.players[currentPlayerIndex];
  player.properties.push({
    index: propertyIndex,
    houseCount: 0,
    hotelCount: 0,
  });
  sortPlayerPropertiesByMostProfit(player.properties);
  if (price == 0) {
    player.balance -= properties[propertyIndex].price;
  } else {
    player.balance -= price;
  }

  await updateGameByFilter(
    { _id: game._id },
    {
      properties: game.properties,
      players: game.players,
    }
  );
  await emitEvent([game._id.toString()], "player-buy-property", {
    playerIndex: currentPlayerIndex,
    propertyIndex,
    balance: player.balance,
    price: price == 0 ? properties[propertyIndex].price : price,
  });
};

export const buyHouseOrHotel = async (
  game: IGame,
  houseOrhotel: string,
  playerIndex: number,
  propertyIndex: number
) => {
  const player = game.players[playerIndex];
  const property = properties[propertyIndex];
  const buyingPrice = property.buyingPrices.find(
    (p) => p.type == houseOrhotel
  )!.price;
  if (player.balance >= buyingPrice) {
    player.balance -= buyingPrice;
    const playerOwnProperty = player.properties.find(
      (p) => p.index == propertyIndex
    );
    if (houseOrhotel == "house") {
      playerOwnProperty!.houseCount++;
    } else {
      playerOwnProperty!.hotelCount++;
    }
    sortPlayerPropertiesByMostProfit(player.properties);
    await updateGameByFilter({ _id: game._id }, { players: game.players });
    await emitEvent([game._id.toString()], `player-buy-${houseOrhotel}`, {
      playerIndex,
      balance: player.balance,
      buyingPrice,
    });
  }
};

export const rotateNextPlayer = async (game: IGame): Promise<void> => {
  let nextPlayerTurn = game.currentTurn + 1;
  if (nextPlayerTurn > game.players.length) {
    nextPlayerTurn = 1;
  }
  game.currentTurn = nextPlayerTurn;
  await updateGameByFilter(
    {
      _id: game._id,
    },
    {
      currentTurn: nextPlayerTurn,
    }
  );

  const nextPlayerIndex = game.players.findIndex(
    (p) => p.turn == nextPlayerTurn
  );
  const nextPlayer = game.players[nextPlayerIndex];

  if (nextPlayer.status != "playing") {
    return rotateNextPlayer(game);
  }
  if (nextPlayerIndex != -1 && game.players[nextPlayerIndex].isAi) {
    await handleAiTurn(game, nextPlayerIndex);
  } else {
    await emitEvent(
      [game.players[nextPlayerIndex].player!.toString()],
      "player-turn",
      {
        gameId: game._id,
      }
    );
  }
};

export const rotateNextAuction = async (
  game: IGame,
  auctionId: string
): Promise<void> => {
  const auction = await getAuctionById(auctionId);
  if (!auction) {
    return;
  }
  let nextAuctionTurn = auction.currentTurn + 1;
  if (nextAuctionTurn > game.players.length) {
    nextAuctionTurn = 1;
  }
  auction.currentTurn = nextAuctionTurn;
  await updateAuctionByFilter(
    {
      _id: auction._id,
    },
    {
      currentTurn: nextAuctionTurn,
    }
  );

  const playerIndex = game.players.findIndex((p) => p.turn == nextAuctionTurn);
  const player = game.players[playerIndex];

  if (player.status != "playing") {
    return rotateNextAuction(game, auctionId);
  }

  if (player.isAi) {
    await handleAiAuctionTurn(game, auction, playerIndex);
  } else {
    await emitEvent(
      [game.players[playerIndex].player!.toString()],
      "auction-turn",
      {}
    );
  }
};

// export const handleBoardLogic = (
//   position: number,
//   game: IGame,
//   playerIndex: number
// ) => {
//   const boardItem = board[position];
//   const player = game.players[playerIndex];
//   if (boardItem.isProperty) {
//   }
// };

export const moveToJail = async (game: IGame, playerIndex: number) => {
  const currentPosition = game.players[playerIndex].position;
  await resetDiceRollCount(game, playerIndex, true);

  game.players[playerIndex].position = jailIndex;
  game.players[playerIndex].inJail = true;
  await updateGameByFilter(
    {
      _id: game._id,
    },
    {
      players: game.players,
    }
  );
  await emitEvent([game._id.toString()], "player-change-position", {
    playerIndex,
    from: currentPosition,
    to: jailIndex,
  });
  await rotateNextPlayer(game);
};

export const resetDiceRollCount = async (
  game: IGame,
  playerIndex: number,
  skipUpdate = false
) => {
  game.players[playerIndex].diceRollCount = 0;
  game.players[playerIndex].totalDiceNumber = 0;
  if (!skipUpdate) {
    await updateGameByFilter(
      {
        _id: game._id,
      },
      {
        players: game.players,
      }
    );
  }
};

export const incrementPlayerDiceRollCount = async (
  game: IGame,
  playerIndex: number,
  total: number
) => {
  game.players[playerIndex].diceRollCount++;
  game.players[playerIndex].totalDiceNumber += total;
  await updateGameByFilter(
    {
      _id: game._id,
    },
    {
      players: game.players,
    }
  );
  if (game.players[playerIndex].diceRollCount == 3) {
    await moveToJail(game, playerIndex);
  }
};

export const payRentalPrice = async (
  game: IGame,
  currentPlayerIndex: number,
  owner: IPlayerState,
  ownerProperty: IPlayerProperty
) => {
  const currentPlayer = game.players[currentPlayerIndex];
  const rentalPrices = properties[ownerProperty.index].rentalPrices;
  let rentalPrice = 0.0;
  if (
    !isTransportationProperty(ownerProperty.index) &&
    !isEnergyProperty(ownerProperty.index)
  ) {
    if (ownerProperty.hotelCount > 0) {
      rentalPrice = rentalPrices.find((rp) => rp.type == "hotel")!.price;
    } else if (ownerProperty.houseCount > 0) {
      rentalPrice = rentalPrices.find(
        (rp) => rp.type == "house" && rp.count == ownerProperty.houseCount
      )!.price;
    } else {
      rentalPrice = rentalPrices.find((rp) => rp.type == "land")!.price;
    }
  } else if (isEnergyProperty(ownerProperty.index)) {
    rentalPrice = rentalPrices.find(
      (bp) => bp.count == getPlayerOwnEnergyCount(owner)
    )!.price;
  } else if (isTransportationProperty(ownerProperty.index)) {
    rentalPrice = rentalPrices.find(
      (bp) => bp.count == getPlayerOwnTransportationCount(owner)
    )!.price;
  }

  currentPlayer.balance -= rentalPrice;
  await updateGameByFilter(
    { _id: game._id },
    {
      players: game.players,
    }
  );
  await emitEvent([game._id.toString()], "player-pay-rental-price", {
    playerIndex: currentPlayerIndex,
    rentalPrice,
    balance: currentPlayer.balance,
  });
};

export const getPlayerProperty = (
  propertyIndex: number,
  player: IPlayerState
) => {
  return player.properties.find((p) => p.index == propertyIndex);
};

export const canPlayerBuyHouse = (
  propertyIndex: number,
  player: IPlayerState,
  playerProperty: IPlayerProperty
) => {
  const color = properties[propertyIndex].color;
  const totalColorCount = countColor(color);
  const ownCount = player.properties.filter(
    (p) => properties[p.index].color == color
  ).length;
  return (
    (playerProperty.houseCount > 0 && playerProperty.houseCount < 4) ||
    (totalColorCount == ownCount &&
      playerProperty.hotelCount == 0 &&
      playerProperty.houseCount == 0)
  );
};

export const canPlayerBuyHotel = (playerProperty: IPlayerProperty) => {
  return playerProperty.houseCount == 4 && playerProperty.hotelCount == 0;
};

export const drawCommunityChest = async (
  game: IGame,
  currentPlayerIndex: number
) => {
  const currentPlayer = game.players[currentPlayerIndex];
  if (game.lastDrawnCommunityChest == -1) {
    game.lastDrawnCommunityChest = 0;
  } else {
    game.lastDrawnCommunityChest =
      (game.lastDrawnCommunityChest + 1) % game.communityChests.length;
  }
  let gameCommunityChest = game.communityChests[game.lastDrawnCommunityChest];
  while (!gameCommunityChest.isAvailable) {
    game.lastDrawnCommunityChest =
      (game.lastDrawnCommunityChest + 1) % game.communityChests.length;
    gameCommunityChest = game.communityChests[game.lastDrawnCommunityChest];
  }
  const communityChest = communityChests[gameCommunityChest.index];

  await emitEvent([game._id.toString()], "player-draw-commnnity-chest", {
    playerIndex: currentPlayerIndex,
    cardIndex: gameCommunityChest.index,
  });
  if (communityChest.moveTo) {
    if (communityChest.moveTo == jailIndex) {
      await moveToJail(game, currentPlayerIndex);
      return [gameCommunityChest.index, true];
    }
    const currentPosition = currentPlayer.position;
    currentPlayer.position = communityChest.moveTo;
    await updateGameByFilter({ _id: game._id }, { players: game.players });
    await emitEvent([game._id.toString()], "player-change-position", {
      playerIndex: currentPlayerIndex,
      from: currentPosition,
      to: communityChest.moveTo,
    });
  } else if (communityChest.keepAble) {
    gameCommunityChest.isAvailable = false;
    currentPlayer.cards.push({
      type: "community",
      index: gameCommunityChest.index,
    });
    await updateGameByFilter(
      {
        _id: game._id,
      },
      {
        communityChests: game.communityChests,
        players: game.players,
      }
    );
    await emitEvent([game._id.toString()], "player-get-card", {
      playerIndex: currentPlayerIndex,
      cardIndex: gameCommunityChest.index,
      type: "community",
    });
  } else {
    if (communityChest.creditOrDebit == CREDIT) {
      currentPlayer.balance += communityChest.amount!;
    } else {
      currentPlayer.balance -= communityChest.amount!;
    }
    await updateGameByFilter({ _id: game._id }, { players: game.players });
    await emitEvent(
      [game._id.toString()],
      `player-${
        communityChest.creditOrDebit == CREDIT ? "get" : "pay"
      }-community-fee`,
      {
        playerIndex: currentPlayerIndex,
        cardIndex: gameCommunityChest.index,
        type: "community",
      }
    );
  }
  return [gameCommunityChest.index, false];
};

export const drawChance = async (game: IGame, currentPlayerIndex: number) => {
  const currentPlayer = game.players[currentPlayerIndex];
  if (game.lastDrawnChance == -1) {
    game.lastDrawnChance = 0;
  } else {
    game.lastDrawnChance = (game.lastDrawnChance + 1) % game.chances.length;
  }
  let gameChance = game.chances[game.lastDrawnChance];
  while (!gameChance.isAvailable) {
    game.lastDrawnChance = (game.lastDrawnChance + 1) % game.chances.length;
    gameChance = game.chances[game.lastDrawnChance];
  }
  const chance = chances[gameChance.index];

  await emitEvent([game._id.toString()], "player-draw-chance", {
    playerIndex: currentPlayerIndex,
    cardIndex: gameChance.index,
  });
  if (chance.moveTo) {
    if (chance.moveTo == jailIndex) {
      await moveToJail(game, currentPlayerIndex);
      return [gameChance.index, true];
    }
    const currentPosition = currentPlayer.position;
    if (chance.moveTo < 0) {
      currentPlayer.position += chance.moveTo;
    } else {
      currentPlayer.position = chance.moveTo;
    }
    if (chance.canCollectGoPassBonus && chance.moveTo < currentPosition) {
      currentPlayer.balance += 200.0;
    }
    await updateGameByFilter({ _id: game._id }, { players: game.players });
    if (chance.canCollectGoPassBonus && chance.moveTo < currentPosition) {
      await emitEvent([game._id.toString()], "player-get-go-pass-bonus", {
        playerIndex: currentPlayerIndex,
        balance: currentPlayer.balance,
        amount: 200.0,
      });
    }
    await emitEvent([game._id.toString()], "player-change-position", {
      playerIndex: currentPlayerIndex,
      from: currentPosition,
      to: chance.moveTo,
    });
  } else if (chance.keepAble) {
    gameChance.isAvailable = false;
    currentPlayer.cards.push({
      type: "chance",
      index: gameChance.index,
    });
    await updateGameByFilter(
      {
        _id: game._id,
      },
      {
        chances: game.chances,
        players: game.players,
      }
    );
    await emitEvent([game._id.toString()], "player-get-card", {
      playerIndex: currentPlayerIndex,
      cardIndex: gameChance.index,
      type: "chance",
    });
  } else {
    if (chance.creditOrDebit == CREDIT) {
      currentPlayer.balance += chance.amount!;
    } else {
      currentPlayer.balance -= chance.amount!;
    }
    await updateGameByFilter({ _id: game._id }, { players: game.players });
    await emitEvent(
      [game._id.toString()],
      `player-${chance.creditOrDebit == CREDIT ? "get" : "pay"}-chance-fee`,
      {
        playerIndex: currentPlayerIndex,
        cardIndex: gameChance.index,
        type: "chance",
      }
    );
  }
  return [gameChance.index, false];
};

export const payIncomeTax = async (
  game: IGame,
  currentPlayerIndex: number,
  boardItem: IBoardItem
) => {
  const currentPlayer = game.players[currentPlayerIndex];
  currentPlayer.balance -= boardItem.tax!;
  await updateGameByFilter(
    {
      _id: game._id,
    },
    {
      players: game.players,
    }
  );
  await emitEvent([game._id.toString()], "player-pay-tax", {
    playerIndex: currentPlayerIndex,
    tax: boardItem.tax!,
    balance: currentPlayer.balance,
  });
};

export const playerArriveAtJail = async (
  game: IGame,
  currentPlayerIndex: number
) => {
  const currentPlayer = game.players[currentPlayerIndex];
  currentPlayer.inJail = true;
  await updateGameByFilter(
    {
      _id: game._id,
    },
    {
      players: game.players,
    }
  );
  await emitEvent([game._id.toString()], "player-arrive-at-jail", {
    playerIndex: currentPlayerIndex,
  });
};

export const handleAiInsufficientBalance = async (
  game: IGame,
  playerIndex: number
) => {
  let finishPlayerTurn = false;
  const player = game.players[playerIndex];
  if (player.balance < 0) {
    if (player.properties.length > 0) {
      while (player.properties.length > 0 && player.balance < 0) {
        const playerProperty = player.properties[0];
        if (playerProperty.hotelCount == 0 && playerProperty.houseCount == 0) {
          await sellProperty(game, playerIndex, playerProperty);
        } else {
          await sellHouseOrHotel(game, playerIndex, playerProperty);
        }
      }
      if (player.balance < 0) {
        await bankrupt(game, playerIndex);
      }
    } else {
      await bankrupt(game, playerIndex);
    }
  }
  return finishPlayerTurn;
};

export const bankrupt = async (game: IGame, playerIndex: number) => {
  const player = game.players[playerIndex];
  player.status = "bankrupt";
  const ownPropertyIndexes = player.properties.map((p) => p.index);
  const ownCommunityCardIndexes = player.cards
    .filter((c) => c.type == "community")
    .map((c) => c.index);
  const ownChanceCardIndexes = player.cards
    .filter((c) => c.type == "chance")
    .map((c) => c.index);
  game.properties = game.properties.map((p) => {
    if (ownPropertyIndexes.includes(p.index)) {
      p.isAvailable = true;
    }
    return p;
  });
  await updateGameByFilter(
    { _id: game._id.toString() },
    { status: player.status }
  );
  await emitEvent([game._id.toString()], "player-bankrupt", {
    playerIndex,
  });
};

export const sortPlayerPropertiesByMostProfit = (
  playerProperties: IPlayerProperty[]
) => {
  playerProperties.sort((a, b) => {
    const propertyA = properties[a.index];
    let aPrice = propertyA.price;
    const aRentalPrice = propertyA.rentalPrices.find(
      (rp) =>
        (rp.type == "hotel" && a.hotelCount == rp.count) ||
        (rp.type == "house" && a.houseCount == rp.count)
    );
    if (aRentalPrice) {
      aPrice = aRentalPrice.price;
    }

    const propertyB = properties[b.index];
    let bPrice = propertyB.price;
    const bRentalPrice = propertyB.rentalPrices.find(
      (rp) =>
        (rp.type == "hotel" && b.hotelCount == rp.count) ||
        (rp.type == "house" && b.houseCount == rp.count)
    );
    if (bRentalPrice) {
      bPrice = bRentalPrice.price;
    }
    return bPrice - aPrice;
  });
};

export const sellProperty = async (
  game: IGame,
  playerIndex: number,
  playerProperty: IPlayerProperty
) => {
  const player = game.players[playerIndex];

  if (playerProperty) {
    const sellingPrice = properties[playerProperty.index].price / 2;
    player.balance += sellingPrice;
    player.properties = player.properties.filter(
      (p) => p.index != playerProperty.index
    );
    const gameProperty = game.properties.find(
      (p) => p.index == playerProperty.index
    );
    gameProperty!.isAvailable = true;
    await updateGameByFilter(
      { _id: game._id },
      {
        properties: game.properties,
        players: game.players,
      }
    );
    await emitEvent([game._id.toString()], "player-sell-property", {
      playerIndex,
      propertyIndex: playerProperty.index,
      sellingPrice,
    });
  }
};

export const sellHouseOrHotel = async (
  game: IGame,
  playerIndex: number,
  playerProperty: IPlayerProperty
) => {
  if (playerProperty.houseCount > 0) {
    const player = game.players[playerIndex];
    let houseOrHotel = "house";
    let sellingPrice = 0.0;
    if (playerProperty.hotelCount > 0) {
      houseOrHotel = "hotel";
      playerProperty.hotelCount = 0;
    } else {
      playerProperty.houseCount--;
    }
    sellingPrice =
      properties[playerProperty.index].buyingPrices.find(
        (bp) => bp.type == houseOrHotel
      )!.price / 2;
    player.balance += sellingPrice;
    sortPlayerPropertiesByMostProfit(player.properties);
    await updateGameByFilter(
      { _id: game._id },
      {
        players: game.players,
      }
    );
    await emitEvent([game._id.toString()], `player-sell-${houseOrHotel}`, {
      playerIndex,
      propertyIndex: playerProperty.index,
      sellingPrice,
    });
  }
};
