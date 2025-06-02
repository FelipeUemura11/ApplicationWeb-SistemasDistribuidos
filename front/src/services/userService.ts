import { ref, set, serverTimestamp, get, update } from "firebase/database";
import { db } from "./firebase";
import { User as FirebaseAuthUser } from "firebase/auth";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  userCode: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt: object | number;
}

function generateUserCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const getRandomChar = () =>
    chars.charAt(Math.floor(Math.random() * chars.length));

  const part1 = Array.from({ length: 3 }, getRandomChar).join("");
  const part2 = Array.from({ length: 4 }, getRandomChar).join("");

  return `${part1}-${part2}`;
}

async function isUserCodeUnique(userCode: string): Promise<boolean> {
  const codeRef = ref(db, `userCodes/${userCode}`);
  const snapshot = await get(codeRef);
  return !snapshot.exists(); // true se ainda não existe
}

async function generateUniqueUserCode(): Promise<string> {
  let code = "";
  let unique = false;

  while (!unique) {
    code = generateUserCode();
    unique = await isUserCodeUnique(code);
  }

  return code;
}

export async function upsertUserInDatabase(
  firebaseUser: FirebaseAuthUser,
  additionalData: Partial<
    Pick<UserProfile, "displayName" | "photoURL" | "userCode">
  > = {}
): Promise<void> {
  if (!firebaseUser?.uid) {
    throw new Error("UID do usuário é inválido para salvar no banco de dados.");
  }

  const userRef = ref(db, `users/${firebaseUser.uid}`);

  try {
    const snapshot = await get(userRef);

    const currentDisplayNameInDb = snapshot.exists()
      ? snapshot.val().displayName
      : null;
    const displayName =
      additionalData.displayName ||
      firebaseUser.displayName ||
      currentDisplayNameInDb ||
      "Usuário Anônimo";

    const currentPhotoURLInDb = snapshot.exists()
      ? snapshot.val().photoURL
      : null;
    const photoURL =
      additionalData.photoURL ||
      firebaseUser.photoURL ||
      currentPhotoURLInDb ||
      null;

    let userCode = additionalData.userCode || snapshot.val()?.userCode || null;

    const isNewUser = !snapshot.exists();

    if (!userCode && isNewUser) {
      userCode = await generateUniqueUserCode();
      const userCodeRef = ref(db, `userCodes/${userCode}`);
      await set(userCodeRef, firebaseUser.uid); // Grava o código único no nó userCodes
    }

    const userDataForUpdate: Partial<UserProfile> = {
      uid: firebaseUser.uid,
      displayName,
      email: firebaseUser.email,
      photoURL,
      userCode,
    };

    if (snapshot.exists()) {
      await update(userRef, userDataForUpdate);
    } else {
      await set(userRef, {
        ...userDataForUpdate,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error(
      "Erro ao salvar/atualizar usuário no Realtime Database:",
      error
    );
    throw error;
  }
}

export async function getUserFromDatabase(
  userId: string
): Promise<UserProfile | null> {
  if (!userId) return null;

  const userRef = ref(db, `users/${userId}`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário no Realtime Database:", error);
    throw error;
  }
}
