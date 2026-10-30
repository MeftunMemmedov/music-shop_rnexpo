import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { db } from './db';

export const sqliteStorage = {
  getItem: async (key: string) => {
    const result = db.getFirstSync<{ value: string }>(
      'SELECT value FROM query_cache WHERE key = ?',
      [key],
    );
    return result?.value || null;
  },
  setItem: async (key: string, value: string) => {
    db.runSync(
      'INSERT OR REPLACE INTO query_cache (key, value) VALUES (?, ?)',
      [key, value],
    );
  },
  removeItem: async (key: string) => {
    db.runSync('DELETE FROM query_cache WHERE key = ?', [key]);
  },
};

export const storagePersister = createAsyncStoragePersister({
  storage: sqliteStorage,
});
