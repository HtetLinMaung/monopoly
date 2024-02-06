import { Request, Response } from "express";
import { LoginDto } from "../../../../../../dto/login.dto";
import { getPlayerByUsername } from "../../../../../../services/player.service";
import { throwUnauthorizedException } from "purrts/lib/common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../../../constants";

export const handler = async (req: Request, res: Response) => {
  const body: LoginDto = req.body;
  const player = await getPlayerByUsername(body.username);
  if (!player) {
    return throwUnauthorizedException("Invalid username!");
  }
  const validPassword = await bcrypt.compare(body.password, player.password);
  if (!validPassword) {
    return throwUnauthorizedException("Invalid password!");
  }
  const token = jwt.sign({ playerId: player._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    code: 200,
    message: "Login successful.",
    data: {
      token,
      fullname: player.fullname,
      profile_image: player.profile_image,
    },
  });
};

export const metadata = {
  method: "post",
};
