
import React, { createContext, useContext, useState, useEffect } from 'react';

// This would normally be in an environment variable
const JWT_SECRET = "your_jwt_secret_key";

type User = {
  _id: string;
  name: string;
  email: string;
  authProvider?: 'email' | 'google';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real application, we'd connect to MongoDB
  // For now, we'll simulate this with localStorage
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real app, verify the token with JWT
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
        } catch (error) {
          console.error('Auth token invalid:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulating a database call
      // In a real app, we'd query MongoDB
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        console.error('User not found');
        return false;
      }
      
      // Compare password (in a real app we'd use bcrypt.compare)
      const isPasswordValid = password === user.password; // Simplified for demo
      
      if (!isPasswordValid) {
        console.error('Invalid password');
        return false;
      }
      
      // Create JWT token (simplified)
      const token = 'simulated_jwt_token';
      
      // Save auth data
      localStorage.setItem('token', token);
      
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: 'email' as const
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd use Firebase or another OAuth provider
      // For this demo, we'll simulate a successful Google login
      const googleUser = {
        _id: `google_user_${Date.now()}`,
        name: "Google User",
        email: `user_${Date.now()}@gmail.com`,
        authProvider: 'google' as const
      };
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // In a real app, we'd check if the email exists in our database
      // If not, we'd create a new user record
      
      // For this demo, let's just add them as a new user if not found
      const existingUser = users.find((u: any) => u.email === googleUser.email);
      
      if (!existingUser) {
        users.push({
          _id: googleUser._id,
          name: googleUser.name,
          email: googleUser.email,
          authProvider: 'google',
          password: null // Google users don't have passwords
        });
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Create JWT token (simplified)
      const token = 'simulated_google_jwt_token';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(googleUser));
      
      setUser(googleUser);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        console.error('User already exists');
        return false;
      }
      
      // Create new user
      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email,
        password, // In a real app, hash the password with bcrypt
        authProvider: 'email'
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
