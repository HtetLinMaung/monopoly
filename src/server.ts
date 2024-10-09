import dotenv from "dotenv";
dotenv.config();

import connectMongoose from "./config/database.config";
import { PurrApplication } from "purrts";
import app from "./app";
import cluster from "cluster";
import { log } from "starless-logger";
import {
  connectKafkaConsumer,
  connectKafkaProducer,
  subscribeTopic,
} from "./config/kafka.config";
import { createGameWithAi, deleteAllGames } from "./services/game.service";
import { deleteAllWaitLists, getPlayerIds } from "./services/wait-list.service";
import { startGame } from "./utils/monopoly";
import auctionTimerComplete from "./topics/auction-timer-complete";
import {
  deleteAllPlayers,
  getPlayersByIdList,
} from "./services/player.service";
import path from "path";
import playerTimerComplete from "./topics/player-timer-complete";
import { deleteAllAuctions } from "./services/auction.service";

async function main() {
  if (cluster.isPrimary) {
    await connectMongoose();

    // await deleteAllAuctions();
    // await deleteAllGames();
    // await deleteAllPlayers();
    // await deleteAllWaitLists();

    await connectKafkaProducer();
    await connectKafkaConsumer();
    await subscribeTopic("auction-timer-complete", auctionTimerComplete());
    await subscribeTopic("player-timer-complete", playerTimerComplete());
    setInterval(() => {
      (async () => {
        try {
          const playerIds = await getPlayerIds(4);
          if (playerIds.length > 0) {
            log("Trying to match players and create and start a game");
            const players = await getPlayersByIdList(playerIds);
            const game = await createGameWithAi(players, 4);
            await startGame(game);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }, 2 * 60 * 1000);
  }

  await connectMongoose();
  await connectKafkaProducer();

  PurrApplication.run(app, {
    routesFolderPath: path.join(__dirname, "routes"),
    port: parseInt(process.env.PORT || "3000"),
  });
}

main();
