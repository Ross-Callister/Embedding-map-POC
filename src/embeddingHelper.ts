import { DatabaseHelper } from "./database";
import { getEmbeddingFromString } from "./embedding";

export class EmbeddingHelper {
  private databaseHelper: DatabaseHelper;

  constructor(database: string) {
    this.databaseHelper = new DatabaseHelper(database);
  }

  async getEmbeddingFromString(str: string): Promise<number[]> {
    const existingEmbedding = this.databaseHelper.getVector(str);
    if (existingEmbedding !== null) {
      // console.log("cache hit");
      return existingEmbedding;
    }

    const newEmbedding = await getEmbeddingFromString(str);
    this.databaseHelper.insertVector(str, newEmbedding);
    return newEmbedding;
  }
}
