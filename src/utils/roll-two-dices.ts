import genrateRandomNumber from "./generata-random-number";

export default function rollTwoDices(): [number, number] {
  return [genrateRandomNumber(1, 6), genrateRandomNumber(1, 6)];
}
