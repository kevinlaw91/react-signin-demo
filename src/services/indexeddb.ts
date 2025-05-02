export const INDEXEDDB_DBNAME = 'db';
export const INDEXEDDB_VERSION = 1;

// Handler for IndexedDB database migration
export function handleDbUpgrade(event: IDBVersionChangeEvent) {
  const db = (event.target as IDBOpenDBRequest).result;
  db.createObjectStore('blobs');
}
