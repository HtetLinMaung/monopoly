export default function genrateRandomNumber(
  start: number,
  end: number,
  exclude: number[] = []
): number {
  const min = Math.ceil(start);
  const max = Math.floor(end);
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  if (exclude.length && exclude.includes(num)) {
    return genrateRandomNumber(start, end, exclude);
  }
  return num;
}
