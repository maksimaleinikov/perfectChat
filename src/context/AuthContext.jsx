import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
  error: null,
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authSubscription = auth.onAuthStateChanged(
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (authError) => {
        setError(authError);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return authSubscription;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

//Custom hook for context

export const useAuth = () => {
  return useContext(AuthContext);
};
