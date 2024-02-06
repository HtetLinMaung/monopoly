export default function timeout(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s));
}
