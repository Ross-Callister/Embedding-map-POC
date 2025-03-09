import { BigNumber, divide, dot, multiply, norm } from "mathjs";

export function cosineSimilarity(
  vecA: number[],
  vecB: number[]
): number | BigNumber {
  const dotProduct = dot(vecA, vecB);
  const magnitudeA = norm(vecA);
  const magnitudeB = norm(vecB);
  return divide(
    dotProduct,
    multiply(magnitudeA, magnitudeB) as BigNumber | number
  ) as number | BigNumber;
}

export function euclidDistance(vecA: number[], vecB: number[]): number {
  return Math.sqrt(
    vecA.reduce((sum, a, idx) => sum + Math.pow(a - vecB[idx], 2), 0)
  );
}
