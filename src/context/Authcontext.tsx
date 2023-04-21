import React, {
  useContext,
  useState,
  useEffect,
  ReactNode,
  ContextType,
} from "react";
import firebase from "firebase/app";
import { auth } from "../config/firebase";

interface AuthContextValue {
  currentUser?: firebase.User | null;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  signup: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): ContextType<typeof AuthContext> {
  return useContext(AuthContext);
}

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email: string): Promise<void> {
    if (currentUser !== null) return currentUser.updateEmail(email);
    return new Promise<void>(() => {});
  }

  function updatePassword(password: string): Promise<void> {
    if (currentUser !== null) return currentUser.updatePassword(password);
    return new Promise<void>(() => {});
  }

  useEffect(() => {
    (async () => {
      const unsubscribe: firebase.Unsubscribe = await auth.onAuthStateChanged(
        (user) => {
          setCurrentUser(user);
          setLoading(false);
        }
      );
      return unsubscribe;
    })();
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
