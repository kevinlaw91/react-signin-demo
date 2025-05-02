export function clearSavedAvatar(event: Event) {
  const db = (event.target as IDBOpenDBRequest).result;
  const transaction = db.transaction('blobs', 'readwrite');
  const store = transaction.objectStore('blobs');
  store.delete('avatar');
}
