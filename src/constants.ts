import path from "path";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const PLAYER_START_BALANCE = 1500.0;

export const publicFolderPath = path.join(__dirname, "..", "public");
