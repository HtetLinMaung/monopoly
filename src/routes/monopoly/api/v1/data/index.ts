import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import { board } from "../../../../../data/board";
import { communityChests } from "../../../../../data/community-chests";
import { chances } from "../../../../../data/chances";
import { properties } from "../../../../../data/properties";

export const handler: Handler = async (req, res) => {
  res.json({
    code: 200,
    message: "Successful.",
    data: {
      board,
      communityChests,
      chances,
      properties,
    },
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
};
