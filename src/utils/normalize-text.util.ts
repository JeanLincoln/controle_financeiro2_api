/**
 * Normalizes text by removing accents and converting to lowercase
 * This allows accent-insensitive searches
 * Example: "chá" becomes "cha", "São Paulo" becomes "sao paulo"
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase()
    .trim();
}
