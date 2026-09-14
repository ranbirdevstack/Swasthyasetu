import Dexie from "dexie";

// 1. Initialize Dexie Database
export const db = new Dexie("SwasthyaSetuDB");

// 2. Define schema and indexed fields
// Syntax: 'primaryKey, index1, index2...'
db.version(1).stores({
  syncQueue: "queueId, endpoint, status, timestamp",
  patients: "id, abhaId, village, riskLevel, updatedAt",
  facilities: "id, type, emergency",
});

// 3. Request OS persistent storage so browser doesn't evict offline data under low memory
export const requestStoragePersistence = async () => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.info(`[Dexie] Persistent storage granted: ${isPersisted}`);
    return isPersisted;
  }
  return false;
};

// Auto-request persistence on load
requestStoragePersistence().catch(console.warn);

export default db;