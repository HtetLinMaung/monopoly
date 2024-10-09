import { chances } from "../data/chances";
import { communityChests } from "../data/community-chests";
import Game, {
  IGame,
  IPlayerCard,
  IPlayerProperty,
  IPlayerState,
} from "../models/game.model";
import shuffleArray from "../utils/shuffle-array";
import { removePlayersFromWaitList } from "./wait-list.service";
import { properties } from "../data/properties";
import emitEvent from "../utils/emit-event";
import { PLAYER_START_BALANCE } from "../constants";
import { getPlayerById } from "./player.service";
import generateFakeMyanmarName from "../utils/generate-fake-myanmar-name";
import { IPlayer } from "../models/player.model";
import {
  throwBadRequestException,
  throwNotFoundException,
  throwUnauthorizedException,
} from "purrts/lib/common";

async function createGame(
  players: IPlayerState[],
  creator: string | null = null
) {
  const game = new Game({
    communityChests: shuffleArray(communityChests),
    chances: shuffleArray(chances),
    properties: properties.map((_, index) => ({
      index,
      isAvailable: true,
      owner: null,
    })),
    players,
    creator,
  });
  await game.save();
  await emitEvent(
    players.filter((p) => !p.isAi).map((p) => p.player!.toString()),
    "game-created",
    game._id
  );
  return game;
}

export const isPlayerInOtherGame = async (playerId: string) => {
  const game = await Game.exists({
    players: playerId,
    status: {
      $ne: "completed",
    },
  });
  return !!game;
};

export const createMultiplayerGame = async (
  playerId: string
): Promise<IGame | null> => {
  const player = await getPlayerById(playerId);
  if (!player) {
    throwNotFoundException("Player not found!");
    return null;
  }
  const isInOtherGame = await isPlayerInOtherGame(playerId);
  if (isInOtherGame) {
    throwUnauthorizedException("Player cannot be in multiple games!");
    return null;
  }
  return createGame(
    [
      {
        player: playerId,
        name: player.fullname,
        avatar: player.profile_image,
        balance: PLAYER_START_BALANCE,
        position: 0,
        turn: 0,
        status: "waiting",
        isAi: false,
        properties: [] as IPlayerProperty[],
        cards: [] as IPlayerCard[],
        totalDiceNumber: 0,
        diceRollCount: 0,
        inJail: false,
      },
    ],
    playerId
  );
};

export const createGameWithAi = async (players: IPlayer[], maxPlayer = 8) => {
  const filterdPlayers: IPlayer[] = [];
  for (const player of players) {
    const isInOtherGame = await isPlayerInOtherGame(player._id.toString());
    if (!isInOtherGame) {
      filterdPlayers.push(player);
    }
  }
  const gamePlayers: IPlayerState[] = filterdPlayers.map((p) => ({
    player: p._id,
    name: p.fullname,
    avatar: p.profile_image,
    balance: PLAYER_START_BALANCE,
    position: 0,
    turn: 0,
    status: "waiting",
    isAi: false,
    properties: [] as IPlayerProperty[],
    cards: [] as IPlayerCard[],
    totalDiceNumber: 0,
    diceRollCount: 0,
    inJail: false,
  }));
  while (gamePlayers.length < maxPlayer) {
    gamePlayers.push({
      player: null,
      name: generateFakeMyanmarName(),
      avatar: "",
      balance: PLAYER_START_BALANCE,
      position: 0,
      turn: 0,
      status: "waiting",
      isAi: true,
      properties: [] as IPlayerProperty[],
      cards: [] as IPlayerCard[],
      totalDiceNumber: 0,
      diceRollCount: 0,
      inJail: false,
    });
  }
  const game = await createGame(gamePlayers);
  await removePlayersFromWaitList(players.map((p) => p._id.toString()));
  return game;
};

export const getGameById = (id: string) => {
  return Game.findById(id);
};

export const updateGameByFilter = async (filter: any, data: any) => {
  return Game.findOneAndUpdate(filter, { $set: data });
};

export const isMyTurn = (game: IGame, playerIndex: number) => {
  return game.currentTurn == game.players[playerIndex].turn;
};

export const getPlayerIndexFromPlayerId = (game: IGame, playerId: string) => {
  return game.players
    .filter((p) => !p.isAi)
    .findIndex((p) => p.player!.toString() == playerId);
};

export const getTurnOnePlayerIndex = (game: IGame) => {
  return game.players.findIndex((p) => p.turn == 1);
};

export const addPlayerToGame = async (game: IGame, player: IPlayer) => {
  const isPlayerExists = game.players
    .filter((p) => !p.isAi)
    .find((p) => p.player!.toString() == player._id.toString());
  if (isPlayerExists) {
    await removePlayersFromWaitList(
      [player._id.toString()],
      game._id.toString()
    );
    return throwBadRequestException("Already accepted!");
  }
  game.players.push({
    player: player._id,
    name: player.fullname,
    avatar: player.profile_image,
    balance: PLAYER_START_BALANCE,
    position: 0,
    turn: 0,
    status: "waiting",
    isAi: false,
    properties: [] as IPlayerProperty[],
    cards: [] as IPlayerCard[],
    totalDiceNumber: 0,
    diceRollCount: 0,
    inJail: false,
  });
  await updateGameByFilter({ _id: game._id }, { players: game.players });
};

export const deleteAllGames = async () => {
  return Game.deleteMany({});
};
