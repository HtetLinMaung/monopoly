import Auction from "../models/auction.model";

export const createAuction = async (gameId: string, propertyIndex: number) => {
  const auction = new Auction({
    propertyIndex,
    game: gameId,
  });
  await auction.save();
  return auction;
};

export const updateAuctionByFilter = async (filter: any, data: any) => {
  return Auction.findOneAndUpdate(filter, {
    $set: data,
  });
};

export const getAuctionByPropertyIndex = async (
  gameId: string,
  propertyIndex: number
) => {
  return Auction.findOne({
    game: gameId,
    propertyIndex,
  });
};

export const getAuctionById = async (id: string) => {
  return Auction.findById(id);
};

export const deleteAuctionById = async (id: string) => {
  return Auction.findByIdAndDelete(id);
};

export const deleteAllAuctions = async () => {
  return Auction.deleteMany({});
};
