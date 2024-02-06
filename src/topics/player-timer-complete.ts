import { EachMessageHandler } from "kafkajs";
import {
  getGameById,
  getPlayerIndexFromPlayerId,
} from "../services/game.service";
import { handleAiTurn } from "../utils/monopoly";

export default function playerTimerComplete(): EachMessageHandler {
  return async ({ topic, partition, message }) => {
    const { playerId, gameId } = JSON.parse(message.value!.toString());
    const game = await getGameById(gameId);
    if (game) {
      const playerIndex = getPlayerIndexFromPlayerId(game, playerId);
      if (playerIndex != -1) {
        await handleAiTurn(game, playerIndex);
      }
    }
  };
}
