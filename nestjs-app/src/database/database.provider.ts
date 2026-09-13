import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Provider } from '@nestjs/common';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

// SQLite via Node's built-in driver — no ORM, no native npm dependency,
// just a file and plain SQL. Good enough to see a "real" persistence layer
// without adding a database server to the demo. Modeled as a Nest custom
// provider so it can be injected wherever it's needed, same as any other
// dependency.
export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: (): DatabaseSync => {
    const dataDir = path.join(process.cwd(), 'data');
    mkdirSync(dataDir, { recursive: true });
    const db = new DatabaseSync(path.join(dataDir, 'app.db'));

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id         TEXT PRIMARY KEY,
        title      TEXT NOT NULL,
        done       INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);

    return db;
  },
};
