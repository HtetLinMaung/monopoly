import WaitList from "../models/wait-list.model";

export const addPlayerToWaitList = async (
  player: string,
  game: string | null = null
) => {
  const isExists = await WaitList.exists({ player });
  if (!isExists) {
    const newWaitingPlayer = new WaitList({
      player,
      game,
    });
    await newWaitingPlayer.save();
  }
};

export const removePlayersFromWaitList = async (
  players: string[],
  gameId: string | null = null
) => {
  await WaitList.findOneAndDelete({
    game: gameId,
    player: {
      $in: players,
    },
  });
};

export const getPlayerIds = async (limit: number) => {
  return (await WaitList.find({ game: null }, { _id: 1 }).limit(limit)).map(
    (wl) => wl._id.toString()
  );
};

// export const isPlayerWaitingToAccept = async (
//   playerId: string,
//   gameId: string
// ) => {
//   const player = await WaitList.findOne({
//     player: playerId,
//     game: gameId,
//   });
//   return !!player;
// };

export const deleteAllWaitLists = async () => {
  return WaitList.deleteMany({});
};
