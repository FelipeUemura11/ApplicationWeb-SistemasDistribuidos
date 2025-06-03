import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();

export const sendFriendRequest = async (
  requesterId: string,
  requesteeId: string,
  requesterDisplayName: string
) => {
  const timestamp = Date.now();

  try {
    await Promise.all([
      set(ref(db, `friendRequestsSent/${requesterId}/${requesteeId}`), {
        status: "pending",
        timestamp,
        requesterDisplayName,
      }),
      set(ref(db, `friendRequestsReceived/${requesteeId}/${requesterId}`), {
        status: "pending",
        timestamp,
        requesterDisplayName,
      }),
    ]);
    return true;
  } catch (error) {
    console.error("Erro ao enviar pedido de amizade:", error);
    return false;
  }

  return true;
};
