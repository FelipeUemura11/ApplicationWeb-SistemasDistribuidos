/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, update, serverTimestamp, get } from "firebase/database";
import { db } from "./firebase";

export async function acceptFriendRequest(
  requesterId: string,
  requesteeId: string
): Promise<void> {
  const updates: { [key: string]: any } = {};

  // Atualiza o status
  updates[`friendRequestsReceived/${requesteeId}/${requesterId}/status`] =
    "accepted";
  updates[`friendRequestsSent/${requesterId}/${requesteeId}/status`] =
    "accepted";

  const timestamp = serverTimestamp();
  updates[`users/${requesteeId}/contacts/${requesterId}`] = {
    addedAt: timestamp,
  };
  updates[`users/${requesterId}/contacts/${requesteeId}`] = {
    addedAt: timestamp,
  };

  await update(ref(db), updates);
}

export async function declineFriendRequest(
  requesterId: string,
  requesteeId: string
): Promise<void> {
  const updates: { [key: string]: any } = {};

  updates[`friendRequestsReceived/${requesteeId}/${requesterId}`] = null;
  updates[`friendRequestsSent/${requesterId}/${requesteeId}`] = null;

  await update(ref(db), updates);
}

export const fetchFriendRequests = async (uid: string) => {
  const requestsRef = ref(db, `friendRequestsReceived/${uid}`);
  const snapshot = await get(requestsRef);

  if (snapshot.exists()) {
    const requests = snapshot.val();
    return Object.entries(requests)
      .filter(([, value]: any) => value.status === "pending")
      .map(([requesterId, value]: any) => ({
        requesterId,
        ...value,
      }));
  }
  return [];
};
