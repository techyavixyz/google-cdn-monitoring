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
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  requiresPasswordChange: boolean;
  setRequiresPasswordChange: (value: boolean) => void;
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
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('kloudscope_token');
    const storedUser = localStorage.getItem('kloudscope_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Check if password change is required after login
  const checkPasswordChangeRequired = (userData: User) => {
    if (userData.username === 'admin') {
      const passwordChanged = localStorage.getItem('kloudscope_password_changed');
      if (!passwordChanged) {
        setRequiresPasswordChange(true);
        return true;
      }
    }
    return false;
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

    // Check if password change is required only after successful login
    checkPasswordChangeRequired(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRequiresPasswordChange(false);
    localStorage.removeItem('kloudscope_token');
    localStorage.removeItem('kloudscope_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading, 
      requiresPasswordChange, 
      setRequiresPasswordChange 
    }}>
      {children}
    </AuthContext.Provider>
  );
};