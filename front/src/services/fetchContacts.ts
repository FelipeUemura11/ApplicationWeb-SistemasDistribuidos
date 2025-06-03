/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

export async function fetchContacts() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) return [];

  const uid = currentUser.uid;

  const receivedRef = ref(db, `friendRequestsReceived/${uid}`);
  const sentRef = ref(db, `friendRequestsSent/${uid}`);

  const [receivedSnap, sentSnap] = await Promise.all([
    get(receivedRef),
    get(sentRef),
  ]);

  const contactUids = new Set<string>();

  if (receivedSnap.exists()) {
    const received = receivedSnap.val();
    Object.entries(received).forEach(([senderUid, data]: any) => {
      if (data.status === "accepted") {
        contactUids.add(senderUid);
      }
    });
  }

  if (sentSnap.exists()) {
    const sent = sentSnap.val();
    Object.entries(sent).forEach(([receiverUid, data]: any) => {
      if (data.status === "accepted") {
        contactUids.add(receiverUid);
      }
    });
  }

  const contactDetails = await Promise.all(
    Array.from(contactUids).map(async (contactUid) => {
      const userSnap = await get(ref(db, `users/${contactUid}`));
      if (userSnap.exists()) {
        return userSnap.val();
      }
      return null;
    })
  );

  // Filtra nulos, caso algum contato tenha sido removido
  return contactDetails.filter(Boolean);
}
