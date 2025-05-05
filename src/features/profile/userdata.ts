import { INDEXEDDB_DBNAME, INDEXEDDB_VERSION } from '@/services/indexeddb.ts';
import { clearSavedAvatar } from '@/features/profile/avatar.ts';

// Clear saved local user data
export function clearUserData() {
  // Remove saved browser session
  localStorage.removeItem('demo:username');

  // Clear saved avatar
  if (indexedDB) {
    const dbHandle = indexedDB.open(INDEXEDDB_DBNAME, INDEXEDDB_VERSION);
    dbHandle.onsuccess = clearSavedAvatar;
  }
}
