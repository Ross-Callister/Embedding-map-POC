import BetterSqlite3, { Database } from "better-sqlite3";

export class DatabaseHelper {
  private db: Database;

  constructor(filename: string) {
    this.db = new BetterSqlite3(filename);
    // Create table if it doesn't exist
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS vectors (
          id TEXT PRIMARY KEY,
          vector TEXT
        )
      `);
  }

  insertVector(id: string, vector: number[]) {
    const stmt = this.db.prepare(
      "INSERT INTO vectors (id, vector) VALUES (?, ?)"
    );
    stmt.run(id, JSON.stringify(vector));
  }

  getVector(id: string): number[] | null {
    const stmt = this.db.prepare<string, Vector>(
      "SELECT vector FROM vectors WHERE id = ?"
    );
    const row = stmt.get(id);
    return row ? JSON.parse(row.vector) : null;
  }
}

type Vector = {
  id: string;
  vector: string;
};
