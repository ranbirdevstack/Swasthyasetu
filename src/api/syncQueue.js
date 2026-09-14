/**
 * SWASTHYASETU - ENTERPRISE OFFLINE SYNC ENGINE (DEXIE EDITION)
 * 
 * Features:
 * - Backed by Dexie.js (IndexedDB) for high-capacity offline queueing
 * - Mitigates Thundering Herd via Exponential Backoff + Random Jitter
 * - Prevents Stale Overwrites via client-version delta metadata
 * - Dispatches 'swasthya_queue_updated' window events for reactive UI badges
 */

import apiClient from "./axiosClient.js";
import { db } from "./indexedDB.js";

let isSyncing = false;

/**
 * Calculates exponential backoff with random jitter:
 * Delay = 2^(min(attempt, 5)) * 1000ms + random(0, 1500ms)
 */
const getBackoffWithJitter = (attempt) => {
  const exponential = Math.pow(2, Math.min(attempt, 5)) * 1000;
  const jitter = Math.random() * 1500;
  return exponential + jitter;
};

/**
 * Reads all pending items from Dexie syncQueue
 */
export const getOfflineQueue = async () => {
  try {
    return await db.syncQueue
      .where("status")
      .equals("pending")
      .sortBy("timestamp");
  } catch (err) {
    console.error("[SyncQueue] Error fetching pending items:", err);
    return [];
  }
};

/**
 * Returns count of currently pending queue items
 */
export const getOfflineQueueCount = async () => {
  try {
    return await db.syncQueue.where("status").equals("pending").count();
  } catch (err) {
    console.error("[SyncQueue] Error counting queue items:", err);
    return 0;
  }
};

/**
 * Enqueue a mutation into Dexie with version and causal metadata
 * 
 * @param {string} endpoint - API path (e.g., "/referrals", "/patients/vitals")
 * @param {string} method - HTTP Verb (POST, PUT, PATCH)
 * @param {Object} payload - Granular change data
 * @param {number} clientVersion - Entity version to prevent race overwrites
 */
export const enqueueAction = async (
  endpoint,
  method = "POST",
  payload = {},
  clientVersion = 1
) => {
  const queuedItem = {
    queueId: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    endpoint,
    method,
    payload,
    metadata: {
      clientVersion,
      clientTimestamp: new Date().toISOString(),
      deviceRole: localStorage.getItem("swasthya_role") || "worker",
    },
    retryCount: 0,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  try {
    await db.syncQueue.put(queuedItem);

    // Notify Topbar and UI badges of pending queue updates
    const count = await getOfflineQueueCount();
    window.dispatchEvent(
      new CustomEvent("swasthya_queue_updated", { detail: count })
    );

    // If online, trigger background processing immediately
    if (navigator.onLine && !isSyncing) {
      processOfflineQueue();
    }

    return queuedItem;
  } catch (error) {
    console.error("[SyncQueue] Failed to enqueue action into Dexie:", error);
    throw error;
  }
};

/**
 * Chronologically processes queued actions with jittered retry & conflict handling
 */
export const processOfflineQueue = async (onItemSynced, onConflict) => {
  if (isSyncing || !navigator.onLine) return;
  isSyncing = true;

  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) {
      isSyncing = false;
      return;
    }

    for (const item of queue) {
      // Abort run if connection drops mid-batch
      if (!navigator.onLine) break;

      try {
        const response = await apiClient({
          url: item.endpoint,
          method: item.method,
          data: item.payload,
          headers: {
            "X-Client-Version": item.metadata.clientVersion,
            "X-Client-Timestamp": item.metadata.clientTimestamp,
            "X-Device-Role": item.metadata.deviceRole,
          },
        });

        // Success: Delete from Dexie queue
        await db.syncQueue.delete(item.queueId);

        if (onItemSynced) {
          onItemSynced(item, response.data);
        }
      } catch (error) {
        // Handle 409 Conflict: Server detected newer state (e.g. Doctor updated while Worker was offline)
        if (error.response && error.response.status === 409) {
          console.warn(`[SyncQueue] 409 Conflict on ${item.queueId}:`, error.response.data);

          await db.syncQueue.update(item.queueId, {
            status: "conflict",
            conflictDetails: error.response.data,
          });

          if (onConflict) {
            onConflict(item, error.response.data);
          }
          continue;
        }

        // Network / Server 5xx failure: Apply Exponential Backoff + Jitter
        const newRetryCount = (item.retryCount || 0) + 1;
        await db.syncQueue.update(item.queueId, { retryCount: newRetryCount });

        const delay = getBackoffWithJitter(newRetryCount);
        console.warn(
          `[SyncQueue] Action ${item.queueId} failed (attempt ${newRetryCount}). Waiting ${Math.round(delay)}ms...`
        );

        // Pause loop to protect backend gateway from replay storms
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } catch (batchErr) {
    console.error("[SyncQueue] Unexpected error during batch sync:", batchErr);
  } finally {
    isSyncing = false;
    const remaining = await getOfflineQueueCount();
    window.dispatchEvent(
      new CustomEvent("swasthya_queue_updated", { detail: remaining })
    );
  }
};

/**
 * Initializes network listeners to auto-flush queue on reconnection
 */
export const initOfflineSyncListener = (onSyncComplete, onConflict) => {
  const handleOnline = () => {
    // 1-3s random initial jitter to avoid simultaneous cluster reconnection storms
    const initialJitter = 1000 + Math.random() * 2000;
    setTimeout(() => {
      processOfflineQueue(onSyncComplete, onConflict);
    }, initialJitter);
  };

  window.addEventListener("online", handleOnline);

  // Initial pass on mount if connected
  if (navigator.onLine) {
    handleOnline();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
  };
};

export default {
  enqueueAction,
  processOfflineQueue,
  initOfflineSyncListener,
  getOfflineQueue,
  getOfflineQueueCount,
};