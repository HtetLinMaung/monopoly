import { EachMessageHandler } from "kafkajs";
import { deleteAuctionById, getAuctionById } from "../services/auction.service";
import { getGameById } from "../services/game.service";
import { buyProperty, rotateNextPlayer } from "../utils/monopoly";

export default function auctionTimerComplete(): EachMessageHandler {
  return async ({ topic, partition, message }) => {
    const { auctionId } = JSON.parse(message.value!.toString());
    const auction = await getAuctionById(auctionId);
    await deleteAuctionById(auctionId);
    if (auction) {
      const game = await getGameById(auction.game.toString());
      if (game) {
        await buyProperty(
          game,
          auction.maxBiddedPlayerIndex,
          auction.propertyIndex,
          auction.currentBid
        );

        await rotateNextPlayer(game);
      }
    }
  };
}
