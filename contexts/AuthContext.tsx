import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { addUser } from '../data/users';
import { useData } from './DataContext';
import { setValue } from '@/utils/localStorage';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/utils/auth';
import { LoginApi } from '@/apis/service/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { users } = useData(); // Get users from central context
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        const payload = decodeJwt(storedToken);
        // check expiry
        if (payload && payload.exp * 1000 > Date.now()) {
          const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          const loggedInUser: User = {
            id: payload.UserId,
            name: payload.unique_name,
            email: payload.email,
            companyId: 'COMP001', // Default company ID as it's not in token
            role: userRole as UserRole,
          };
          setUser(loggedInUser);
        } else {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state from token", error);
      localStorage.clear();
      setUser(null);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mocking the API call due to browser security restrictions (CORS/Mixed Content)
    // that prevent fetching from a local IP address.
    const res = await LoginApi("SuperAdminInfi", "Adm!n123");
    if (res?.data.accessToken) {
      // navigate('/');
      const decoded = jwtDecode<JwtPayload>(res?.data.accessToken);
      setValue('accessToken', res?.data.accessToken);
      setValue('refreshToken', res?.data.refreshToken);
      setValue('userId', decoded.UserId);

    }
    let foundUser: User | undefined;

    // Special case for the provided API credentials from the sign-in page
    if (email.toLowerCase() === 'SuperAdminInfi' && password === 'Adm!n123') {
      foundUser = {
        id: 'API_USER_001',
        name: 'Super Admin',
        email: 'SuperAdminInfi@yopmail.com',
        companyId: 'COMP001',
        role: UserRole.Admin,
      };
    } else {
      // Fallback to existing mock users for other test cases
      foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    }

    if (foundUser) {
      setUser(foundUser);
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

    const newUser = addUser({ name, email, password, companyId: 'COMP001', role: UserRole.Sales });

    // Create JWT for new user
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const exp = Math.floor(futureDate.getTime() / 1000);

    const payload = {
      "unique_name": newUser.name,
      "email": newUser.email,
      "UserId": newUser.id,
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": newUser.role,
      "exp": exp
    };

    const encodedHeader = btoa(JSON.stringify({ "alg": "HS256", "typ": "JWT" }));
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeSignature = "fakeSignature";

    const accessToken = `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
    const refreshToken = "fake-refresh-token";

    setUser(newUser);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    navigate('/');
    return true;
  };


  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
