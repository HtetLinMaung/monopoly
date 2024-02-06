export default function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice(); // Create a copy of the array to avoid modifying the original
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
