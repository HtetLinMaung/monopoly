import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import isAuthMiddleware from "../../../../../middlewares/is-auth.middleware";
import { addPlayerToWaitList } from "../../../../../services/wait-list.service";

export const handler: Handler = async (req, res) => {
  const playerId: string = (req as any).playerId;
  await addPlayerToWaitList(playerId);
  res.json({
    code: 200,
    message: "Successfully join to wait list.",
  });
};

export const metadata: IRouteMetadata = {
  method: "get",
  middlewares: [isAuthMiddleware],
};
