import { EmbeddingHelper } from "./embeddingHelper";
import { cosineSimilarity, euclidDistance } from "./maths";
import {
  getMapFromStrings,
  getMapToStrings,
  getTrueMapping,
} from "./testData/data";

async function main() {
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

  const mapping = columns.map((column, idx) => {
    const input =
      inputs[similarities[idx].indexOf(Math.max(...similarities[idx]))];
    return {
      column,
      input,
      similarity:
        similarities[idx][
          similarities[idx].indexOf(Math.max(...similarities[idx]))
        ],
    };
  });

  let correct = 0;
  mapping.forEach((map) => {
    const isTrue = getTrueMapping(map.column) === map.input;
    console.log(
      `The best match for ${map.column} is ${map.input} with a similarity of ${
        map.similarity
      }. ${isTrue ? "✔️" : "❌"}`
    );
    if (isTrue) correct++;
  });
  console.log(`Accuracy: ${correct}/${mapping.length}`);
}

main();
