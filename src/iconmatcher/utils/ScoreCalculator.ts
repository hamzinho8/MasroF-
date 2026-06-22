export function calculateWeightedScore(
  exactMatchScore: number,
  aliasScore: number,
  keywordScore: number,
  brandScore: number,
  objectScore: number
): number {
  if (exactMatchScore === 100) return 100;
  return Math.max(
    exactMatchScore * 1.0,
    aliasScore * 0.95,
    objectScore * 0.90,
    brandScore * 0.85,
    keywordScore * 0.80
  );
}
