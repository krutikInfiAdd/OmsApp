import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { mockUsers, addUser } from '../data/users';
import { useData } from './DataContext';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { users } = useData(); // Get users from central context
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Note: We use the original mockUsers for password check, as context doesn't expose passwords
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in state or localStorage
      
      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      navigate('/');
      return true;
    }
    return false;
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return false;
    }
    
    // In a real app, the default company might be handled differently
    const newUser = addUser({ name, email, password, companyId: 'COMP001', role: UserRole.Sales });
    
    const userToStore = { ...newUser };
    delete userToStore.password;

    setUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    navigate('/');
    return true;
  };


  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};