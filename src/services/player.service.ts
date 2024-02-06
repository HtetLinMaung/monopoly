import { CreatePlayerDto } from "../dto/create-player.dto";
import Player, { IPlayer } from "../models/player.model";
import { throwBadRequestException } from "purrts/lib/common";
import bcrypt from "bcrypt";
import { HydratedDocument } from "mongoose";

export const getPlayerByUsername = (
  username: string
): Promise<IPlayer | null> => {
  return Player.findOne({ username });
};

export const createNewPlayer = async (createPlayerDto: CreatePlayerDto) => {
  const isExists = await Player.exists({
    username: createPlayerDto.username,
  });
  if (isExists) {
    throwBadRequestException("Player already exists");
  }
  const player = new Player({
    ...createPlayerDto,
    password: await bcrypt.hash(createPlayerDto.password, 10),
  });
  return player.save();
};

export const getPlayerById = (id: string): Promise<IPlayer | null> => {
  return Player.findById(id);
};

export const getPlayersByIdList = async (idList: string[]) => {
  return Player.find({
    _id: {
      $in: idList,
    },
  });
};
