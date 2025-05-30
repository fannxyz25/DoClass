import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const updateUser = (newUserData) => {
    try {
      if (newUserData) {
        sessionStorage.setItem('user', JSON.stringify(newUserData));
      } else {
        sessionStorage.removeItem('user');
      }
      setUser(newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (isLoading) return null;

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 