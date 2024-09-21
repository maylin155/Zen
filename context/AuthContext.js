import { useState, useContext, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set the authenticated user
  const setAuth = (authUser) => {
    setUser(authUser);
  };

  // Function to set or update user data, merging with existing data
  const setUserData = (userData) => {
    setUser({...userData});
  }

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
