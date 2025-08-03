import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isFirstTimeSetup: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

  useEffect(() => {
    checkFirstTimeSetup();
    const storedToken = localStorage.getItem('kloudscope_token');
    const storedUser = localStorage.getItem('kloudscope_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const checkFirstTimeSetup = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/check-setup');
      const data = await response.json();
      setIsFirstTimeSetup(data.isFirstTimeSetup);
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    
    localStorage.setItem('kloudscope_token', data.token);
    localStorage.setItem('kloudscope_user', JSON.stringify(data.user));
  };

  const signup = async (username: string, email: string, password: string, fullName?: string) => {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    setIsFirstTimeSetup(false);
    
    localStorage.setItem('kloudscope_token', data.token);
    localStorage.setItem('kloudscope_user', JSON.stringify(data.user));
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process forgot password request');
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    const response = await fetch('http://localhost:3001/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset password');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    
    localStorage.setItem('kloudscope_token', data.token);
    localStorage.setItem('kloudscope_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kloudscope_token');
    localStorage.removeItem('kloudscope_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isFirstTimeSetup,
      login, 
      signup,
      forgotPassword,
      resetPassword,
      logout, 
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};