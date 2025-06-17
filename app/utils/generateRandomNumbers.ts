export default function generateRandomNumbers(): { twoDigitNumber: number; oneOrTwoDigitNumber: number } {
  const twoDigitNumber = Math.floor(Math.random() * 90) + 10; // Genera un número aleatorio de dos cifras (10-99)
  const oneOrTwoDigitNumber = Math.floor(Math.random() * 90) + 1; // Genera un número aleatorio de una o dos cifras (1-99)
  return { twoDigitNumber, oneOrTwoDigitNumber };
}

