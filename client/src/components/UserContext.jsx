import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user data from localStorage on mount
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const updateUser = (userData) => {
    try {
      if (userData) {
        // Save complete user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        // Clear user data on logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setUser(null);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

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