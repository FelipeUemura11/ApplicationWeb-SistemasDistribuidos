import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserFromDatabase } from "../services/userService"; // Import necessário

// Extensão da interface User
interface ExtendedUser extends User {
  userCode?: string;
}

interface AuthContextType {
  currentUser: ExtendedUser | null;
  loadingAuth: boolean;
  signUp: (
    email: string,
    password: string
  ) => Promise<UserCredential | AuthError>;
  signIn: (
    email: string,
    password: string
  ) => Promise<UserCredential | AuthError>;
  logOut: () => Promise<void>;
  updateUserProfile: (profileData: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  async function updateUserProfile(profileData: {
    displayName?: string;
    photoURL?: string;
  }) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, profileData);
      // Após atualizar, também busca o userCode atualizado
      const profile = await getUserFromDatabase(auth.currentUser.uid);
      const updatedUser: ExtendedUser = {
        ...auth.currentUser,
        userCode: profile?.userCode ?? undefined,
      };
      setCurrentUser(updatedUser);
    } else {
      throw new Error("No current user to update profile.");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserFromDatabase(user.uid);
          const extendedUser: ExtendedUser = {
            ...user,
            userCode: profile?.userCode ?? undefined,
          };
          setCurrentUser(extendedUser);
        } catch (err) {
          console.error("Erro ao buscar userCode:", err);
          setCurrentUser(user); // fallback
        }
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loadingAuth,
    signUp,
    signIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}
