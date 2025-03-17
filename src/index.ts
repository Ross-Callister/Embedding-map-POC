import { EmbeddingHelper } from "./embeddingHelper";
import { cosineSimilarity, euclidDistance } from "./maths";
import {
  getMapFromStrings,
  getMapToStrings,
  getTrueMapping,
} from "./testData/data2";

interface Mapping {
  column: string;
  input: string;
  similarity: number;
}

/**
 * Creates a mapping where each column is independently mapped to its most similar input.
 * This may result in multiple columns mapping to the same input.
 */
function createIndependentMapping(
  columns: string[],
  inputs: string[],
  similarities: any[][]
): Mapping[] {
  return columns.map((column, idx) => {
    // Find the index of the max value by comparing each value
    let maxIndex = 0;
    let maxValue = Number(similarities[idx][0]);
    for (let i = 1; i < similarities[idx].length; i++) {
      const value = Number(similarities[idx][i]);
      if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
    }
    const input = inputs[maxIndex];
    return {
      column,
      input,
      similarity: maxValue,
    };
  });
}

/**
 * Creates a one-to-one mapping between columns and inputs using a greedy approach.
 * Selects the highest similarity match, then removes both column and input from consideration.
 */
function createOneToOneMapping(
  columns: string[],
  inputs: string[],
  similarities: any[][]
): Mapping[] {
  // Create copies of arrays to work with
  const remainingColumns = [...columns];
  const remainingInputs = [...inputs];
  const remainingSimilarities = similarities.map((row) => [...row]);
  const result: Mapping[] = [];

  while (remainingColumns.length > 0 && remainingInputs.length > 0) {
    // Find the highest similarity across all remaining pairs
    let maxSimilarity = -Infinity;
    let maxColIdx = -1;
    let maxInputIdx = -1;

    for (let colIdx = 0; colIdx < remainingSimilarities.length; colIdx++) {
      for (
        let inputIdx = 0;
        inputIdx < remainingSimilarities[colIdx].length;
        inputIdx++
      ) {
        const value = Number(remainingSimilarities[colIdx][inputIdx]);
        if (value > maxSimilarity) {
          maxSimilarity = value;
          maxColIdx = colIdx;
          maxInputIdx = inputIdx;
        }
      }
    }

    // Add the best match to the result
    result.push({
      column: remainingColumns[maxColIdx],
      input: remainingInputs[maxInputIdx],
      similarity: maxSimilarity,
    });

    // Remove the matched column and input
    remainingColumns.splice(maxColIdx, 1);
    remainingInputs.splice(maxInputIdx, 1);
    remainingSimilarities.splice(maxColIdx, 1);
    for (let i = 0; i < remainingSimilarities.length; i++) {
      remainingSimilarities[i].splice(maxInputIdx, 1);
    }
  }

  // Sort the result to match the original column order
  return result.sort(
    (a, b) => columns.indexOf(a.column) - columns.indexOf(b.column)
  );
}

/**
 * Evaluates and displays the accuracy of a mapping
 */
function evaluateMapping(mapping: Mapping[], title: string): number {
  console.log(`\n${title}:`);
  let correct = 0;
  mapping.forEach((map) => {
    const isTrue = getTrueMapping(map.column) === map.input;
    // console.log(
    //   `The best match for ${map.column} is ${
    //     map.input
    //   } with a similarity of ${map.similarity.toFixed(4)}. ${
    //     isTrue ? "✔️" : "❌"
    //   }`
    // );
    if (isTrue) correct++;
  });
  const accuracy = (correct / mapping.length) * 100;
  console.log(
    `Accuracy: ${correct}/${mapping.length} (${accuracy.toFixed(2)}%)`
  );
  return correct;
}

async function main() {
  const time = Date.now();
  const embeddingHelper = new EmbeddingHelper("vectors.db");

  //we are mapping "columns" to "inputs" using the testData
  const columns = getMapFromStrings();
  const inputs = getMapToStrings();

  const columnEmbeddings = await Promise.all(
    columns.map((column) =>
      embeddingHelper.getEmbeddingFromString(
        `spreadsheet column name: ${column}`
      )
    )
  );

  const inputEmbeddings = await Promise.all(
    inputs.map((input) =>
      embeddingHelper.getEmbeddingFromString(
        `spreadsheet column name: ${input}`
      )
    )
  );

  //2d matrix. The first dimension is the columns, the second dimension is the inputs
  //so [3][4] would be the similarity between the 4th input and the 5th column, because of zero-based indexing
  const similarities = columnEmbeddings.map((columnEmbedding) =>
    inputEmbeddings.map((inputEmbedding) =>
      cosineSimilarity(columnEmbedding, inputEmbedding)
    )
  );

  // Method 1: Independent mapping (original approach)
  const independentMapping = createIndependentMapping(
    columns,
    inputs,
    similarities
  );
  evaluateMapping(independentMapping, "Independent Mapping (Original Method)");

  // Method 2: One-to-one mapping (new approach)
  const oneToOneMapping = createOneToOneMapping(columns, inputs, similarities);
  evaluateMapping(oneToOneMapping, "One-to-One Mapping (New Method)");
  console.log(`Time taken: ${Date.now() - time}ms`);
}

main();
