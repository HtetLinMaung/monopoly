import { Request, Response } from "express";
import { CreatePlayerDto } from "../../../../../../dto/create-player.dto";
import { createNewPlayer } from "../../../../../../services/player.service";

export const handler = async (req: Request, res: Response) => {
  const body: CreatePlayerDto = req.body;
  await createNewPlayer(body);
  res.json({
    code: 200,
    message: "Player registered successfully.",
  });
};

export const metadata = {
  method: "post",
};
