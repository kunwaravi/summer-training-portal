import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

interface AuthContextType {
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      // Seed with local storage immediately if available
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      try {
        // Fetch fresh user profile from backend (includes complete course progress)
        const response = await api.get('/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Session sync failed:', error);
        // Session cookie is likely invalid or expired, clear auth state
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };
    
    syncAuth();
  }, []);

  const login = (_token: string, userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
