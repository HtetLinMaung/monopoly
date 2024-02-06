export default function generateFakeMyanmarName(): string {
  const names = [
    "Aung",
    "Min",
    "Thet",
    "Hlaing",
    "Kyaw",
    "Zaw",
    "Maung",
    "Khin",
    "Soe",
    "Win",
    "Thiha",
    "Nyein",
    "Yi",
    "San",
    "Thuzar",
    "Htet",
    "Aye",
    "Thida",
    "Moe",
    "Wai",
  ];

  // Function to generate a random integer between min and max (inclusive)
  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random number of names to concatenate (between 1 and 3)
  const numberOfNames = getRandomInt(1, 3);
  let fakeName = "";

  for (let i = 0; i < numberOfNames; i++) {
    const randomNameIndex = getRandomInt(0, names.length - 1);
    fakeName += names[randomNameIndex];
    if (i < numberOfNames - 1) {
      fakeName += " "; // Add a space between names
    }
  }

  return fakeName;
}

// Example usage
// console.log(generateFakeMyanmarName());
