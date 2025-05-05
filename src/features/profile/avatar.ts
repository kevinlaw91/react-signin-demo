export function loadSavedAvatar(event: Event) {
  return new Promise<Blob | null>((resolve, reject) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction('blobs', 'readonly');
    const store = transaction.objectStore('blobs');
    const req = store.get('avatar');
    req.onsuccess = (_event) => {
      const blob = req.result as Blob;
      // If avatar was saved previously, load it to preview
      if (blob) {
        resolve(blob);
      } else {
        resolve(null);
      }
    };
    req.onerror = _event => reject(new Error('Database query failed'));
  });
}

export function clearSavedAvatar(event: Event) {
  const db = (event.target as IDBOpenDBRequest).result;
  const transaction = db.transaction('blobs', 'readwrite');
  const store = transaction.objectStore('blobs');
  store.delete('avatar');
}
