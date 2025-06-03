import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "./firebase";

export const sendFriendRequest = async (
  requesterUid: string,
  requesteeUid: string
) => {
  try {
    const requestRef = ref(
      db,
      `friendRequests/${requesteeUid}/${requesterUid}`
    );
    await set(requestRef, {
      status: "pending",
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar pedido de amizade:", error);
    return false;
  }
};
