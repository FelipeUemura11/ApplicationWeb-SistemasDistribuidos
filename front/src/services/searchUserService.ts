/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, get } from "firebase/database";
import { db } from "./firebase";

export const handleSearch = async (value: string): Promise<any[]> => {
  if (value.trim().length < 3) return [];

  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) return [];

  const allUsers = Object.values(snapshot.val()) as any[];

  const filtered = allUsers.filter(
    (user) =>
      user.email?.toLowerCase().includes(value.toLowerCase()) ||
      user.userCode?.toLowerCase().includes(value.toUpperCase())
  );

  return filtered;
};
