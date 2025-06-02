import { ref, set, serverTimestamp, get, update } from "firebase/database";
import { db } from "./firebase";
import { User as FirebaseAuthUser } from "firebase/auth";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt: object | number;
}

export async function upsertUserInDatabase(
  firebaseUser: FirebaseAuthUser,
  additionalData: Partial<Pick<UserProfile, 'displayName' | 'photoURL'>> = {}
): Promise<void> {
  if (!firebaseUser?.uid) {
    throw new Error("UID do usuário é inválido para salvar no banco de dados.");
  }

  const userRef = ref(db, `users/${firebaseUser.uid}`);

  try {
    const snapshot = await get(userRef);

    const currentDisplayNameInDb = snapshot.exists() ? snapshot.val().displayName : null;
    const displayName = additionalData.displayName || firebaseUser.displayName || currentDisplayNameInDb || 'Usuário Anônimo';

    const currentPhotoURLInDb = snapshot.exists() ? snapshot.val().photoURL : null;
    const photoURL = additionalData.photoURL || firebaseUser.photoURL || currentPhotoURLInDb || null;

    const userDataForUpdate: Partial<UserProfile> = {
      uid: firebaseUser.uid,
      displayName: displayName,
      email: firebaseUser.email,
      photoURL: photoURL,
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
    console.error("Erro ao salvar/atualizar usuário no Realtime Database:", error);
    throw error;
  }
}

export async function getUserFromDatabase(userId: string): Promise<UserProfile | null> {
  if (!userId) {
    return null;
  }
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